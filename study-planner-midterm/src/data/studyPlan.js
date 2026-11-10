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

// Turn the server's plan into editable text. Unknown IDs are shown as "Activity <id>".
export function formatPlan(result, tasks) {
  const names = new Map(tasks.map(task => [task.id, task.title]))
  const lines = (result?.plan ?? []).map(item =>
    `${item.date} - ${names.get(item.activityId) ?? `Activity ${item.activityId}`} (${item.minutes} min): ${item.focus}`)
  const warnings = (result?.warnings ?? []).map(text => `Note: ${text}`)
  return [...lines, ...(warnings.length && lines.length ? [''] : []), ...warnings].join('\n')
}

// Local calendar date as YYYY-MM-DD, plus a number of days.
export function localDate(offsetDays = 0, from = new Date()) {
  const date = new Date(from.getFullYear(), from.getMonth(), from.getDate() + offsetDays)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export const MAX_TEXT = 5000
// Same count the server uses: title + course + notes of the chosen activities.
export const textSize = tasks => tasks.reduce((sum, task) => sum + task.title.length + task.course.length + (task.notes ?? '').length, 0)
