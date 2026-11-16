import bcrypt from 'bcryptjs'
import { databaseTarget, openDatabase } from './database.js'

const target = databaseTarget()
const lecturerPassword = process.env.DEMO_LECTURER_PASSWORD || (target.remote ? '' : 'demo123')
const studentPassword = process.env.DEMO_STUDENT_PASSWORD || (target.remote ? '' : 'demo123')

// A hosted database needs an explicit confirmation and passwords chosen by the operator.
if (target.remote) {
  if (process.env.REMOTE_INIT_CONFIRMED !== 'YES') {
    console.error('Refusing to seed a remote database. Set REMOTE_INIT_CONFIRMED=YES to continue.')
    process.exit(1)
  }
  for (const [label, value] of [['DEMO_LECTURER_PASSWORD', lecturerPassword], ['DEMO_STUDENT_PASSWORD', studentPassword]]) {
    if (!value || value === 'demo123' || value.length < 6 || Buffer.byteLength(value) > 72) {
      console.error(`${label} must be set to a new password of 6 to 72 bytes (not demo123).`)
      process.exit(1)
    }
  }
}

const db = await openDatabase(target)
try {
  const [lecturerHash, studentHash] = await Promise.all([bcrypt.hash(lecturerPassword, 10), bcrypt.hash(studentPassword, 10)])
  const insertUser = `INSERT INTO users (username, name, password_hash, role) VALUES (?, ?, ?, ?) ON CONFLICT(username) DO NOTHING`
  // One write transaction. The activities are inserted only if the table is still empty.
  // Both starter rows go in one statement, so the emptiness check sees the table as it was before.
  await db.batch([
    { sql: insertUser, args: ['lecturer', 'Dr. Aris', lecturerHash, 'administrator'] },
    { sql: insertUser, args: ['student', 'Budi Santoso', studentHash, 'client'] },
    {
      sql: `INSERT INTO activities (title, course, due_date, notes, scope, owner_id)
        SELECT title, course, due_date, notes, 'class', (SELECT id FROM users WHERE username = 'lecturer')
        FROM (SELECT ? AS title, ? AS course, ? AS due_date, ? AS notes UNION ALL SELECT ?, ?, ?, ?)
        WHERE NOT EXISTS (SELECT 1 FROM activities)`,
      args: [
        'Review authentication flow', 'Web and Mobile Application Development', '2026-10-27', 'Trace login, JWT verification, and a protected request.',
        'Check the project data model', 'Web and Mobile Application Development', '2026-10-29', 'Review the users, activities, and completion relationships.',
      ],
    },
  ], 'write')
} finally {
  db.close()
}
console.log(target.remote
  ? 'Remote database ready. Accounts "lecturer" and "student" exist.'
  : 'Local demo accounts ready: lecturer / demo123 and student / demo123.')