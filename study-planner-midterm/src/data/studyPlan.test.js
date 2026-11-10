import { describe, expect, it } from 'vitest'
import { MAX_TEXT, eligibleTasks, formatPlan, localDate, selectionSignature, textSize } from './studyPlan.js'

const student = { id: 2, role: 'client' }
const tasks = [
  { id: 1, title: 'B class', scope: 'class', ownerId: 1, dueDate: '2026-11-12', completed: 0, course: 'C', notes: '' },
  { id: 2, title: 'Done class', scope: 'class', ownerId: 1, dueDate: '2026-11-11', completed: 1, course: 'C', notes: '' },
  { id: 3, title: 'A mine', scope: 'personal', ownerId: 2, dueDate: '2026-11-12', completed: 0, course: 'C', notes: 'n' },
  { id: 4, title: 'Not mine', scope: 'personal', ownerId: 9, dueDate: '2026-11-10', completed: 0, course: 'C', notes: '' },
]

describe('study plan helpers', () => {
  it('lists only unfinished class work and own private tasks, by due date', () => {
    expect(eligibleTasks(tasks, student).map(task => task.id)).toEqual([3, 1])
  })
  it('offers nothing to lecturers', () => {
    expect(eligibleTasks(tasks, { id: 1, role: 'administrator' })).toEqual([])
  })
  it('changes the signature when a selected note changes', () => {
    const before = selectionSignature(tasks, [3])
    expect(selectionSignature(tasks.map(task => task.id === 3 ? { ...task, notes: 'changed' } : task), [3])).not.toBe(before)
    expect(selectionSignature(tasks, [3])).toBe(before)
  })
  it('formats the plan and warnings as editable text', () => {
    const text = formatPlan({ plan: [{ date: '2026-11-10', activityId: 3, minutes: 30, focus: 'Review' }, { date: '2026-11-11', activityId: 77, minutes: 15, focus: 'Read' }], warnings: ['Short on time'] }, tasks)
    expect(text).toBe('2026-11-10 - A mine (30 min): Review\n2026-11-11 - Activity 77 (15 min): Read\n\nNote: Short on time')
    expect(formatPlan({ plan: [], warnings: ['Nothing to plan'] }, tasks)).toBe('Note: Nothing to plan')
  })
  it('builds local dates', () => {
    expect(localDate(2, new Date(2026, 10, 9))).toBe('2026-11-11')
    expect(localDate(1, new Date(2026, 11, 31))).toBe('2027-01-01')
  })
  it('counts the text that would be sent', () => {
    expect(textSize([tasks[2]])).toBe('A mine'.length + 1 + 1)
    expect(textSize([{ title: 'T', course: 'C', notes: 'x'.repeat(MAX_TEXT) }])).toBeGreaterThan(MAX_TEXT)
  })
})
