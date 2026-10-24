import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { openDatabase } from './database.js'
import { createApp } from './app.js'

const secret = 'test-only-secret-with-more-than-32-characters'
test('authentication, ownership, CRUD, completion and persistence', async (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'planner-test-'))
  const filename = join(dir, 'test.db')
  let db = openDatabase(filename)
  const hash = await bcrypt.hash('secret123', 4)
  db.prepare("INSERT INTO users (username, name, password_hash, role) VALUES ('teacher', 'Teacher', ?, 'administrator')").run(hash)
  let server = createApp(db, { secret }).listen(0, '127.0.0.1')
  await new Promise(resolve => server.once('listening', resolve))
  let base = `http://127.0.0.1:${server.address().port}`
  t.after(async () => { await new Promise(resolve => server.close(resolve)); db.close(); rmSync(dir, { recursive: true, force: true }) })
  async function request(path, method = 'GET', body, token) {
    const response = await fetch(base + '/api' + path, { method,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}) })
    return { status: response.status, data: response.status === 204 ? null : await response.json() }
  }
  const login = async username => (await request('/auth/login', 'POST', { username, password: 'secret123' })).data.token
  let student, other, teacher, classTask, privateTask
  await t.test('registration cannot grant lecturer privileges; duplicate names and invalid types fail', async () => {
    const result = await request('/auth/register', 'POST', { username: 'alice', name: 'Alice', password: 'secret123', role: 'administrator' })
    assert.equal(result.status, 201); assert.equal(result.data.role, 'client'); assert.equal(result.data.password_hash, undefined)
    assert.equal((await request('/auth/register', 'POST', { username: 'ALICE', name: 'Alice', password: 'secret123' })).status, 409)
    assert.equal((await request('/auth/register', 'POST', { username: 5, name: 'Bad', password: 'secret123' })).status, 400)
    await request('/auth/register', 'POST', { username: 'bob', name: 'Bob', password: 'secret123' })
    student = await login('alice'); other = await login('bob'); teacher = await login('teacher')
  })
  await t.test('protected routes reject missing, tampered and expired tokens and bad credentials', async () => {
    assert.equal((await request('/activities')).status, 401)
    assert.equal((await request('/activities', 'GET', undefined, student + 'bad')).status, 401)
    assert.equal((await request('/activities', 'GET', undefined, jwt.sign({}, secret, { subject: '1', expiresIn: -1 }))).status, 401)
    assert.equal((await request('/auth/login', 'POST', { username: 'alice', password: 'wrong' })).status, 401)
  })
  await t.test('server assigns scope and owner; students cannot read each other or edit class work', async () => {
    const body = { title: 'JWT review', course: 'Web Development', dueDate: '2026-10-29', notes: 'Review middleware.' }
    classTask = (await request('/activities', 'POST', body, teacher)).data
    privateTask = (await request('/activities', 'POST', { ...body, scope: 'class', ownerId: 1 }, student)).data
    assert.equal(privateTask.scope, 'personal'); assert.notEqual(privateTask.ownerId, 1)
    assert.equal((await request(`/activities/${privateTask.id}`, 'GET', undefined, other)).status, 404)
    assert.equal((await request(`/activities/${privateTask.id}`, 'GET', undefined, teacher)).status, 404)
    assert.equal((await request(`/activities/${classTask.id}`, 'PUT', body, student)).status, 403)
    assert.equal((await request(`/activities/${classTask.id}`, 'DELETE', undefined, student)).status, 403)
    assert.equal((await request('/activities', 'GET', undefined, other)).data.length, 1)
    assert.equal((await request('/activities', 'POST', { ...body, dueDate: '2026-02-30' }, student)).status, 400)
    assert.equal((await request('/activities', 'POST', { ...body, notes: 7 }, student)).status, 400)
  })
  await t.test('completion belongs to the student and lecturers see class totals only', async () => {
    assert.equal((await request(`/activities/${classTask.id}/completion`, 'PATCH', { completed: true }, student)).data.completed, 1)
    assert.equal((await request(`/activities/${classTask.id}`, 'GET', undefined, other)).data.completed, 0)
    assert.equal((await request('/progress', 'GET', undefined, teacher)).data[0].completed, 1)
    assert.equal((await request('/progress', 'GET', undefined, student)).status, 403)
  })
  await t.test('updates and profile edits persist after reopening the database', async () => {
    const result = await request(`/activities/${privateTask.id}`, 'PUT', { ...privateTask, title: 'Updated plan' }, student)
    assert.equal(result.data.title, 'Updated plan')
    assert.equal((await request('/profile', 'PUT', { name: 'Alice Updated', role: 'administrator' }, student)).data.role, 'client')
    await new Promise(resolve => server.close(resolve)); db.close()
    db = openDatabase(filename); server = createApp(db, { secret }).listen(0, '127.0.0.1')
    await new Promise(resolve => server.once('listening', resolve)); base = `http://127.0.0.1:${server.address().port}`
    assert.equal((await request(`/activities/${privateTask.id}`, 'GET', undefined, student)).data.title, 'Updated plan')
    assert.equal((await request('/auth/me', 'GET', undefined, student)).data.name, 'Alice Updated')
    assert.equal((await request(`/activities/${classTask.id}`, 'GET', undefined, student)).data.completed, 1)
  })
  await t.test('deletion removes completion records and is absent after reopening', async () => {
    assert.equal((await request(`/activities/${classTask.id}`, 'DELETE', undefined, teacher)).status, 204)
    assert.equal(db.prepare('SELECT count(*) AS n FROM activity_progress').get().n, 0)
    assert.equal((await request(`/activities/${privateTask.id}`, 'DELETE', undefined, other)).status, 404)
    assert.equal((await request(`/activities/${privateTask.id}`, 'DELETE', undefined, student)).status, 204)
    await new Promise(resolve => server.close(resolve)); db.close()
    db = openDatabase(filename); server = createApp(db, { secret }).listen(0, '127.0.0.1')
    await new Promise(resolve => server.once('listening', resolve)); base = `http://127.0.0.1:${server.address().port}`
    assert.deepEqual((await request('/activities', 'GET', undefined, student)).data, [])
  })
})
