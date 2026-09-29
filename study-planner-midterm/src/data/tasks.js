// Member 3: these examples return after a refresh because this project does not use a database.
export const initialTasks = [
  {
    id: 'task_class_react_review',
    title: 'Review React components',
    course: 'Web and Mobile Application Development',
    dueDate: '2026-10-05',
    notes: 'Review the component examples and write down two questions for class.',
    scope: 'class',
    ownerId: 'usr_lecturer_01',
  },
  {
    id: 'task_class_css_practice',
    title: 'Practise responsive CSS',
    course: 'Web and Mobile Application Development',
    dueDate: '2026-10-08',
    notes: 'Rebuild the navigation at desktop and mobile widths.',
    scope: 'class',
    ownerId: 'usr_lecturer_01',
  },
  {
    id: 'task_personal_midterm_notes',
    title: 'Prepare midterm revision notes',
    course: 'Web and Mobile Application Development',
    dueDate: '2026-10-03',
    notes: 'Summarise the main React and routing ideas on one page.',
    scope: 'personal',
    ownerId: 'usr_student_01',
  },
  {
    id: 'task_personal_other_student',
    title: 'Private task for another student',
    course: 'Database Systems',
    dueDate: '2026-10-04',
    notes: 'This item checks that one student cannot see another student\'s task.',
    scope: 'personal',
    ownerId: 'usr_student_02',
  },
]

// Keep the midterm data local while still exercising the loading, empty, and error states
// that a real API-backed version would need. The returned array is copied so callers do
// not accidentally mutate the shared examples.
export function loadInitialTasks({
  simulateEmpty = false,
  simulateError = false,
  delay = 350,
} = {}) {
  return new Promise((resolve, reject) => {
    globalThis.setTimeout(() => {
      if (simulateError) {
        reject(new Error('The activity data could not be loaded. Please try again.'))
        return
      }

      resolve(simulateEmpty ? [] : initialTasks.map((task) => ({ ...task })))
    }, delay)
  })
}
