# Study Planner - Group 10 - Week 12

This local continuation adds the student mobile client to the existing web/API source. The original checkout is preserved. No push or deployment has been made.

## Start the backend

Open C:\Users\hifan\Downloads\Week 12\study-planner in VS Code. In a Command Prompt terminal:

```cmd
cd backend
whoami
npm install
npm run seed
npm start
```

The local backend .env is prepared with a random signing secret, port 3000, HOST=0.0.0.0 and WEB_ORIGIN=http://localhost:5173. Do not share .env. The source default HOST remains 127.0.0.1. This fresh database contains the existing synthetic demo accounts and seeded class activities. Running seed again preserves existing work.

## Test the phone network first

Use ipconfig to find the active Wi-Fi IPv4 address. On the PHONE browser open http://YOUR_LAPTOP_IP:3000/api/health. JSON status ok proves connectivity. The protected activities endpoint should return 401 without a token.

The prepared mobile-app/.env.local contains only EXPO_PUBLIC_API_URL=http://YOUR_LAPTOP_IP:3000. That was the observed Wi-Fi address during setup; change it if the network changes. Never use localhost or 0.0.0.0 as the phone URL. Expo --tunnel exposes Metro, not Express: port 3000 must be reachable separately. Keep the laptop and phone on a suitable trusted network.

## Start the mobile client

Open a second terminal at the repository root:

```cmd
cd mobile-app
whoami
npm install
npx expo start --tunnel
```

Scan with Expo Go. Use the synthetic student / demo123 account. Lecturer accounts receive a student-only message. Tokens stay in memory; restarting the app requires another login.

Open an activity, choose Update completion, and mark it complete/incomplete. The displayed result changes only after the server confirms it. Back reloads the focused detail/list. Pull down to refresh. Errors offer retry; a 401 clears the matching session. Sign out before changing accounts.

## Start the existing web app

Open a third terminal at the repository root:

```cmd
cd study-planner-midterm
npm install
npm run dev -- --port 5173 --strictPort
```

Open http://localhost:5173/study-planner-midterm/. Demo lecturer / demo123 creates class activities. Student / demo123 sees class and own private work.

Create a class activity on web, refresh the phone, open that activity, and mark it complete. Refresh the lecturer summary to verify the shared database. Stop the backend once, confirm a readable phone error, restart it, and retry. Capture real phone login/list/detail/action, shared completion, and recovery.

## Checks and scope

15 backend tests pass, including real-API tests for the mobile HTTP adapter. The 10 existing web tests, web lint and build pass. The 10 mobile JavaScript files pass lint; Metro web/native JavaScript exports pass. Exports used no-bytecode debugging mode, not a signed production release. Physical Android checks now verify login, list/detail, completion, phone/web synchronization, pull-to-refresh, and outage/retry recovery. The living Design Document includes all original evidence.

```cmd
npm --prefix backend test
npm --prefix study-planner-midterm test
npm --prefix study-planner-midterm run lint
npm --prefix study-planner-midterm run build
```

The living Design Document retains its filename and historical Week 10 appendix. Mobile use cases, architecture, UI wireframes and progress are updated. Editable diagrams are in docs/Week12-Diagrams.drawio.

AI, assignment submissions, named grading, hosting, reminders and course catalogues remain planned. This mobile milestone uses existing endpoints and requires no schema migration.

Keep .env, .env.local, databases, node_modules, PDFs and personal screenshots out of Git. Review actual changes before a genuine commit; do not invent history. Public source ZIPs exclude local settings and dependencies.

## Fresh source ZIP or another computer

Before starting a fresh source copy, copy backend/.env.example to backend/.env. Replace JWT_SECRET with your own random value of at least 32 characters. Set HOST=0.0.0.0 only for the intended LAN phone test. Copy study-planner-midterm/.env.example to .env in that same web folder. Copy mobile-app/.env.example to mobile-app/.env.local and enter the actual laptop LAN API address. These files are omitted from the source package except safe examples; the installed local Week 12 copy is already configured. Then follow npm install, npm run seed and npm start as above.
