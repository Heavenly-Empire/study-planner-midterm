// One place defines what each role is allowed to see on the dashboard.
export function getVisibleTasks(tasks, currentUser) {
  const visibleTasks = tasks.filter((task) => {
    if (currentUser.role === 'administrator') return task.scope === 'class';
    if (currentUser.role === 'client') {
      return task.scope === 'class' || (task.scope === 'personal' && task.ownerId === currentUser.id);
    }
    return false;
  });

  return [...visibleTasks].sort((first, second) =>
    first.dueDate.localeCompare(second.dueDate) || first.title.localeCompare(second.title),
  );
}
