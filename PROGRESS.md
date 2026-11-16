# Week 13 progress

| Task | Owner | Branch | Status | PR | Blocker |
| --- | --- | --- | --- | --- | --- |
| Turso conversion and hosted demo database | Naraga (migration), Hifa (review fixes and hosted verification) | `feature/week13-turso` | Local tests and hosted checks passed. | [#2](https://github.com/Heavenly-Empire/study-planner-midterm/pull/2) | PR review and private handoff |
| Render API and iPhone test | Nurullah | `feature/week13-render-api` | Waiting for the database handoff | Pending | Reviewed Turso changes and private database credentials |
| Mobile UX, Android, and Vercel | Hifa | `feature/week13-mobile-ux` | Mobile PR merged and local Android checks passed. Vercel and the cellular test are pending. | [#3](https://github.com/Heavenly-Empire/study-planner-midterm/pull/3) | Render HTTPS URL |
| Local web QA | Marcello | `feature/week13-web-qa` | Awaiting QA results | Pending | Pending team update |

Naraga keeps the tracker current as the team shares PR links, test results, and deployment URLs.

## Database checks

Naraga tested the async conversion and reported 34 passing backend tests. He also reported running the seed twice on the hosted Turso demo database with two users and two activities afterward. A private activity returned a numeric ID, repeated completion left one progress row, and deleting the activity removed that row.

Hifa’s follow-up passed all 38 backend tests on Windows. The checks cover production database configuration, a local filename containing `#`, persistence across API restarts, and an activity being deleted during a student’s request. A copy of the existing local demo database kept its three users, four activities, and one completion record after two seed runs.

## Hosted database verification

Hifa tested PR #2 at `78fc720` on 16 November 2026 at 23:39 Jakarta time using the dedicated Week 13 Turso database in Singapore. Running the seed twice preserved the users, activities, and completion rows. The lecturer and both demo students could sign in. Registering the second username again returned `409`.

- Both students could see class activity `1`. Student A saved completion twice and still had one progress row. Student B's status stayed incomplete.
- Student A could open personal activity `3`. Student B received `404` for its detail and it was absent from their list. Deleting this verification activity removed its completion row.

## Handoff to Render

Save a screenshot of the hosted activity rows for the Design Document. The verified database URL and read/write token are ready for Nurullah through the team's private channel. The demo sign-ins are kept with Hifa for the web and phone tests.

Nurullah’s Render PR will make the local `.env` file optional for `npm start`. After Render is reachable, add its HTTPS URL here. Add the Vercel URL after the web deployment.
