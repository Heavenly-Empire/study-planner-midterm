// Member 3: check the dashboard visibility and sorting rules.
import { describe, expect, it } from 'vitest'
import { getVisibleTasks } from './selectTasks.js'
import { initialTasks } from './tasks.js'

const lecturer = { id: 'usr_lecturer_01', role: 'administrator' }
const student = { id: 'usr_student_01', role: 'client' }

describe('getVisibleTasks', () => {
  it('shows lecturers only class activities', () => {
    const result = getVisibleTasks(initialTasks, lecturer)

    expect(result.map((task) => task.id)).toEqual([
      'task_class_react_review',
      'task_class_css_practice',
    ])
    expect(result.every((task) => task.scope === 'class')).toBe(true)
  })

  it('shows students class activities and only their own personal activities', () => {
    const result = getVisibleTasks(initialTasks, student)

    expect(result.map((task) => task.id)).toEqual([
      'task_personal_midterm_notes',
      'task_class_react_review',
      'task_class_css_practice',
    ])
    expect(result.some((task) => task.ownerId === 'usr_student_02')).toBe(false)
  })

  it('uses the title to break ties between matching due dates', () => {
    const tasksWithMatchingDates = [
      { ...initialTasks[0], id: 'task_z', title: 'Zoom review', dueDate: '2026-10-05' },
      { ...initialTasks[0], id: 'task_a', title: 'Accessibility review', dueDate: '2026-10-05' },
    ]

    const result = getVisibleTasks(tasksWithMatchingDates, lecturer)

    expect(result.map((task) => task.id)).toEqual(['task_a', 'task_z'])
  })

  it('does not change the order of the shared task array', () => {
    const originalOrder = initialTasks.map((task) => task.id)

    getVisibleTasks(initialTasks, student)

    expect(initialTasks.map((task) => task.id)).toEqual(originalOrder)
  })

  it('returns an empty array for an unknown role or no activities', () => {
    expect(getVisibleTasks(initialTasks, { id: 'guest', role: 'guest' })).toEqual([])
    expect(getVisibleTasks([], student)).toEqual([])
  })
})
