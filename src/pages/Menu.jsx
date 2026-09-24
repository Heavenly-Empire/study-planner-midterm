export default function Menu({ currentUser, onNavigate, onLogout }) {
  return (
    <main>
      <div className="page-heading">
        <span className="eyebrow">MENU</span>
        <h2>Menu</h2>
      </div>
      <div className="menu-actions">
        <button type="button" onClick={() => onNavigate('dashboard')}>View dashboard</button>
        <button type="button" onClick={() => onNavigate('form')}>Add study task</button>
        <button type="button" className="button-secondary" onClick={onLogout}>Log out</button>
      </div>
    </main>
  );
}
