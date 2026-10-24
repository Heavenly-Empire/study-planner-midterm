import { afterEach, describe, expect, it, vi } from 'vitest'
import { api, tokenKey } from './api.js'

let stored = new Map()
vi.stubGlobal('localStorage', { getItem: key => stored.get(key) ?? null, setItem: (key, value) => stored.set(key, value), removeItem: key => stored.delete(key) })
const dispatchEvent = vi.fn()
vi.stubGlobal('window', { dispatchEvent })
afterEach(() => { stored = new Map(); dispatchEvent.mockClear(); vi.unstubAllGlobals(); vi.stubGlobal('localStorage', { getItem: key => stored.get(key) ?? null, removeItem: key => stored.delete(key) }); vi.stubGlobal('window', { dispatchEvent }) })

describe('API requests', () => {
  it('attaches the token and serializes a protected activity request', async () => {
    stored.set(tokenKey, 'saved-token')
    const fetch = vi.fn().mockResolvedValue({ ok: true, status: 201, json: async () => ({ id: 4 }) })
    vi.stubGlobal('fetch', fetch)
    expect(await api('/activities', { method: 'POST', body: { title: 'Review' } })).toEqual({ id: 4 })
    expect(fetch.mock.calls[0][1].headers.Authorization).toBe('Bearer saved-token')
    expect(fetch.mock.calls[0][1].body).toBe('{"title":"Review"}')
  })
  it('clears an expired session and dispatches the sign-in event', async () => {
    stored.set(tokenKey, 'expired')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 401, json: async () => ({ error: 'Expired' }) }))
    await expect(api('/activities')).rejects.toThrow('Expired')
    expect(stored.has(tokenKey)).toBe(false)
    expect(dispatchEvent.mock.calls[0][0].type).toBe('session-expired')
  })
  it('keeps an existing session when a public login attempt fails', async () => {
    stored.set(tokenKey, 'existing')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 401, json: async () => ({ error: 'Invalid credentials' }) }))
    await expect(api('/auth/login', { token: null })).rejects.toThrow('Invalid credentials')
    expect(stored.get(tokenKey)).toBe('existing')
  })
  it('handles deletion without trying to parse an empty response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 204 }))
    expect(await api('/activities/4', { method: 'DELETE' })).toBe(null)
  })
  it('gives a useful network error while preserving an aborted request', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    await expect(api('/activities')).rejects.toThrow('Cannot reach the API')
    const abort = new DOMException('Aborted', 'AbortError')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(abort))
    await expect(api('/activities')).rejects.toBe(abort)
  })
})
