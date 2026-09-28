// Member 3: decide which activities the signed-in role is allowed to see.
export function getVisibleTasks(tasks, currentUser) {
  if (!Array.isArray(tasks) || !currentUser) {
    return []
  }

  // filter creates a new list containing only the activities this user may see.
  const visibleTasks = tasks.filter((task) => {
    if (currentUser.role === 'administrator') {
      return task.scope === 'class'
    }

    if (currentUser.role === 'client') {
      return task.scope === 'class'
        || (task.scope === 'personal' && task.ownerId === currentUser.id)
    }

    return false
  })

  // Sort a copy so the shared task list from App is never changed.
  return [...visibleTasks].sort((firstTask, secondTask) => (
    firstTask.dueDate.localeCompare(secondTask.dueDate)
      || firstTask.title.localeCompare(secondTask.title)
  ))
}
