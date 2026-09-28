// Member 3: TaskCard receives one activity through props and does not change it.
export default function TaskCard({ task }) {
  const scopeLabel = task.scope === 'class' ? 'Class activity' : 'Personal activity'

  return (
    <article className="card" aria-labelledby={`task-title-${task.id}`}>
      <p><strong>{scopeLabel}</strong></p>
      <h3 id={`task-title-${task.id}`}>{task.title}</h3>
      <p><strong>Course:</strong> {task.course}</p>
      <p>
        <strong>Due:</strong>{' '}
        <time dateTime={task.dueDate}>{task.dueDate}</time>
      </p>
      <p><strong>Notes:</strong> {task.notes || 'No notes provided.'}</p>
    </article>
  )
}
