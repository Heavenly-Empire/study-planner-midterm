import { useState } from 'react'
import { api } from '../api.js'

export default function Login({ onLogin }) {
  const [registering, setRegistering] = useState(false)
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event) {
    event.preventDefault()
    setError(''); setMessage(''); setBusy(true)
    try {
      if (registering) {
        await api('/auth/register', { method: 'POST', body: { name, username, password }, token: null })
        setRegistering(false); setPassword(''); setMessage('Account created. Sign in with your new student account.')
      } else await onLogin(username, password)
    } catch (error) { setError(error.message) }
    finally { setBusy(false) }
  }
  return <main className="page login-page">
    <h1>Study Planner</h1><p>Keep class work and personal study plans together.</p>
    <form className="card" onSubmit={submit}>
      <h2>{registering ? 'Create a student account' : 'Sign in'}</h2>
      {error && <p role="alert" className="field-error">{error}</p>}
      {message && <p role="status">{message}</p>}
      {registering && <><label htmlFor="name">Name</label><input id="name" value={name} onChange={e => setName(e.target.value)} maxLength={80} autoComplete="name" required /></>}
      <label htmlFor="username">Username</label><input id="username" value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" maxLength={40} required />
      <label htmlFor="password">Password</label><input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete={registering ? 'new-password' : 'current-password'} minLength={registering ? 6 : undefined} required />
      <button disabled={busy}>{busy ? 'Please wait...' : registering ? 'Create account' : 'Sign in'}</button>
      <button type="button" className="secondary" disabled={busy} onClick={() => { setRegistering(!registering); setError(''); setMessage('') }}>{registering ? 'Back to sign in' : 'Create student account'}</button>
    </form>
  </main>
}
