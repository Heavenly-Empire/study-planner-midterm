import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api.js'

export default function TaskForm({ currentUser, onSave }) {
  const { id } = useParams()
  const [fields, setFields] = useState({ title: '', course: '', dueDate: '', notes: '' })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [loadedId, setLoadedId] = useState(null)
  const [attempt, setAttempt] = useState(0)
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(null)
  useEffect(() => {
    if (!id) return
    const controller = new AbortController()
    api(`/activities/${id}`, { signal: controller.signal }).then(task => {
      const allowed = currentUser.role === 'administrator' ? task.scope === 'class' : task.scope === 'personal' && task.ownerId === currentUser.id
      if (!allowed) throw new Error('You cannot edit this activity.')
      setFields(task); setLoadedId(id)
    }).catch(error => { if (error.name !== 'AbortError') setError(error.message) })
    return () => controller.abort()
  }, [id, currentUser, attempt])
  async function submit(event) {
    event.preventDefault()
    const next = {}
    for (const key of ['title', 'course', 'dueDate']) if (!fields[key].trim()) next[key] = 'This field is required.'
    setErrors(next); setSaved(null); setError('')
    if (Object.keys(next).length) return
    setBusy(true)
    try {
      const result = await onSave({ title: fields.title, course: fields.course, dueDate: fields.dueDate, notes: fields.notes }, id)
      setSaved(result)
      if (!id) setFields({ title: '', course: '', dueDate: '', notes: '' })
    } catch (error) { setError(error.message) }
    finally { setBusy(false) }
  }
  if (id && loadedId !== id) return <main className="page"><h1>Edit activity</h1>{error ? <><p role="alert">{error}</p><button onClick={() => { setError(''); setAttempt(value => value + 1) }}>Try again</button><p><Link to="/dashboard">Return to Dashboard</Link></p></> : <p role="status">Loading activity...</p>}</main>
  return <main className="page"><h1>{id ? 'Edit activity' : 'Input Form'}</h1>
    <p>{currentUser.role === 'administrator' ? 'Class activities are visible to every student.' : 'Personal activities are visible only to you.'}</p>
    <form className="card" onSubmit={submit} noValidate>
      {error && <p role="alert" className="field-error">{error}</p>}
      {[['title', 'Title', 'text', 120], ['course', 'Course', 'text', 100], ['dueDate', 'Due date', 'date']].map(([key, label, type, maxLength]) => <div key={key}>
        <label htmlFor={key}>{label}</label><input id={key} type={type} maxLength={maxLength} value={fields[key]} onChange={e => setFields({ ...fields, [key]: e.target.value })} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `${key}-error` : undefined} />
        {errors[key] && <p id={`${key}-error`} className="field-error">{errors[key]}</p>}
      </div>)}
      <label htmlFor="notes">Notes (optional)</label><textarea id="notes" maxLength={2000} value={fields.notes} onChange={e => setFields({ ...fields, notes: e.target.value })} />
      <button disabled={busy}>{busy ? 'Saving...' : id ? 'Save changes' : 'Add activity'}</button>
    </form>
    {saved && <section className="card output-panel" role="status"><h2>Activity saved</h2><dl className="profile-list">
      <dt>Title</dt><dd>{saved.title}</dd><dt>Course</dt><dd>{saved.course}</dd><dt>Due date</dt><dd>{saved.dueDate}</dd><dt>Notes</dt><dd>{saved.notes || 'No notes provided.'}</dd><dt>Visibility</dt><dd>{saved.scope === 'class' ? 'Class' : 'Personal (only you)'}</dd>
    </dl><p>Your activity is saved in the database.</p><Link className="btn" to="/dashboard">Go to Dashboard</Link></section>}
  </main>
}
