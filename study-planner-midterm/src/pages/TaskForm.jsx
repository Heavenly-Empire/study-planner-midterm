import { useState } from "react";

// Receives currentUser and onAddTask(task) from App.jsx via props.
function TaskForm({ currentUser, onAddTask }) {
  // Controlled fields: every value comes from state, every onChange updates state.
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState({});

  function handleSubmit(e) {
    e.preventDefault(); // stop the browser's default full-page form submit

    // Build field errors for blank title, course, or due date.
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!course.trim()) newErrors.course = "Course is required.";
    if (!dueDate.trim()) newErrors.dueDate = "Due date is required.";

    // Invalid input: show errors, keep typed values, add nothing, stay on the form.
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // early return — nothing is added
    }

    setErrors({});
  }

  return (
    <main className="page">
      <h1>Input Form</h1>

      <form className="card" onSubmit={handleSubmit} noValidate>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <p className="field-error">{errors.title}</p>}

        <label htmlFor="course">Course</label>
        <input
          id="course"
          type="text"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />
        {errors.course && <p className="field-error">{errors.course}</p>}

        <label htmlFor="dueDate">Due date</label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        {errors.dueDate && <p className="field-error">{errors.dueDate}</p>}

        <label htmlFor="notes">Notes (optional)</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button type="submit" className="btn">
          Add activity
        </button>
      </form>
    </main>
  );
}

export default TaskForm;
