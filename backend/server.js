import { openDatabase } from './database.js'
import { createApp } from './app.js'

const db = openDatabase(process.env.DATABASE_PATH)
const app = createApp(db, { secret: process.env.JWT_SECRET, origin: process.env.WEB_ORIGIN })
const server = app.listen(Number(process.env.PORT) || 3000, '127.0.0.1', () => {
  console.log(`Study Planner API: http://localhost:${server.address().port}`)
})
function stop() {
  server.close(() => { db.close(); process.exit(0) })
}
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
