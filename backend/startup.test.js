import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdtemp, rm } from 'node:fs/promises'
import { request as httpRequest } from 'node:http'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { databaseTarget } from './database.js'

function launch(port, databasePath = ':memory:') {
  return spawn(process.execPath, [fileURLToPath(new URL('./server.js', import.meta.url))], {
    windowsHide: true,
    env: {
      ...process.env,
      NODE_ENV: 'test',
      TURSO_DATABASE_URL: '',
      TURSO_AUTH_TOKEN: '',
      PORT: String(port),
      HOST: '127.0.0.1',
      DATABASE_PATH: databasePath,
      JWT_SECRET: 'startup-test-only-secret-at-least-32-characters',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

test('startup reports an occupied port without masking the error', { timeout: 6000 }, async t => {
  const busy = createServer()
  await new Promise(resolve => busy.listen(0, '127.0.0.1', resolve))
  t.after(() => busy.close())
  const child = launch(busy.address().port)
  t.after(() => { if (child.exitCode === null) child.kill() })
  let output = ''
  child.stdout.on('data', chunk => { output += chunk })
  child.stderr.on('data', chunk => { output += chunk })
  const code = await new Promise(resolve => child.once('close', resolve))
  assert.equal(code, 1)
  assert.match(output, /EADDRINUSE/)
  assert.doesNotMatch(output, /TypeError/)
})

function listeningPort(child) {
  return new Promise((resolve, reject) => {
    let output = ''
    child.stdout.on('data', chunk => {
      output += chunk
      const match = output.match(/listening on 127\.0\.0\.1:(\d+)/)
      if (match) resolve(Number(match[1]))
    })
    child.once('exit', code => reject(new Error('Startup exited early: ' + code)))
    child.once('error', reject)
  })
}

// The OS can choose a loopback port that browser-compatible fetch rejects.
async function localRequest(url, { method = 'GET', token, body } = {}) {
  const request = httpRequest(url, {
    method,
    headers: {
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })
  const pending = once(request, 'response')
  request.end(body === undefined ? undefined : JSON.stringify(body))
  const [response] = await pending
  response.setEncoding('utf8')
  let content = ''
  for await (const chunk of response) content += chunk
  return { status: response.statusCode, data: content ? JSON.parse(content) : null }
}

test('startup listens successfully and answers health', { timeout: 6000 }, async t => {
  const child = launch(0)
  t.after(() => { if (child.exitCode === null) child.kill() })
  const port = await listeningPort(child)
  const response = await localRequest(`http://127.0.0.1:${port}/api/health`)
  assert.equal(response.status, 200)
  assert.deepEqual(response.data, { status: 'ok' })
})

test('production requires a hosted database address and token', () => {
  const production = { NODE_ENV: 'production' }
  assert.throws(() => databaseTarget(production), /must both be set/)
  for (const url of [':memory:', 'file:local.db', 'libsql:bad-address']) {
    assert.throws(() => databaseTarget({
      ...production, TURSO_DATABASE_URL: url, TURSO_AUTH_TOKEN: 'test-token',
    }), /must point to a hosted database/)
  }
  assert.equal(databaseTarget({
    ...production, TURSO_DATABASE_URL: 'libsql://example.invalid', TURSO_AUTH_TOKEN: 'test-token',
  }).remote, true)
})

async function withFileServer(filename, run) {
  const child = launch(0, filename)
  const closed = once(child, 'close')
  try {
    const base = `http://127.0.0.1:${await listeningPort(child)}/api`
    await run(base)
  } finally {
    // Wait for process exit so Windows releases the native SQLite file handles.
    if (child.exitCode === null && child.signalCode === null) child.kill()
    await closed
  }
}

test('activity and profile changes persist across API restarts', { timeout: 15000 }, async () => {
  const dir = await mkdtemp(join(tmpdir(), 'planner-test-'))
  const filename = join(dir, 'planner # demo.db')
  const credentials = { username: 'student', password: 'test-password' }
  const activity = { title: 'Study notes', course: 'Web Development', dueDate: '2026-11-30' }
  let token, id
  async function request(base, path, status, method = 'GET', body) {
    const response = await localRequest(base + path, { method, token, body })
    assert.equal(response.status, status)
    return response.data
  }
  try {
    await withFileServer(filename, async base => {
      await request(base, '/auth/register', 201, 'POST', { ...credentials, name: 'Student' })
      token = (await request(base, '/auth/login', 200, 'POST', credentials)).token
      id = (await request(base, '/activities', 201, 'POST', activity)).id
      await request(base, `/activities/${id}`, 200, 'PUT', { ...activity, title: 'Updated notes' })
      await request(base, `/activities/${id}/completion`, 200, 'PATCH', { completed: true })
      await request(base, '/profile', 200, 'PUT', { name: 'Updated student' })
    })
    await withFileServer(filename, async base => {
      const saved = await request(base, `/activities/${id}`, 200)
      assert.equal(saved.title, 'Updated notes')
      assert.equal(saved.completed, 1)
      assert.equal((await request(base, '/auth/me', 200)).name, 'Updated student')
      await request(base, `/activities/${id}`, 204, 'DELETE')
    })
    await withFileServer(filename, async base => {
      assert.deepEqual(await request(base, '/activities', 200), [])
    })
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})
