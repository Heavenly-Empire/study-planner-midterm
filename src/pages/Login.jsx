import { useState } from 'react';

// Member 1 handoff: refine this page's design and login behavior.
export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setError(onLogin(username, password) ? '' : 'Username or password is incorrect.');
  }

  return (
    <main className="login-panel">
      <span className="eyebrow">STUDY PLANNER</span>
      <h1>Sign in</h1>
      <p>Demo accounts: lecturer / demo123 or student / demo123</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input id="username" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit">Sign in</button>
      </form>
    </main>
  );
}
