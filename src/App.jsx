import { useState } from 'react';
import { demoUsers } from './data/users.js';
import { initialTasks } from './data/tasks.js';
import Login from './pages/Login.jsx';
import Menu from './pages/Menu.jsx';
import Dashboard from './pages/Dashboard.jsx';
import TaskForm from './pages/TaskForm.jsx';

const PAGES = ['menu', 'dashboard', 'form'];

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('menu');
  const [tasks, setTasks] = useState(initialTasks);

  function handleLogin(username, password) {
    const matchedUser = demoUsers.find(
      (user) => user.username === username.trim() && user.password === password,
    );
    if (!matchedUser) return false;
    setCurrentUser(matchedUser);
    setCurrentPage('menu');
    return true;
  }

  function handleNavigate(page) {
    if (PAGES.includes(page)) setCurrentPage(page);
  }

  function handleLogout() {
    setCurrentUser(null);
    setCurrentPage('menu');
    setTasks(initialTasks);
  }

  function handleAddTask(task) {
    setTasks((previousTasks) => [...previousTasks, task]);
  }

  if (!currentUser) return <Login onLogin={handleLogin} />;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <span className="eyebrow">MIDTERM PROJECT</span>
          <h1>Study Planner</h1>
        </div>
        <div className="header-user">
          <span>{currentUser.name}</span>
          <span className="role-pill">{currentUser.role === 'administrator' ? 'Lecturer' : 'Student'}</span>
        </div>
      </header>

      {currentPage === 'menu' && (
        <Menu currentUser={currentUser} onNavigate={handleNavigate} onLogout={handleLogout} />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard currentUser={currentUser} tasks={tasks} onNavigate={handleNavigate} />
      )}
      {currentPage === 'form' && (
        <TaskForm currentUser={currentUser} onAddTask={handleAddTask} onNavigate={handleNavigate} />
      )}
    </div>
  );
}
