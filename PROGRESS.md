# Week 13 progress

| Task | Owner | Branch | Status | PR | Blocker |
| --- | --- | --- | --- | --- | --- |
| Turso conversion and hosted demo database | Naraga (RenSatoru) | `feature/week13-turso` | Review fixes tested locally. Hosted verification pending. | [#2](https://github.com/Heavenly-Empire/study-planner-midterm/pull/2) | Hosted privacy check, evidence, and handoff confirmation |
| Render API and iPhone test | Nurullah | `feature/week13-render-api` | Waiting for the database handoff | Pending | Reviewed Turso changes and private database credentials |
| Mobile UX, Android, and Vercel | Hifa | `feature/week13-mobile-ux` | Mobile PR merged and local Android checks passed. Vercel and the cellular test are pending. | [#3](https://github.com/Heavenly-Empire/study-planner-midterm/pull/3) | Render HTTPS URL |
| Local web QA | Marcello | `feature/week13-web-qa` | Awaiting QA results | Pending | Pending team update |

Naraga keeps the tracker current as the team shares PR links, test results, and deployment URLs.

## Database checks

Naraga tested the async conversion and reported 34 passing backend tests. He also reported running the seed twice on the hosted Turso demo database with two users and two activities afterward. A private activity returned a numeric ID, repeated completion left one progress row, and deleting the activity removed that row.

Hifa’s follow-up passed all 38 backend tests on Windows. The checks cover production database configuration, a local filename containing `#`, persistence across API restarts, and an activity being deleted during a student’s request. A copy of the existing local demo database kept its three users, four activities, and one completion record after two seed runs.

## Hosted handoff

1. Register a second demo student on the hosted database. Sign in as both students and check that they can see the same class activity, each has their own completion status, and the second student gets `404` for the first student’s private activity.
2. Capture the hosted tables or a synthetic activity row with only the fields needed for evidence. Record the date, tested revision, and how reads, writes, and the repeated seed were verified.
3. Confirm that Nurullah has the Turso connection details and Hifa has the demo sign-ins through the team’s private channel. Keep regular local development pointed at the local SQLite file.

Nurullah’s Render PR will make the local `.env` file optional for `npm start`. After Render is reachable, add its HTTPS URL here. Add the Vercel URL after the web deployment.
