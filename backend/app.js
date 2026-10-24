import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const publicUser = ({ id, username, name, role }) => ({ id, username, name, role })
const text = (value, max) => typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max
const activityFields = `a.id, a.title, a.course, a.due_date AS dueDate, a.notes, a.scope,
  a.owner_id AS ownerId, a.created_at AS createdAt, COALESCE(p.completed, 0) AS completed`

export function createApp(db, { secret, origin = 'http://localhost:5173' }) {
  if (!secret || secret.length < 32) throw new Error('JWT_SECRET must contain at least 32 characters.')
  const app = express()
  app.use(cors({ origin }))
  app.use(express.json({ limit: '32kb' }))
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

  app.post('/api/auth/register', async (req, res) => {
    const { username, name, password } = req.body ?? {}
    if (!text(username, 40) || !/^[a-zA-Z0-9_]+$/.test(username.trim()) || !text(name, 80)
        || typeof password !== 'string' || password.length < 6 || Buffer.byteLength(password) > 72) {
      return res.status(400).json({ error: 'Use a name, a username with letters/numbers/underscores, and a password of 6 to 72 bytes.' })
    }
    const hash = await bcrypt.hash(password, 10)
    try {
      // Public registration always creates a student; the request cannot grant a role.
      const result = db.prepare("INSERT INTO users (username, name, password_hash, role) VALUES (?, ?, ?, 'client')").run(username.trim(), name.trim(), hash)
      res.status(201).json(publicUser(db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid)))
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') return res.status(409).json({ error: 'Username already taken.' })
      throw error
    }
  })

  app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body ?? {}
    if (!text(username, 40) || typeof password !== 'string' || !password || Buffer.byteLength(password) > 72) {
      return res.status(400).json({ error: 'Username and password are required.' })
    }
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username.trim())
    // The same response and bcrypt work apply to unknown names and incorrect passwords.
    const hash = user?.password_hash ?? '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
    if (!(await bcrypt.compare(password, hash)) || !user) return res.status(401).json({ error: 'Invalid username or password.' })
    const token = jwt.sign({}, secret, { subject: String(user.id), expiresIn: '1h', algorithm: 'HS256' })
    res.json({ token, user: publicUser(user) })
  })

  app.use('/api', (req, res, next) => {
    const token = req.headers.authorization?.match(/^Bearer (\S+)$/)?.[1]
    try {
      if (!token) throw new Error('Missing token')
      const claims = jwt.verify(token, secret, { algorithms: ['HS256'] })
      req.user = db.prepare('SELECT * FROM users WHERE id = ?').get(claims.sub)
      if (!req.user) throw new Error('Unknown user')
      next()
    } catch {
      res.status(401).json({ error: 'Please sign in again. Your session is missing or expired.' })
    }
  })
  app.get('/api/auth/me', (req, res) => res.json(publicUser(req.user)))
  app.put('/api/profile', (req, res) => {
    if (!text(req.body?.name, 80)) return res.status(400).json({ error: 'Name is required (maximum 80 characters).' })
    db.prepare('UPDATE users SET name = ? WHERE id = ?').run(req.body.name.trim(), req.user.id)
    res.json(publicUser(db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id)))
  })

  const canRead = (user, a) => a.scope === 'class' || (user.role === 'client' && a.owner_id === user.id)
  const canManage = (user, a) => (user.role === 'administrator' && a.scope === 'class')
    || (user.role === 'client' && a.scope === 'personal' && a.owner_id === user.id)
  const readActivity = (id, user) => db.prepare(`SELECT ${activityFields} FROM activities a
    LEFT JOIN activity_progress p ON p.activity_id = a.id AND p.student_id = ? WHERE a.id = ?`).get(user.id, id)
  function validateActivity(body) {
    if (!text(body?.title, 120) || !text(body?.course, 100)) return 'Title and course are required (maximum 120 and 100 characters).'
    if (typeof body.dueDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.dueDate)
        || !Number.isFinite(Date.parse(body.dueDate)) || new Date(body.dueDate).toISOString().slice(0, 10) !== body.dueDate) return 'Enter a valid due date.'
    if (body.notes !== undefined && (typeof body.notes !== 'string' || body.notes.length > 2000)) return 'Notes must be text (maximum 2000 characters).'
    return null
  }
  app.get('/api/activities', (req, res) => {
    const rows = db.prepare(`SELECT ${activityFields} FROM activities a
      LEFT JOIN activity_progress p ON p.activity_id = a.id AND p.student_id = ?
      WHERE a.scope = 'class' OR (a.scope = 'personal' AND a.owner_id = ? AND ? = 'client')
      ORDER BY a.due_date, a.title`).all(req.user.id, req.user.id, req.user.role)
    res.json(rows)
  })
  app.post('/api/activities', (req, res) => {
    const error = validateActivity(req.body)
    if (error) return res.status(400).json({ error })
    const { title, course, dueDate, notes = '' } = req.body
    const scope = req.user.role === 'administrator' ? 'class' : 'personal'
    const result = db.prepare('INSERT INTO activities (title, course, due_date, notes, scope, owner_id) VALUES (?, ?, ?, ?, ?, ?)')
      .run(title.trim(), course.trim(), dueDate, notes.trim(), scope, req.user.id)
    res.status(201).json(readActivity(result.lastInsertRowid, req.user))
  })
  app.use('/api/activities/:id', (req, res, next) => {
    if (!/^[1-9]\d*$/.test(req.params.id)) return res.status(404).json({ error: 'Activity not found.' })
    req.activity = db.prepare('SELECT * FROM activities WHERE id = ?').get(req.params.id)
    if (!req.activity || !canRead(req.user, req.activity)) return res.status(404).json({ error: 'Activity not found.' })
    next()
  })
  app.get('/api/activities/:id', (req, res) => res.json(readActivity(req.activity.id, req.user)))
  app.put('/api/activities/:id', (req, res) => {
    if (!canManage(req.user, req.activity)) return res.status(403).json({ error: 'You cannot edit this activity.' })
    const error = validateActivity(req.body)
    if (error) return res.status(400).json({ error })
    const { title, course, dueDate, notes = '' } = req.body
    db.prepare('UPDATE activities SET title = ?, course = ?, due_date = ?, notes = ? WHERE id = ?')
      .run(title.trim(), course.trim(), dueDate, notes.trim(), req.activity.id)
    res.json(readActivity(req.activity.id, req.user))
  })
  app.delete('/api/activities/:id', (req, res) => {
    if (!canManage(req.user, req.activity)) return res.status(403).json({ error: 'You cannot delete this activity.' })
    db.prepare('DELETE FROM activities WHERE id = ?').run(req.activity.id)
    res.status(204).end()
  })
  app.patch('/api/activities/:id/completion', (req, res) => {
    if (req.user.role !== 'client') return res.status(403).json({ error: 'Completion is recorded by each student.' })
    if (typeof req.body?.completed !== 'boolean') return res.status(400).json({ error: 'completed must be true or false.' })
    db.prepare(`INSERT INTO activity_progress (activity_id, student_id, completed) VALUES (?, ?, ?)
      ON CONFLICT(activity_id, student_id) DO UPDATE SET completed = excluded.completed`)
      .run(req.activity.id, req.user.id, Number(req.body.completed))
    res.json(readActivity(req.activity.id, req.user))
  })
  app.get('/api/progress', (req, res) => {
    if (req.user.role !== 'administrator') return res.status(403).json({ error: 'Lecturer access required.' })
    // Aggregate class completions only; lecturers never receive private task details.
    res.json(db.prepare(`SELECT a.id, a.title,
      (SELECT count(*) FROM users WHERE role = 'client') AS students,
      (SELECT count(*) FROM activity_progress p WHERE p.activity_id = a.id AND p.completed = 1) AS completed
      FROM activities a WHERE a.scope = 'class' ORDER BY a.due_date`).all())
  })
  app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }))
  app.use((err, _req, res, _next) => {
    if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON.' })
    if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Request is too large.' })
    console.error(err)
    res.status(500).json({ error: 'The server could not complete the request.' })
  })
  return app
}
