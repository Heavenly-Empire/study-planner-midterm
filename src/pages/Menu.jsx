// Member 2 handoff: develop this into the dedicated menu page and prepare deployment.
export default function Menu({ currentUser, onNavigate, onLogout }) {
  const isLecturer = currentUser.role === 'Lecturer';

  return (
    <main>
      <div className="page-heading">
        <span className="eyebrow">MENU</span>
        <h2>Welcome, {currentUser.name}</h2>
        <p className="role-badge">{currentUser.role}</p>
        <p>
          {isLecturer
            ? 'Lecturer posts class tasks.'
            : 'Student plans personal tasks.'}
        </p>
      </div>
      <div className="menu-actions">
        <button type="button" onClick={() => onNavigate('dashboard')}>View dashboard</button>
        <button type="button" onClick={() => onNavigate('form')}>Add study task</button>
        <button type="button" className="button-secondary" onClick={onLogout}>Log out</button>
      </div>
    </main>
  );
}
