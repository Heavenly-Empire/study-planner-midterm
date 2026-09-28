import React, { useState } from 'react'
import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { findDemoUser } from './data/users'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import TaskForm from './pages/TaskForm'
import NotFound from './pages/NotFound'

function ProtectedLayout({ currentUser, onLogout }) {
  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return (
    <div>
      <header style={{ padding: '10px', background: '#eee', marginBottom: '20px' }}>
        <span>Signed in as: <strong>{currentUser.name}</strong> </span>
        <button onClick={onLogout} style={{ marginLeft: '10px' }}>Logout</button>
      </header>
      <Outlet />
    </div>
  )
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const navigate = useNavigate()

  const handleLogin = (username, password) => {
    const user = findDemoUser(username, password)
    if (user) {
      setCurrentUser(user)
      navigate('/dashboard')
      return true
    }
    return false
  }

  const handleLogout = () => {
    setCurrentUser(null)
    navigate('/login')
  }

  const handleAddTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask])
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          currentUser ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
        }
      />

      <Route element={<ProtectedLayout currentUser={currentUser} onLogout={handleLogout} />}>
        <Route
          path="/dashboard"
          element={<Dashboard currentUser={currentUser} tasks={tasks} />}
        />
        <Route
          path="/profile"
          element={<Profile currentUser={currentUser} />}
        />
        <Route
          path="/form"
          element={<TaskForm currentUser={currentUser} onAddTask={handleAddTask} />}
        />
      </Route>

      <Route path="/" element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />} />
      <Route path="*" element={currentUser ? <NotFound /> : <Navigate to="/login" replace />} />
    </Routes>
  )
}