# Study Planner Week 13 design update

Group 10 · Updated 18 November 2026 · Evidence recorded on 16–17 November.

[Progress tracker](../PROGRESS.md) · [API contract](API.md)

## Architecture and deployments

The React web app on Vercel and the Expo student app call the same HTTPS Express API on Render. Express verifies the JWT, loads the account and checks its role and activity access. The deployed API uses Turso in Singapore. Local development uses a separate SQLite file.

| Component | Address or setting |
| --- | --- |
| Web | https://study-planner-midterm.vercel.app |
| API | https://study-planner-week13-api.onrender.com |
| Health check | `GET /api/health` |
| Web build | Root `study-planner-midterm`, install `npm ci`, build `npm run build -- --base=/`, output `dist` |
| API startup | Root `backend`, build `npm ci`, start `npm start`, `HOST=0.0.0.0`, Render-supplied `PORT` |
| Client configuration | `VITE_API_URL` for web and `EXPO_PUBLIC_API_URL` for mobile point to the Render origin |
| Browser origin | `WEB_ORIGIN=https://study-planner-midterm.vercel.app` |
| Server credentials | JWT signing secret, Turso token and OpenRouter key are configured on the backend |

Both production captures identify the PR #5 merge, `458e620`. The later iPhone header adjustment merged through PR #6 at `1ed86d4`. These are the source revisions shown by the saved evidence.

## Tables and roles

- `users` stores the username, name, bcrypt password hash and role.
- `activities` stores the owner, title, course, due date, notes, visibility and creation time.
- `activity_progress` stores one completion value per `(activity_id, student_id)` pair.

Lecturers manage class activities and view aggregate class progress. Students see class activities and their own personal tasks. Completion belongs to the authenticated student. Access to another student's private activity returns `404`. File storage is not applicable to this demo.

## API examples

The API base is `https://study-planner-week13-api.onrender.com/api`. Protected requests carry `Authorization: Bearer <token>`.

- `POST /auth/login` takes a username and password and returns `{user, token}`.
- `GET /auth/me` returns the user after session validation.
- `GET /activities` lists visible activities. The recorded student request returned `200`; an unauthenticated request returned `401`.
- `PATCH /activities/4/completion` with `{"completed":true}` returns the saved activity with `completed: 1`.
- `GET /progress` returns a class progress array for the lecturer. The recorded row for activity 4 had `students: 2` and `completed: 1`.
- `POST /ai/plan-preview` returns selected activity text and a preview token. After confirmation, `POST /ai/generate-plan` returns `{plan, warnings}`. Both endpoints returned `403` for the lecturer.

## Mobile behavior

The student JWT is saved in SecureStore. On reopening, the mobile app calls `GET /auth/me` to validate it. A connection error offers a retry. Sign-out and an active-session `401` clear the saved sign-in.

The form scrolls with the keyboard open. Next focuses Password and Go submits. Passwords are masked and missing values show inline errors. Action buttons use a minimum 48-unit touch target.

The completion screen keeps the button above the system navigation area. A synchronous guard blocks duplicate taps. A failed save keeps the last confirmed status, and retry sends the same intended boolean.

Marcello's iPhone report showed content hidden under the navigation header. Hifa set `headerTransparent: false` in the shared stack. PR #6 merged that change as `1ed86d4`. The physical iPhone report covers the original Wi-Fi walkthrough.

## Hosted results

Hifa performed the hosted API, web and Android checks. Marcello supplied the iPhone Expo Go report. The [Week 13 progress record](../PROGRESS.md) credits the team's work and links to the pull requests.

| Check | Result | Local evidence file |
| --- | --- | --- |
| API health | Returned `200` and `{"status":"ok"}`. | `render-health-after-restart.png` |
| Vercel | Production overview showed Ready on main. Login and activity requests returned `200`. | `vercel-production-overview.png`, `vercel-network-sign-in.png` |
| Shared record | The lecturer created class activity 4, **Week 13 deployment check**, due 30 Nov. | `vercel-class-activity-4.png` |
| Android cellular | Student A completed activity 4 on Android 16 over 4G+ at 13:39 WIB. | `android-cellular-activity-4-before-restart.jpg` |
| Restart | Render restarted at 13:45 WIB. Android retained completion at 13:49 WIB and Vercel showed the saved status. | `render-restart-events-2026-11-17.png`, `android-cellular-activity-4-after-restart.jpg`, `vercel-activity-4-after-restart.png` |
| Privacy | Student B saw activity 4 as incomplete and did not see Student A's private task. | `android-cellular-student-b-activity-list.jpg` |
| OpenRouter | Nemotron 3.5 Lightning (free) generated the plan and the provider log showed $0.00. Lecturer AI requests returned `403`. | `vercel-generated-study-plan.png`, `openrouter-generation-cost.png` |
| iPhone | Both student views worked in Expo Go over Wi-Fi. | `week13-iphone-expo-go-wifi-report-marcello.pdf` |

The Design Document PDF and screenshots are retained locally with Hifa. Selected captures are embedded in that PDF. The Android record uses Android 16 and omits the phone model at Hifa's request.

iPhone cellular, session and failed-save retry results are unverified. Earlier tests covered AI failure messages and retries with a test provider. A hosted AI retry result and the team rehearsal remain unrecorded.

## Demo walkthrough

Show activity 4 on Vercel and Android. Explain JWT validation, the account lookup, the visibility check and the completion update in Turso. Compare Student A and Student B, then show the saved completion around the Render restart. Finish with the study-plan preview, generated result and $0.00 OpenRouter log.

The locally saved PDF contains the recorded run for use if connectivity is unavailable. Refer to PROGRESS.md for the evidence status and contributor history.
