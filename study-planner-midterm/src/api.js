const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')
export const tokenKey = 'study-planner-token'

export async function api(path, { method = 'GET', body, signal, token = localStorage.getItem(tokenKey) } = {}) {
  let response
  try {
    response = await fetch(`${API_URL}/api${path}`, {
      method, signal,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error('Cannot reach the API. Check that the backend is running on ' + API_URL + '.', { cause: error })
  }
  const data = response.status === 204 ? null : await response.json()
  if (!response.ok) {
    if (response.status === 401 && token && localStorage.getItem(tokenKey) === token) {
      localStorage.removeItem(tokenKey)
      window.dispatchEvent(new Event('session-expired'))
    }
    throw new Error(data?.error || 'The request failed. Please try again.')
  }
  return data
}
