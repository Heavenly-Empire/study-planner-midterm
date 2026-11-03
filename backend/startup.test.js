import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import { fileURLToPath } from 'node:url'

function launch(port) {
  return spawn(process.execPath, [fileURLToPath(new URL('./server.js', import.meta.url))], {
    windowsHide: true,
    env: { ...process.env, PORT: String(port), HOST: '127.0.0.1', DATABASE_PATH: ':memory:', JWT_SECRET: 'startup-test-only-secret-at-least-32-characters' },
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

test('startup listens successfully and answers health', { timeout: 6000 }, async t => {
  const child = launch(0)
  t.after(() => { if (child.exitCode === null) child.kill() })
  const port = await new Promise((resolve, reject) => {
    let output = ''
    child.stdout.on('data', chunk => {
      output += chunk
      const match = output.match(/listening on 127\.0\.0\.1:(\d+)/)
      if (match) resolve(Number(match[1]))
    })
    child.once('exit', code => reject(new Error('Startup exited early: ' + code)))
    child.once('error', reject)
  })
  const response = await fetch(`http://127.0.0.1:${port}/api/health`)
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { status: 'ok' })
})
