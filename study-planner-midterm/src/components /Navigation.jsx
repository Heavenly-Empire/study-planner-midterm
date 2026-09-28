import { NavLink } from "react-router-dom";

function Navigation({ currentUser, onLogout }) {
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
        <span className="nav-user-info">
          {displayName} ({roleLabel})
        </span>
        <button type="button" className="btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navigation;
