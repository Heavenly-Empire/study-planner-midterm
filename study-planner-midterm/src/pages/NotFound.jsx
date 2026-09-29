import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>404 - Page Not Found</h2>
      <p>The requested route does not exist.</p>
      <Link to="/dashboard">Return to Dashboard</Link>
    </div>
  )
}
