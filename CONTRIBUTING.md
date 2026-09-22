# Contributing to Study Planner

The shared component contracts are in [README.md](README.md). Please keep each person's changes in their assigned files unless the team agrees on a contract change.

## Assigned areas

| Member | Main files | Goal |
| --- | --- | --- |
| 1 | `src/pages/Login.jsx`, `src/data/users.js`, login CSS | Finish simulated login and explain its state |
| 2 | `src/pages/Menu.jsx`, shared menu CSS, `vite.config.js` | Finish the menu and GitHub Pages deployment |
| 3 | `src/pages/Dashboard.jsx`, `src/components/TaskCard.jsx`, `src/data/tasks.js`, `src/data/selectTasks.js` | Dashboard completed; maintain its role filtering |
| 4 | `src/pages/TaskForm.jsx`, form CSS | Finish validation and show submitted values on the form page |

`src/App.jsx` connects all pages. Discuss changes to its props and callbacks before editing it.

## Branch and pull request workflow

1. Clone `https://github.com/Heavenly-Empire/study-planner-midterm.git` and run `npm install`.
2. Create your own branch, such as `git switch -c member-1-login`.
3. Make a small working change. Run `npm test` and `npm run build`.
4. Commit that change with a clear message, for example `feat(login): show field errors`.
5. Make the next working change and commit it separately, for example `style(login): improve small-screen layout`.
6. Push your branch with `git push -u origin member-1-login` and open a pull request to `main`.
7. Ask another member to review. Merge only after the four-page demo still works.

If you are not yet an invited collaborator, fork the public repository on GitHub, push your branch to your fork, and open a pull request to this repository. Once the owner has your GitHub username, they can invite you at **Settings → Collaborators and teams** so you can push branches directly.

## Shared behavior to preserve

- Lecturer (`administrator`) creates class tasks. Student (`client`) creates personal tasks.
- The dashboard shows Lecturer only class tasks, and Student class tasks plus their own personal tasks.
- Added tasks stay visible when the user logs out and another demo account logs in during the same browser session. Refresh restores the hardcoded starting tasks.
- This midterm app has no backend, database, or real authentication.
