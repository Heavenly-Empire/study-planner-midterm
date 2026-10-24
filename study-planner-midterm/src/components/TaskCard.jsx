import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'

export default function TaskCard({ task, currentUser, onChanged }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const canManage = (currentUser.role === 'administrator' && task.scope === 'class') || (task.scope === 'personal' && task.ownerId === currentUser.id)
  async function mutate(method, suffix, body) {
    setBusy(true); setError('')
    try { await api(`/activities/${task.id}${suffix}`, { method, body }); onChanged() }
    catch (error) { setError(error.message) }
    finally { setBusy(false) }
  }
  return <article className="card" aria-labelledby={`task-title-${task.id}`}>
    <p><strong>{task.scope === 'class' ? 'Class activity' : 'Personal activity'}</strong></p>
    <h3 id={`task-title-${task.id}`}>{task.title}</h3>
    <p><strong>Course:</strong> {task.course}</p>
    <p><strong>Due:</strong> <time dateTime={task.dueDate}>{task.dueDate}</time></p>
    <p><strong>Notes:</strong> {task.notes || 'No notes provided.'}</p>
    {error && <p role="alert" className="field-error">{error}</p>}
    <div className="actions">
      {currentUser.role === 'client' && <button disabled={busy} onClick={() => mutate('PATCH', '/completion', { completed: !task.completed })}>{task.completed ? 'Mark incomplete' : 'Mark complete'}</button>}
      {canManage && <><Link className="btn" to={`/activities/${task.id}/edit`}>Edit</Link><button className="danger" disabled={busy} onClick={() => setConfirmDelete(true)}>Delete</button></>}
    </div>
    {confirmDelete && <div role="group" aria-label="Confirm deletion"><p>Delete this activity? This also removes its completion records.</p><button className="danger" disabled={busy} onClick={() => mutate('DELETE', '')}>Confirm delete</button> <button className="secondary" disabled={busy} onClick={() => setConfirmDelete(false)}>Cancel</button></div>}
  </article>
}
