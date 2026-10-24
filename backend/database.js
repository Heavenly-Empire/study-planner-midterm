import Database from 'better-sqlite3'

export function openDatabase(filename = 'study-planner.db') {
  const db = new Database(filename)
  db.pragma('foreign_keys = ON')
  db.pragma('journal_mode = WAL')
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE COLLATE NOCASE,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('administrator', 'client'))
    );
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL CHECK (length(trim(title)) > 0),
      course TEXT NOT NULL CHECK (length(trim(course)) > 0),
      due_date TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      scope TEXT NOT NULL CHECK (scope IN ('class', 'personal')),
      owner_id INTEGER NOT NULL REFERENCES users(id),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS activity_progress (
      activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      completed INTEGER NOT NULL DEFAULT 0 CHECK (completed IN (0, 1)),
      PRIMARY KEY (activity_id, student_id)
    );
    CREATE INDEX IF NOT EXISTS activities_owner ON activities(owner_id);
    CREATE INDEX IF NOT EXISTS progress_student ON activity_progress(student_id);
  `)
  return db
}
