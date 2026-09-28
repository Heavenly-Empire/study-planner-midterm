export const demoUsers = [
  {
    id: 'usr_lecturer_01',
    name: 'Dr. Aris',
    username: 'lecturer',
    password: 'demo123',
    role: 'administrator'
  },
  {
    id: 'usr_student_01',
    name: 'Budi Santoso',
    username: 'student',
    password: 'demo123',
    role: 'client'
  }
]

export function findDemoUser(username, password) {
  if (!username || !password) {
    return null
  }
  const cleanUsername = username.trim()
  const cleanPassword = password.trim()

  if (cleanUsername === '' || cleanPassword === '') {
    return null
  }

  const foundUser = demoUsers.find(
    (user) => user.username === cleanUsername && user.password === cleanPassword
  )

  return foundUser || null
}