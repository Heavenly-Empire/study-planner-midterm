import { useState } from 'react'
import { api } from '../api.js'

export default function Profile({ currentUser, onUpdate }) {
  const [name, setName] = useState(currentUser.name)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError(''); setMessage('')
    try { const user = await api('/profile', { method: 'PUT', body: { name } }); onUpdate(user); setMessage('Profile saved.') }
    catch (error) { setError(error.message) }
    finally { setBusy(false) }
  }
  const roleLabel = currentUser.role === 'administrator' ? 'Lecturer' : 'Student'
  return <main className="page"><h1>Profile</h1><form className="card" onSubmit={submit}>
    <div className="profile-head">
      <span className="avatar avatar-lg" aria-hidden="true">{(currentUser.name || currentUser.username)[0].toUpperCase()}</span>
      <div>
        <h2>{currentUser.name}</h2>
        <p className="meta">@{currentUser.username} · {roleLabel}</p>
      </div>
    </div>
    <p className="meta">{currentUser.role === 'administrator' ? 'Manage class activities and review class completion totals.' : 'View class work, manage your private activities, and record your own completion.'}</p>
    {error && <p role="alert" className="field-error">{error}</p>}{message && <p role="status">{message}</p>}
    <label htmlFor="profile-name">Name</label><input id="profile-name" value={name} onChange={e => setName(e.target.value)} required maxLength={80} />
    <button disabled={busy}>{busy ? 'Saving...' : 'Save profile'}</button>
  </form></main>
}