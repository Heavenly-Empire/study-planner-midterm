// Helpers for the AI study-plan panel (no React, so they are easy to test).

// Unfinished activities the student may plan, in due-date order. Input comes from the dashboard task list.
export function eligibleTasks(tasks, currentUser) {
  if (!Array.isArray(tasks) || currentUser?.role !== 'client') return []
  return tasks
    .filter(task => !task.completed && (task.scope === 'class' || (task.scope === 'personal' && task.ownerId === currentUser.id)))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate) || a.title.localeCompare(b.title))
}

// Changes when the chosen activities or their text change, so the confirmation can be asked again.
export function selectionSignature(tasks, selectedIds) {
  return JSON.stringify(tasks.filter(task => selectedIds.includes(task.id))
    .map(task => [task.id, task.title, task.course, task.dueDate, task.notes]))
}

const studyDate = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
})
const studyDay = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
})

export function formatStudyDate(value, includeWeekday = false) {
  const date = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return value
  return (includeWeekday ? studyDay : studyDate).format(date)
}

// Group sessions by day and show which selected activities still need time.
export function formatPlan(result, tasks) {
  const names = new Map(tasks.map(task => [task.id, task.title]))
  const days = new Map()
  const scheduled = new Set()
  for (const item of result?.plan ?? []) {
    const day = days.get(item.date) ?? []
    day.push(item)
    days.set(item.date, day)
    scheduled.add(item.activityId)
  }

  const sections = [...days].sort(([a], [b]) => a.localeCompare(b)).map(([date, items]) => {
    const total = items.reduce((minutes, item) => minutes + item.minutes, 0)
    const sessions = items.map(item => {
      const title = names.get(item.activityId) ?? `Activity ${item.activityId}`
      return `- ${title} (${item.minutes} min)\n  ${item.focus}`
    })
    return [`${formatStudyDate(date, true)} · ${total} min total`, ...sessions].join('\n')
  })

  if (sections.length === 0) sections.push('No study sessions were scheduled.')
  const unscheduled = tasks.filter(task => !scheduled.has(task.id))
  if (unscheduled.length) {
    sections.push(['Selected activities without a session', ...unscheduled.map(task => `- ${task.title}`)].join('\n'))
  }
  const warnings = (result?.warnings ?? []).map(text =>
    `- ${text.replace(/\b\d{4}-\d{2}-\d{2}\b/g, date => formatStudyDate(date))}`)
  if (warnings.length) sections.push(['Notes', ...warnings].join('\n'))
  return sections.join('\n\n')
}

// Local calendar date as YYYY-MM-DD, plus a number of days.
export function localDate(offsetDays = 0, from = new Date()) {
  const date = new Date(from.getFullYear(), from.getMonth(), from.getDate() + offsetDays)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export const MAX_TEXT = 5000
// Same count the server uses: title + course + notes of the chosen activities.
export const textSize = tasks => tasks.reduce((sum, task) => sum + task.title.length + task.course.length + (task.notes ?? '').length, 0)
