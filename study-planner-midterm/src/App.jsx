import React, { useState } from 'react'
import { findDemoUser } from './data/users'
import Login from './pages/Login'

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [tasks, setTasks] = useState([])

  const handleLogin = (username, password) => {
    const user = findDemoUser(username, password)
    if (user) {
      setCurrentUser(user)
      return true
    }
    return false
  }

  const handleLogout = () => {
    setCurrentUser(null)
  }

  const handleAddTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask])
  }

  return (
    <main>
      <h1>Study Planner</h1>
      {currentUser ? (
        <div>
          <p>Logged in as: {currentUser.name} ({currentUser.role})</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </main>
  )
}