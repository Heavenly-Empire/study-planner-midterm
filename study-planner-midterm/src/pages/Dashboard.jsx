// Member 3: build the role-filtered dashboard from App's task and user props.
import { Link } from 'react-router-dom'
import TaskCard from '../components/TaskCard.jsx'
import { getVisibleTasks } from '../data/selectTasks.js'

export default function Dashboard({ currentUser, tasks, status, error, onRetry }) {
  if (status === 'loading') {
    return (
      <main className="page" aria-live="polite">
        <h1>Loading study plan</h1>
        <div className="card state-panel">
          <span className="loading-indicator" aria-hidden="true" />
          <p>Preparing the latest study activities…</p>
        </div>
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main className="page" aria-live="assertive">
        <h1>Unable to load activities</h1>
        <div className="card state-panel">
          <p>{error}</p>
          <button type="button" onClick={onRetry}>Try again</button>
        </div>
      </main>
    )
  }

  // visibleTasks is calculated from props, so Dashboard does not keep a second copy in state.
  const visibleTasks = getVisibleTasks(tasks, currentUser)
  const isLecturer = currentUser.role === 'administrator'
  const classCount = visibleTasks.filter((task) => task.scope === 'class').length
  const personalCount = visibleTasks.filter((task) => task.scope === 'personal').length

  return (
    <main className="page">
      <h1>{isLecturer ? 'Class study activities' : 'My study plan'}</h1>
      <p>
        {isLecturer
          ? 'Review the activities shared with your class.'
          : 'Review class activities and your own personal study tasks.'}
      </p>

      <section className="card" aria-labelledby="task-summary-heading">
        <h2 id="task-summary-heading">Activity summary</h2>
        <p><strong>Class activities:</strong> {classCount}</p>
        {!isLecturer && <p><strong>Personal activities:</strong> {personalCount}</p>}
        <p><strong>Total visible:</strong> {visibleTasks.length}</p>
      </section>

      <section aria-labelledby="upcoming-heading">
        <h2 id="upcoming-heading">Upcoming activities</h2>
        {visibleTasks.length === 0 ? (
          <div className="card">
            <h3>No activities yet</h3>
            <p>Add an activity to start building the study plan.</p>
            <Link className="btn" to="/form">Add study activity</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {/* The id stays with its activity, which gives React a stable key. */}
            {visibleTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
