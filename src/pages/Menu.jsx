// Member 2 handoff: develop this into the dedicated menu page and prepare deployment.
export default function Menu({ currentUser, onNavigate, onLogout }) {
  return (
    <main>
      <div className="page-heading">
        <span className="eyebrow">MENU</span>
        <h2>Welcome, {currentUser.name}</h2>
        <p>{currentUser.role === 'administrator' ? 'Plan activities for your class.' : 'See class activities and plan your own study.'}</p>
      </div>
      <div className="menu-actions">
        <button type="button" onClick={() => onNavigate('dashboard')}>View dashboard</button>
        <button type="button" onClick={() => onNavigate('form')}>Add study task</button>
        <button type="button" className="button-secondary" onClick={onLogout}>Log out</button>
      </div>
    </main>
  );
}
