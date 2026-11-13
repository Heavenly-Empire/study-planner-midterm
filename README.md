# Study Planner - Group 10

Study Planner has three parts that share one API and one SQLite database: a React web app, an Express API, and an Expo student mobile app. Week 12 added the mobile app (pushed to main) and the student study-plan preview (AI).

## Get the code

```bash
git clone https://github.com/Heavenly-Empire/study-planner-midterm.git
cd study-planner-midterm
git rev-parse --short HEAD   # record the commit you started from
```

Folders: backend (API), study-planner-midterm (web app), mobile-app (Expo), docs (API.md). Use Node 22 or newer (checked on Node 22 and 24) with npm. Keep .env files, databases and personal screenshots out of Git.

## Start the backend

Open a terminal in backend. On a fresh checkout copy .env.example to .env and replace JWT_SECRET with a random value of at least 32 characters. Keep PORT=3000 and WEB_ORIGIN=http://localhost:5173. Set HOST=0.0.0.0 only for the phone test.

```bash
cd backend
npm ci
npm run seed
npm start
```

Seeded demo accounts (local only): lecturer / demo123 and student / demo123. Seeding again keeps existing work. On Windows, if the default npm cache fails, use `npm ci --cache .npm-cache` and keep that folder out of Git.

### AI study plan

Put your OpenRouter key and model ID in `backend/.env`, then restart the server. Choose a model with zero input and output prices in the OpenRouter catalogue. The server checks current pricing and asks OpenRouter to keep the request at zero cost. If the key, model or free route is unavailable, the app shows an error. The limit of five generation requests per student per minute resets when the server restarts.

On the student dashboard, choose dates, a daily time limit and unfinished activities. Select **Review details**, read what will be shared with OpenRouter, and check the confirmation box. Select **Generate study plan** to get an editable suggestion. If OpenRouter takes too long, select **Try again**. The server accepts a review for five minutes if the details still match. See `docs/API.md` for the request fields and `docs/HANDOFF_RECORD.md` for the live check.

## Start the web app

```bash
cd study-planner-midterm
cp .env.example .env        # sets VITE_API_URL=http://localhost:3000
npm ci
npm run dev -- --port 5173 --strictPort
```

Open the URL Vite prints, with the /study-planner-midterm/ path. Students see a "Study plan assistant" card on the dashboard.

## Start the phone app

In mobile-app copy .env.example to .env.local and set EXPO_PUBLIC_API_URL to http://YOUR_LAPTOP_IP:3000 (find the address with ipconfig; never localhost or 0.0.0.0). Open that address plus /api/health in the phone browser first: expect status ok. Then:

```bash
cd mobile-app
npm ci
npx expo start --tunnel
```

Scan with Expo Go and sign in as student / demo123. The tunnel serves the app bundle; the phone reaches Express separately on port 3000. Lecturer accounts get a student-only message.

## Checks

```bash
npm --prefix backend test
npm --prefix study-planner-midterm test
npm --prefix study-planner-midterm run lint
npm --prefix study-planner-midterm run build
git diff --check
```

## Scope

The web app, API, student mobile app and study-plan preview run locally. The GitHub Pages site is the earlier web demo. Backend deployment is scheduled for Week 13. Grading and submissions remain optional. The team keeps the editable diagrams and Design Document in its shared files.
