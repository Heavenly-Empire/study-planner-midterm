import { createServer } from 'node:http'
import { databaseTarget, openDatabase } from './database.js'
import { createApp } from './app.js'
import { createAiService } from './ai.js'

// A hosted or production setup without Turso settings stops here. It never uses a local file.
let db
try {
  db = await openDatabase(databaseTarget())
} catch (error) {
  console.error(`Study Planner API could not open its database: ${error.message}`)
  process.exit(1)
}

// A missing or short JWT_SECRET stops startup with one clear line instead of a stack trace.
let app
try {
  app = createApp(db, { secret: process.env.JWT_SECRET, origin: process.env.WEB_ORIGIN,
    ai: createAiService({ apiKey: process.env.OPENROUTER_API_KEY, model: process.env.AI_MODEL }) })
} catch (error) {
  console.error(`Study Planner API could not start: ${error.message}`)
  db.close()
  process.exit(1)
}
const host = process.env.HOST || '127.0.0.1'
const port = Number(process.env.PORT ?? 3000)
const server = createServer(app)
server.on('listening', () => {
  console.log(`Study Planner API listening on ${host}:${server.address().port}`)
})
server.on('error', error => {
  console.error(`Study Planner API could not listen on ${host}:${port} (${error.code}).`)
  if (error.code === 'EADDRINUSE') {
    console.error('This port is already in use. Check whether another backend terminal is running.')
  } else if (error.code === 'EACCES') {
    console.error('Windows denied access to this port. Try another PORT in backend/.env.')
  } else {
    console.error(error.message)
  }
  db.close()
  process.exitCode = 1
})
server.listen(port, host)

function stop() {
  server.close(() => { db.close(); process.exit(0) })
}
process.on('SIGINT', stop)
process.on('SIGTERM', stop)