import { useState } from 'react';

// Member 4 handoff: add proper validation, field errors, and an on-page confirmation.
export default function TaskForm({ currentUser, onAddTask, onNavigate }) {
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim() || !course.trim() || !dueDate) {
      setMessage('Please fill in the title, course, and due date.');
      return;
    }
    onAddTask({
      id: `task-${Date.now()}`,
      title: title.trim(),
      course: course.trim(),
      dueDate,
      notes: notes.trim(),
      scope: currentUser.role === 'administrator' ? 'class' : 'personal',
      ownerId: currentUser.id,
    });
    setMessage('Task added. Open the dashboard to see it.');
    setTitle('');
    setCourse('');
    setDueDate('');
    setNotes('');
  }

  return (
    <main>
      <button className="text-button" onClick={() => onNavigate('menu')}>Back to menu</button>
      <div className="page-heading">
        <span className="eyebrow">ADD STUDY TASK</span>
        <h2>{currentUser.role === 'administrator' ? 'Add a class task' : 'Add a personal task'}</h2>
      </div>
      <form className="task-form" onSubmit={handleSubmit}>
        <label htmlFor="task-title">Title</label>
        <input id="task-title" value={title} onChange={(event) => setTitle(event.target.value)} />
        <label htmlFor="task-course">Course</label>
        <input id="task-course" value={course} onChange={(event) => setCourse(event.target.value)} />
        <label htmlFor="task-date">Due date</label>
        <input id="task-date" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
        <label htmlFor="task-notes">Notes (optional)</label>
        <textarea id="task-notes" value={notes} onChange={(event) => setNotes(event.target.value)} />
        <button type="submit">Add task</button>
        {message && <p role="status">{message}</p>}
      </form>
    </main>
  );
}
