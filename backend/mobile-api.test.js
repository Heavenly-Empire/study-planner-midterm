import { test } from 'node:test'
import assert from 'node:assert/strict'
import bcrypt from 'bcryptjs'
import { openDatabase } from './database.js'
import { createApp } from './app.js'

// Exercise the actual mobile HTTP adapter against an isolated real API/database.
test('mobile adapter uses the protected activity contract', async t => {
  const db = openDatabase(':memory:')
  const hash = bcrypt.hashSync('test123', 4)
  db.prepare("INSERT INTO users (username,name,password_hash,role) VALUES ('mobile_student','Test student',?,'client')").run(hash)
  db.prepare("INSERT INTO users (username,name,password_hash,role) VALUES ('mobile_teacher','Test teacher',?,'administrator')").run(hash)
  const server = createApp(db, {secret:'isolated-mobile-test-secret-at-least-32-characters'}).listen(0,'127.0.0.1')
  await new Promise(resolve => server.once('listening',resolve))
  t.after(async () => { await new Promise(resolve => server.close(resolve)); db.close() })
  process.env.EXPO_PUBLIC_API_URL = `http://127.0.0.1:${server.address().port}`
  const { apiRequest } = await import('../mobile-app/lib/api.js')
  await t.test('missing and invalid credentials return 401', async () => {
    await assert.rejects(apiRequest('/activities'),e=>e.status===401)
    await assert.rejects(apiRequest('/auth/login',{method:'POST',body:{username:'mobile_student',password:'wrong'}}),e=>e.status===401)
  })
  const auth = await apiRequest('/auth/login',{method:'POST',body:{username:'mobile_student',password:'test123'}})
  const token=auth.token
  assert.equal(auth.user.role,'client')
  await t.test('empty list is a real empty response',async()=>assert.deepEqual(await apiRequest('/activities',{token}),[]))
  const activity = await apiRequest('/activities',{token,method:'POST',body:{title:'Mobile review',course:'Web development',dueDate:'2026-11-06',notes:'Synthetic integration task'}})
  await t.test('list and ID detail expose actual fields',async()=>{
    assert.equal((await apiRequest('/activities',{token}))[0].id,activity.id)
    const detail=await apiRequest(`/activities/${activity.id}`,{token})
    assert.equal(detail.title,'Mobile review');assert.equal(detail.scope,'personal');assert.equal(detail.completed,0)
  })
  await t.test('completion PATCH persists the server-confirmed value',async()=>{
    const saved=await apiRequest(`/activities/${activity.id}/completion`,{token,method:'PATCH',body:{completed:true}})
    assert.equal(saved.completed,1)
    assert.equal((await apiRequest(`/activities/${activity.id}`,{token})).completed,1)
    await assert.rejects(apiRequest(`/activities/${activity.id}/completion`,{token,method:'PATCH',body:{completed:'true'}}),e=>e.status===400)
  })
  await t.test('missing records and unavailable network produce readable errors',async()=>{
    await assert.rejects(apiRequest('/activities/999999',{token}),e=>e.status===404)
    await new Promise(resolve=>server.close(resolve))
    await assert.rejects(apiRequest('/activities',{token}),/Cannot reach Study Planner/)
  })
})
