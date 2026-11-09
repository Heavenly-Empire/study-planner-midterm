import { useState } from 'react'

const THREADS = [
  { id: 1, title: 'How does JWT verification work in requireAuth?', author: 'Budi Santoso', course: 'Web and Mobile Application Development', time: '2h ago', replies: 3, resolved: true, preview: 'I traced the login flow but I am lost on where the token gets checked.' },
  { id: 2, title: 'Which tables does the project data model need?', author: 'Sari Dewi', course: 'Web and Mobile Application Development', time: '5h ago', replies: 0, resolved: false, preview: 'Do users and activities need a join table for completion records?' },
  { id: 3, title: 'Study group for the deep learning exam', author: 'Andi Wijaya', course: 'Deep Learning', time: '1d ago', replies: 6, resolved: true, preview: 'Planning sessions on Thursday evenings, drop a reply if you want in.' },
]

const FILTERS = ['All', 'Unresolved', 'Resolved']

export default function Forum() {
  const [filter, setFilter] = useState('All')
  const shown = THREADS.filter(t => filter === 'All' || (filter === 'Resolved') === t.resolved)

  return (
    <main className="page">
      <h1>Forum</h1>
      <p className="meta">Ask questions and discuss class activities.</p>
      <div className="tabs" role="tablist" aria-label="Filter threads">
        {FILTERS.map(f => (
          <button key={f} type="button" role="tab" aria-selected={filter === f}
            className={filter === f ? 'tab active' : 'tab'} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      {shown.map(t => (
        <article key={t.id} className="card task">
          <span className="avatar" aria-hidden="true">{t.author[0]}</span>
          <div className="task-body">
            <h3>{t.title}</h3>
            <p className="meta">{t.author} · {t.course} · {t.time}</p>
            <p>{t.preview}</p>
            <p className="meta">
              <span className={t.resolved ? 'badge resolved' : 'badge open'}>{t.resolved ? 'Resolved' : 'Unresolved'}</span> {t.replies} replies
            </p>
          </div>
        </article>
      ))}
    </main>
  )
}