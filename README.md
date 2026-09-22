# Study Planner midterm project

Four React views: Login, Menu, Dashboard, and Add task. Lecturer maps to the assignment's `administrator` role; Student maps to `client`. All data is hardcoded in the frontend. Added tasks live in React state only, so refresh resets them.

## Run locally

```powershell
npm install
npm run dev
```

Demo accounts: `lecturer` / `demo123` and `student` / `demo123`.

## Component contracts

`App.jsx` owns `currentUser`, `currentPage`, and `tasks`. Each page receives props; it must not make a separate copy of the shared task array.

| Owner | File | Props |
| --- | --- | --- |
| Member 1 | `src/pages/Login.jsx` | `onLogin(username, password) -> boolean` |
| Member 2 | `src/pages/Menu.jsx` | `currentUser`, `onNavigate(page)`, `onLogout()` |
| Member 3 | `src/pages/Dashboard.jsx` | `currentUser`, `tasks`, `onNavigate(page)` |
| Member 4 | `src/pages/TaskForm.jsx` | `currentUser`, `onAddTask(task)`, `onNavigate(page)` |

Allowed pages are `menu`, `dashboard`, and `form`. Login is shown automatically when `currentUser` is null. `onAddTask` accepts `{ id, title, course, dueDate, notes, scope, ownerId }` and appends the task to shared state. `scope` is `class` for Lecturer and `personal` for Student. The form must derive `scope` and `ownerId` from `currentUser`.

## Team workflow

1. The shared skeleton and Member 3 dashboard are already on `main`.
2. Each member works on their own branch (`member-1-login`, `member-2-menu`, `member-3-dashboard`, `member-4-form`).
3. Make small commits that represent working steps. Open a pull request and ask another member to review before merge.
4. Member 2 sets the correct Vite `base` for the repository name and deploys to GitHub Pages after the combined app passes the demo flow.

The initial Login, Menu, and TaskForm are scaffolds for their owners to refine. Member 3 owns the complete Dashboard and its sample data.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the exact branch, commit, and pull request steps. The repository is public so teammates can fork it and open pull requests now. Direct pushes require the repository owner to invite their GitHub usernames as collaborators later.

## Dashboard behavior (Member 3)

The dashboard's visibility rule lives in `src/data/selectTasks.js`:

- Lecturer sees only class tasks.
- Student sees class tasks plus personal tasks with their own `ownerId`.
- The visible list is sorted by due date. The summary counts use that same visible list.
- With no visible tasks, the page shows an empty message and an Add study task button.

Run `npm test` for the role-filtering checks and `npm run build` before merging dashboard changes. The build uses Vite's native config loader so it also works in this Windows workspace.
