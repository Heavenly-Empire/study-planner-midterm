export default function NavBar({ currentUser, onNavigate, onLogout }) {
  return (
    <nav className="nav-bar">
      <button type="button" className="button-link" onClick={() => onNavigate('menu')}>
        ← Back to menu
      </button>
      <span className="nav-user">{currentUser.name} · {currentUser.role}</span>
      <button type="button" className="button-link" onClick={onLogout}>
        Log out
      </button>
    </nav>
  );
}
