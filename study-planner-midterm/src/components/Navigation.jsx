import { NavLink } from "react-router-dom";

function Navigation({ currentUser, onLogout, theme, setTheme }) {
  const roleLabel = currentUser.role === "administrator" ? "Lecturer" : "Student";
  const displayName = currentUser.name || currentUser.displayName || currentUser.username;

  return (
    <nav className="nav" aria-label="Main navigation">
      <span className="nav-brand">Study Planner</span>

      <ul className="nav-links">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/forum" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Forum
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink to="/form" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Input Form
          </NavLink>
        </li>
      </ul>

      <div className="nav-user">
        <span className="avatar" aria-hidden="true">{displayName[0].toUpperCase()}</span>
        <span className="nav-user-info">
          {displayName} ({roleLabel})
        </span>
        <button type="button" className="btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
        <button type="button" className="btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navigation;