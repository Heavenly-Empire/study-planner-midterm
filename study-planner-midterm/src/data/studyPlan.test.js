import { describe, expect, it } from 'vitest'
import { MAX_TEXT, eligibleTasks, formatPlan, formatStudyDate, localDate, selectionSignature, textSize } from './studyPlan.js'

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
  it('groups sessions in date order, totals minutes and identifies selected work left out', () => {
    const text = formatPlan({
      plan: [
        { date: '2026-11-12', activityId: 3, minutes: 15, focus: 'Check your answers.' },
        { date: '2026-11-11', activityId: 3, minutes: 30, focus: 'Solve two practice problems.' },
        { date: '2026-11-11', activityId: 77, minutes: 15, focus: 'Read a worked example.' },
      ],
      warnings: ['A mine was due on 2026-11-10.'],
    }, [tasks[0], tasks[2]])
    expect(text).toContain('Wednesday, 11 Nov 2026 · 45 min total\n- A mine (30 min)\n  Solve two practice problems.\n- Activity 77 (15 min)')
    expect(text).toContain('Thursday, 12 Nov 2026 · 15 min total')
    expect(text.indexOf('Wednesday')).toBeLessThan(text.indexOf('Thursday'))
    expect(text).toContain('Selected activities without a session\n- B class')
    expect(text).toContain('Notes\n- A mine was due on 10 Nov 2026.')
    expect(formatPlan({ plan: [] }, [])).toBe('No study sessions were scheduled.')
  })
  it('spells out the month without shifting the calendar day', () => {
    expect(formatStudyDate('2026-11-12', true)).toBe('Thursday, 12 Nov 2026')
    expect(formatStudyDate('2026-11-12')).toBe('12 Nov 2026')
    expect(formatStudyDate('')).toBe('')
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
