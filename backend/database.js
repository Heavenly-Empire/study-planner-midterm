import { pathToFileURL } from 'node:url'
import { createClient } from '@libsql/client'

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE COLLATE NOCASE,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('administrator', 'client'))
  )`,
  `CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL CHECK (length(trim(title)) > 0),
    course TEXT NOT NULL CHECK (length(trim(course)) > 0),
    due_date TEXT NOT NULL,
    notes TEXT NOT NULL DEFAULT '',
    scope TEXT NOT NULL CHECK (scope IN ('class', 'personal')),
    owner_id INTEGER NOT NULL REFERENCES users(id),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS activity_progress (
    activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    completed INTEGER NOT NULL DEFAULT 0 CHECK (completed IN (0, 1)),
    PRIMARY KEY (activity_id, student_id)
  )`,
  'CREATE INDEX IF NOT EXISTS activities_owner ON activities(owner_id)',
  'CREATE INDEX IF NOT EXISTS progress_student ON activity_progress(student_id)',
]

function localDatabaseUrl(filename) {
  return filename === ':memory:' ? filename : pathToFileURL(filename).href
}

export function databaseTarget(env = process.env) {
  const url = env.TURSO_DATABASE_URL?.trim()
  const authToken = env.TURSO_AUTH_TOKEN?.trim()
  const production = env.NODE_ENV === 'production'
  if (url || authToken || production) {
    if (!url || !authToken) {
      throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must both be set for a hosted or production database.')
    }
    const address = URL.canParse(url) ? new URL(url) : null
    if (!address?.hostname || !['libsql:', 'https:', 'wss:'].includes(address.protocol)) {
      throw new Error('TURSO_DATABASE_URL must point to a hosted database.')
    }
    return { url, authToken, remote: true }
  }
  return { url: localDatabaseUrl(env.DATABASE_PATH || 'study-planner.db'), remote: false }
}

// Accepts a local filename (tests, ':memory:') or a { url, authToken } target.
export async function openDatabase(target = 'study-planner.db') {
  const config = typeof target === 'string'
    ? { url: localDatabaseUrl(target), remote: false }
    : target
  const db = createClient({ url: config.url, authToken: config.authToken })
  try {
    if (!config.remote) await db.execute('PRAGMA foreign_keys = ON')
    await db.batch(SCHEMA, 'write')
  } catch (error) {
    db.close()
    throw error
  }
  return db
}
