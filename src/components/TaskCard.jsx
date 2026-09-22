export default function TaskCard({ task }) {
  return (
    <article className="dashboard-task-card">
      <div className="dashboard-task-topline">
        <span className={`dashboard-scope dashboard-scope-${task.scope}`}>
          {task.scope === 'class' ? 'From lecturer' : 'Personal'}
        </span>
        <time dateTime={task.dueDate}>{task.dueDate}</time>
      </div>
      <h3>{task.title}</h3>
      <p className="dashboard-course">{task.course}</p>
      {task.notes && <p className="dashboard-notes">{task.notes}</p>}
    </article>
  );
}
