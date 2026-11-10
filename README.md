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

### Optional: AI study plan

Leave OPENROUTER_API_KEY and AI_MODEL blank to run without AI; the route then answers 503. To try it, put your own OpenRouter key and a model id in backend/.env. The server only uses a model the OpenRouter catalogue lists at zero price. Never commit the key. The limit of 5 requests per student per minute resets when the server restarts. See docs/API.md for the route and errors.

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

Done: web app, API, student mobile app, study-plan preview. Planned: hosting (Week 13), optional grading and submissions. The GitHub Pages site is the earlier web demo and has no live API. Editable diagrams and the Design Document are kept by the team outside this repository; ask for the shared copy.
