// Member 3: build the dashboard from App's task and user props.
import TaskCard from '../components/TaskCard.jsx'

export default function Dashboard({ currentUser, tasks }) {
  const isLecturer = currentUser.role === 'administrator'

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
        <p><strong>Loaded activities:</strong> {tasks.length}</p>
      </section>

      <section aria-labelledby="upcoming-heading">
        <h2 id="upcoming-heading">Upcoming activities</h2>
        <div style={{ display: 'grid', gap: '16px' }}>
          {/* The id stays with its activity, which gives React a stable key. */}
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </section>
    </main>
  )
}
