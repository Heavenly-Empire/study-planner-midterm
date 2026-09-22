import TaskCard from '../components/TaskCard.jsx';
import { getVisibleTasks } from '../data/selectTasks.js';

export default function Dashboard({ currentUser, tasks, onNavigate }) {
  const isLecturer = currentUser.role === 'administrator';
  const visibleTasks = getVisibleTasks(tasks, currentUser);
  const classCount = visibleTasks.filter((task) => task.scope === 'class').length;
  const personalCount = visibleTasks.filter((task) => task.scope === 'personal').length;

  return (
    <main className="dashboard-page">
      <button className="text-button" type="button" onClick={() => onNavigate('menu')}>Back to menu</button>
      <div className="page-heading">
        <span className="eyebrow">DASHBOARD</span>
        <h2>{isLecturer ? 'Class study activities' : 'My study plan'}</h2>
        <p>{isLecturer ? 'Tasks you have shared with the class.' : 'Your own tasks and recommendations from your lecturer.'}</p>
      </div>

      <div className="dashboard-summary" aria-label="Task summary">
        <div className="dashboard-summary-card">
          <span>{isLecturer ? 'Class tasks' : 'Class recommendations'}</span>
          <strong>{classCount}</strong>
        </div>
        {!isLecturer && (
          <div className="dashboard-summary-card">
            <span>Personal tasks</span>
            <strong>{personalCount}</strong>
          </div>
        )}
      </div>

      <div className="dashboard-list-heading">
        <h3>Upcoming tasks</h3>
        <button type="button" onClick={() => onNavigate('form')}>Add study task</button>
      </div>
      {visibleTasks.length === 0 ? (
        <div className="dashboard-empty">
          <h3>No tasks yet</h3>
          <p>{isLecturer ? 'Add the first class task for your students.' : 'Add a personal study task to get started.'}</p>
        </div>
      ) : (
        <div className="dashboard-task-list">
          {visibleTasks.map((task) => <TaskCard key={task.id} task={task} />)}
        </div>
      )}
    </main>
  );
}
