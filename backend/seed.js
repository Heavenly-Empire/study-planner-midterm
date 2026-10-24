import bcrypt from 'bcryptjs'
import { openDatabase } from './database.js'

const db = openDatabase(process.env.DATABASE_PATH)
const insertUser = db.prepare('INSERT INTO users (username, name, password_hash, role) VALUES (?, ?, ?, ?) ON CONFLICT(username) DO NOTHING')
const insertActivity = db.prepare('INSERT INTO activities (title, course, due_date, notes, scope, owner_id) VALUES (?, ?, ?, ?, ?, ?)')
db.transaction(() => {
  const hash = bcrypt.hashSync('demo123', 10)
  insertUser.run('lecturer', 'Dr. Aris', hash, 'administrator')
  insertUser.run('student', 'Budi Santoso', hash, 'client')
  const lecturer = db.prepare('SELECT id FROM users WHERE username = ?').get('lecturer')
  // Seed only an empty activity table. Re-running this command keeps existing work.
  if (db.prepare('SELECT count(*) AS count FROM activities').get().count === 0) {
    insertActivity.run('Review authentication flow', 'Web and Mobile Application Development', '2026-10-27', 'Trace login, JWT verification, and a protected request.', 'class', lecturer.id)
    insertActivity.run('Check the project data model', 'Web and Mobile Application Development', '2026-10-29', 'Review the users, activities, and completion relationships.', 'class', lecturer.id)
  }
})()
db.close()
console.log('Local demo accounts ready: lecturer / demo123 and student / demo123.')
