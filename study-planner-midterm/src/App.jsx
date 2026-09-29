import { useCallback, useEffect, useState } from 'react'
import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { findDemoUser } from './data/users'
import Navigation from './components/Navigation.jsx'
import { loadInitialTasks } from './data/tasks.js'
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
      <Navigation currentUser={currentUser} onLogout={onLogout} />
      <Outlet />
    </div>
  )
}
export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  // App keeps one task state as the single source of truth for every route.
  const [taskState, setTaskState] = useState({
    status: 'loading',
    tasks: [],
    error: '',
  })
  const navigate = useNavigate()

  const requestTasks = useCallback(() => {
    const demoOptions = new URLSearchParams(window.location.search)

    return loadInitialTasks({
      simulateEmpty: demoOptions.get('demo-state') === 'empty',
      simulateError: demoOptions.get('demo-state') === 'error',
    })
  }, [])

  useEffect(() => {
    let isActive = true

    requestTasks()
      .then((tasks) => {
        if (isActive) {
          setTaskState({ status: 'ready', tasks, error: '' })
        }
      })
      .catch((error) => {
        if (isActive) {
          setTaskState({
            status: 'error',
            tasks: [],
            error: error instanceof Error ? error.message : 'The activity data could not be loaded.',
          })
        }
      })

    return () => {
      isActive = false
    }
  }, [requestTasks])

  const handleTaskRetry = () => {
    const currentUrl = new URL(window.location.href)
    currentUrl.searchParams.delete('demo-state')
    window.history.replaceState(null, '', currentUrl)

    setTaskState({ status: 'loading', tasks: [], error: '' })
    requestTasks()
      .then((tasks) => {
        setTaskState({ status: 'ready', tasks, error: '' })
      })
      .catch((error) => {
        setTaskState({
          status: 'error',
          tasks: [],
          error: error instanceof Error ? error.message : 'The activity data could not be loaded.',
        })
      })
  }

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
    setTaskState((previous) => ({
      status: 'ready',
      tasks: [...previous.tasks, newTask],
      error: '',
    }))
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
          element={
            <Dashboard
              currentUser={currentUser}
              tasks={taskState.tasks}
              status={taskState.status}
              error={taskState.error}
              onRetry={handleTaskRetry}
            />
          }
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
