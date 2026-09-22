// Hardcoded midterm examples. Refresh restores these records.
export const initialTasks = [
  {
    id: 'task-1',
    title: 'Review React components',
    course: 'Web Development',
    dueDate: '2026-10-05',
    notes: 'Read the Week 5 examples and make one small component.',
    scope: 'class',
    ownerId: 'lecturer-1',
  },
  {
    id: 'task-2',
    title: 'Practice CSS layouts',
    course: 'Web Development',
    dueDate: '2026-10-08',
    notes: 'Rebuild the flexbox lab without looking at the solution.',
    scope: 'class',
    ownerId: 'lecturer-1',
  },
  {
    id: 'task-3',
    title: 'Make midterm revision notes',
    course: 'Web Development',
    dueDate: '2026-10-03',
    notes: 'Summarize HTML, CSS, JavaScript, and React in one page.',
    scope: 'personal',
    ownerId: 'student-1',
  },
  {
    id: 'task-4',
    title: 'Private example for another student',
    course: 'Web Development',
    dueDate: '2026-10-04',
    notes: 'Used to verify that private tasks do not leak to another user.',
    scope: 'personal',
    ownerId: 'student-2',
  },
];
