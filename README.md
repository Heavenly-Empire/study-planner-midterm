# Study Planner - Group 10

Study Planner helps lecturers share class activities and students organise their personal study tasks. The Week 10 update connects the React interface to an Express API and stores accounts, activities and completion records in SQLite.

## Team

- Naraga Aji Anubhawa
- Nurullah Adi Sutrisno Rabani
- Hifa Nur Fathan
- Marcello Immanuel Litano

Hifa Nur Fathan completed the Week 10 update.

## Run locally

Install Node.js 24 LTS and open the repository root in VS Code. For a fresh clone:

1. Copy `backend/.env.example` to `backend/.env`.
2. In `backend/.env`, replace the `JWT_SECRET` placeholder with a unique random secret of at least 32 characters.
3. Copy `study-planner-midterm/.env.example` to `study-planner-midterm/.env`.

Keep existing `.env` files if the project is already configured. These local settings are ignored by Git.

Start the backend in one terminal:

```powershell
cd backend
npm ci
npm run seed
npm start
```

Open a second terminal at the repository root and start the frontend:

```powershell
cd study-planner-midterm
npm ci
npm run dev -- --port 5173 --strictPort
```

Open [Study Planner locally](http://localhost:5173/study-planner-midterm/). The API runs on port 3000. Use `localhost` consistently so the browser origin matches `WEB_ORIGIN`.

The seed creates two demo accounts:

| Role | Username | Password |
| --- | --- | --- |
| Lecturer | lecturer | demo123 |
| Student | student | demo123 |

Running the seed again preserves existing accounts and activities. Example class activities are added only when the activity table is empty.

## Permissions

Lecturers create, edit and delete class activities and view class completion totals. Students see class activities, manage their own private tasks and record their own completion. New registrations receive student accounts. The API checks the signed-in account before returning or changing data; lecturers cannot view private student tasks.

## Checks

Run these commands from the repository root:

```powershell
npm --prefix backend test
npm --prefix study-planner-midterm test
npm --prefix study-planner-midterm run lint
npm --prefix study-planner-midterm run build
```

Backend tests use temporary databases. See [API documentation](docs/API.md) for request fields, responses and access rules.

## Deployment and current scope

- [GitHub repository](https://github.com/Heavenly-Empire/study-planner-midterm)
- [Midterm website](https://heavenly-empire.github.io/study-planner-midterm/)

The public website serves the earlier frontend-only midterm build. The Week 10 application runs locally. Publishing it requires a hosted HTTPS API and a matching allowed frontend origin; GitHub Pages cannot run the Express backend or SQLite database.

Mobile, AI, course modules and reminders are planned for later stages. JWTs expire after one hour. Signing out clears the browser token; server-side token revocation and login rate limiting are not implemented. Local environment files, databases and dependency directories are excluded from Git.
