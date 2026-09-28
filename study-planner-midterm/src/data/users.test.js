import { describe, it, expect } from 'vitest'
import { findDemoUser, demoUsers } from './users'

describe('findDemoUser credential matching', () => {
  it('returns correct lecturer user object when valid credentials are given', () => {
    const user = findDemoUser('lecturer', 'demo123')
    expect(user).not.toBeNull()
    expect(user.role).toBe('administrator')
    expect(user.username).toBe('lecturer')
  })

  it('returns correct student user object when valid credentials are given', () => {
    const user = findDemoUser('student', 'demo123')
    expect(user).not.toBeNull()
    expect(user.role).toBe('client')
    expect(user.username).toBe('student')
  })

  it('returns null for wrong password', () => {
    const user = findDemoUser('lecturer', 'wrongpass')
    expect(user).toBeNull()
  })

  it('returns null for blank or whitespace input', () => {
    expect(findDemoUser('', 'demo123')).toBeNull()
    expect(findDemoUser('lecturer', '  ')).toBeNull()
  })
})