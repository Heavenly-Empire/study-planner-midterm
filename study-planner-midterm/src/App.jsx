import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { api, tokenKey } from './api.js'
import Navigation from './components/Navigation.jsx'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import TaskForm from './pages/TaskForm'
import NotFound from './pages/NotFound'

function ProtectedLayout({ currentUser, onLogout }) {
  if (!currentUser) return <Navigate to="/login" replace />
  return <><Navigation currentUser={currentUser} onLogout={onLogout} /><Outlet /></>
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [session, setSession] = useState('checking')
  const [sessionError, setSessionError] = useState('')
  const [sessionAttempt, setSessionAttempt] = useState(0)
  const [taskState, setTaskState] = useState({ status: 'loading', tasks: [], progress: [], error: '' })
  const [revision, setRevision] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const controller = new AbortController()
    const check = async () => {
      try {
        const user = localStorage.getItem(tokenKey) ? await api('/auth/me', { signal: controller.signal }) : null
        if (!controller.signal.aborted) { setCurrentUser(user); setSession('ready') }
      } catch (error) {
        if (error.name !== 'AbortError') {
          if (!localStorage.getItem(tokenKey)) setSession('ready')
          else { setSessionError(error.message); setSession('error') }
        }
      }
    }
    check()
    const expired = () => { setCurrentUser(null); setSession('ready'); navigate('/login', { replace: true }) }
    window.addEventListener('session-expired', expired)
    return () => { controller.abort(); window.removeEventListener('session-expired', expired) }
  }, [navigate, sessionAttempt])

  useEffect(() => {
    if (!currentUser) return
    const controller = new AbortController()
    Promise.all([
      api('/activities', { signal: controller.signal }),
      currentUser.role === 'administrator' ? api('/progress', { signal: controller.signal }) : Promise.resolve([]),
    ]).then(([tasks, progress]) => {
      if (!controller.signal.aborted) setTaskState({ status: 'ready', tasks, progress, error: '' })
    }).catch(error => {
      if (error.name !== 'AbortError') setTaskState({ status: 'error', tasks: [], progress: [], error: error.message })
    })
    return () => controller.abort()
  }, [currentUser, revision])

  const reload = () => { setTaskState({ status: 'loading', tasks: [], progress: [], error: '' }); setRevision(value => value + 1) }
  const login = async (username, password) => {
    const data = await api('/auth/login', { method: 'POST', body: { username, password }, token: null })
    localStorage.setItem(tokenKey, data.token)
    setTaskState({ status: 'loading', tasks: [], progress: [], error: '' })
    setCurrentUser(data.user)
    navigate('/dashboard')
  }
  const logout = () => {
    localStorage.removeItem(tokenKey)
    setCurrentUser(null)
    setTaskState({ status: 'loading', tasks: [], progress: [], error: '' })
    navigate('/login')
  }
  const saveTask = async (body, id) => {
    const saved = await api(id ? `/activities/${id}` : '/activities', { method: id ? 'PUT' : 'POST', body })
    reload()
    return saved
  }

  if (session === 'checking') return <main className="page" aria-live="polite">Checking your session...</main>
  if (session === 'error') return <main className="page"><h1>Unable to check your session</h1><p role="alert">{sessionError}</p><button onClick={() => { setSession('checking'); setSessionAttempt(value => value + 1) }}>Try again</button><button onClick={() => { logout(); setSession('ready') }}>Sign out</button></main>

  return <Routes>
    <Route path="/login" element={currentUser ? <Navigate to="/dashboard" replace /> : <Login onLogin={login} />} />
    <Route element={<ProtectedLayout currentUser={currentUser} onLogout={logout} />}>
      <Route path="/dashboard" element={<Dashboard currentUser={currentUser} {...taskState} onRetry={reload} onChanged={reload} />} />
      <Route path="/profile" element={<Profile currentUser={currentUser} onUpdate={setCurrentUser} />} />
      <Route path="/form" element={<TaskForm key="create" currentUser={currentUser} onSave={saveTask} />} />
      <Route path="/activities/:id/edit" element={<TaskForm key="edit" currentUser={currentUser} onSave={saveTask} />} />
    </Route>
    <Route path="/" element={<Navigate to={currentUser ? '/dashboard' : '/login'} replace />} />
    <Route path="*" element={currentUser ? <NotFound /> : <Navigate to="/login" replace />} />
  </Routes>
}
