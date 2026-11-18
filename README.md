# Study Planner - Group 10

Study Planner has a React web app, an Express API and an Expo student mobile app. The hosted API uses Turso; local development uses SQLite. Students can request an AI study plan from the web dashboard.

## Hosted demo

- [Web application](https://study-planner-midterm.vercel.app)
- [API health](https://study-planner-week13-api.onrender.com/api/health)
- [Week 13 progress and contributions](PROGRESS.md)
- [Week 13 design update](docs/WEEK13_DESIGN_UPDATE.md)

To try the hosted app as a student, select **Create student account** on the web sign-in page. For the shared demo accounts (`student`, `student_b` and `lecturer`), ask Hifa privately for the current passwords.

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

Seeding again keeps existing work. On Windows, if the default npm cache fails, use `npm ci --cache .npm-cache` and keep that folder out of Git.

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

### Local demo accounts

| Account | Username | Password | Setup |
| --- | --- | --- | --- |
| Lecturer | `lecturer` | `demo123` | Created by `npm run seed` |
| Student 1 | `student` | `demo123` | Created by `npm run seed` |
| Student 2 | `student_b` | `demo123` | Register in the local web app |

To add Student 2, select **Create student account**, enter `Demo Student B` as the name and use the username and password above. Select **Create account**, then sign in as `student_b`.

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

## Deploy the web app

Import the repository into Vercel after the Render API responds at `/api/health`. Use `main` as the production branch and `study-planner-midterm` as the root directory.

| Setting | Value |
| --- | --- |
| Framework | Vite |
| Node.js | 24.x |
| Install command | `npm ci` |
| Build command | `npm run build -- --base=/` |
| Output directory | `dist` |
| Production environment | `VITE_API_URL` set to the Render HTTPS origin without `/api` |

Set `WEB_ORIGIN` on Render to the stable Vercel origin. After both services deploy, sign in on Vercel and check in DevTools that `/api/auth/login` and `/api/activities` go to Render and return 200. Vite reads `VITE_API_URL` during the build, so redeploy the web app after changing it.

For the phone test, use the same Render origin as `EXPO_PUBLIC_API_URL` in `mobile-app/.env.local`. Restart Expo and use cellular data to open an activity created on the hosted web app. See the [phone checks](mobile-app/README.md#phone-checks) for the session and completion tests.

## Week 13 contributions

| Contributor | Work |
| --- | --- |
| [Hifa (Heavenly-Empire)](https://github.com/Heavenly-Empire) | Improved the mobile app and followed up on the Turso migration by validating hosted database URLs, fixing Windows database paths, and handling activities deleted during a request. Set up and verified hosted Turso, reviewed Nurullah's startup changes, and deployed Render and Vercel. Reran Marcello's web QA, fixed the web navigation overflow and the iPhone header overlap he reported, verified Android 16 and the hosted AI flow, and prepared the design update and evidence. |
| [Nurullah (N3can)](https://github.com/N3can) | Prepared backend startup for Render, including startup without a local `.env` and a clear error for an invalid JWT signing secret. He also built the original AI study plan generator in Week 12. |
| [Naraga (RenSatoru)](https://github.com/RenSatoru) | Converted the backend database layer to libSQL for Turso and ran the initial backend checks. |
| Marcello Immanuel Litano | Ran the initial local web QA, documented the two-student Expo Go walkthrough on iPhone over Wi-Fi, and reported the navigation header overlap. |

In Week 12, Hifa updated Nurullah's AI study plan generator to require student confirmation before sending activity details to OpenRouter, enforce zero-cost routing, and improve the suggested sessions and overdue warnings. [PR #1](https://github.com/Heavenly-Empire/study-planner-midterm/pull/1)

See the [Week 13 progress record](PROGRESS.md) for pull requests and verification results.

## Scope

The web app runs on Vercel and the API runs on Render with Turso storage. Expo Go uses the same hosted API for student workflows. The team verified shared activity progress on Android over cellular, web synchronization, restart persistence and a $0.00 OpenRouter generation. Marcello supplied the iPhone Wi-Fi walkthrough. The current evidence status is recorded in PROGRESS.md. Grading and submissions remain optional.
