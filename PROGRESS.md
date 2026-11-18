# Week 13 progress

Updated by Hifa on 18 November 2026. Test results below were recorded on 16–17 November.

| Task | Contribution | Status | PR |
| --- | --- | --- | --- |
| Turso conversion and hosted database | [Naraga (RenSatoru)](https://github.com/RenSatoru) implemented the migration. Hifa validated hosted database URLs, fixed Windows database paths and handled activities deleted during a request. Hifa also provisioned the team's demo database and verified hosted reads and writes. | Merged. Database setup and verification completed. | [#2](https://github.com/Heavenly-Empire/study-planner-midterm/pull/2) |
| Render API deployment | [Nurullah (N3can)](https://github.com/N3can) prepared backend startup. Hifa reviewed it, configured Render and completed the hosted API, CORS and restart checks. | Merged. API is deployed and the recorded checks passed. | [#5](https://github.com/Heavenly-Empire/study-planner-midterm/pull/5) |
| Mobile UX, Android and Vercel | [Hifa (Heavenly-Empire)](https://github.com/Heavenly-Empire) implemented session and form improvements, verified Android 16 over 4G+, deployed Vercel and checked shared data. | Merged. Android and web integration checks passed. | [#3](https://github.com/Heavenly-Empire/study-planner-midterm/pull/3) |
| Local web QA | Marcello supplied initial local checks. Hifa reran them, fixed navigation overflow and published the work on GitHub. | Merged. Desktop and narrow-screen checks passed. | [#4](https://github.com/Heavenly-Empire/study-planner-midterm/pull/4) |
| iPhone walkthrough and header fix | Marcello supplied the Expo Go Wi-Fi walkthrough. Hifa fixed the reported navigation header overlap. | Wi-Fi account checks recorded. Header fix merged. | [#6](https://github.com/Heavenly-Empire/study-planner-midterm/pull/6) |
| Hosted OpenRouter flow | Hifa configured the backend and verified a student generation, zero-cost provider log and lecturer access denial. | Passed with Nemotron 3.5 Lightning (free), $0.00. | Included in hosted verification |
| Design Document and evidence | Hifa collected the screenshots, deployment revisions, API results and contributor records. | [Markdown design update](docs/WEEK13_DESIGN_UPDATE.md) recorded; PDF and screenshots are kept locally with Hifa. | This documentation update |

## Deployed application

- Web application — [study-planner-midterm.vercel.app](https://study-planner-midterm.vercel.app)
- API health — [study-planner-week13-api.onrender.com/api/health](https://study-planner-week13-api.onrender.com/api/health)
- Architecture, API examples and evidence — [Week 13 design update](docs/WEEK13_DESIGN_UPDATE.md)

The production captures identify `main` at `458e620` for both Vercel and Render. The mobile header fix subsequently merged into `main` as `1ed86d4`. The deployment revisions describe the captured runs.

## Hosted checks on 17 November

| Check | Recorded result |
| --- | --- |
| Public API | `GET /api/health` returned `200` with `{"status":"ok"}`. |
| Hosted data | Student login and `GET /api/activities` returned `200` with the seeded rows. The activities endpoint returned `401` without a token. |
| Vercel integration | Browser login and activity loading returned `200`. The API allowed the production Vercel origin. |
| Android and web sync | Hifa created class activity **4**, **Week 13 deployment check**, on Vercel. Student A completed it on Android 16 over 4G+ at 13:39 WIB, and Vercel showed the saved completion. |
| Student privacy | Student B saw activity 4 as incomplete and could not see Student A's **Private review practice**. The lecturer progress endpoint reported **1 of 2 students completed** activity 4. |
| Persistence | Render recorded a restart at 13:45 WIB. Android still showed activity 4 completed at 13:49 WIB, and Vercel retained the same saved status. |
| OpenRouter | The student preview and confirmation flow generated three daily sessions. OpenRouter logged Nemotron 3.5 Lightning (free) at **$0.00**. Both AI endpoints returned `403` for a lecturer. |

## iPhone evidence

Marcello's Expo Go report shows the two student views over Wi-Fi. Student A sees their personal task and activity 4 as complete. Student B sees only the class activities and activity 4 as incomplete. Hifa addressed the reported header overlap in `9f2a514`, merged as `1ed86d4`.

The supplied report does not establish an iPhone cellular run, session reopen or failed-save retry. Those results remain unverified.

## Verification history

Naraga reported 34 passing backend tests for the initial database conversion. Hifa's follow-up passed 38 backend tests covering production configuration, Windows database paths, persistence and activity deletion during a request. A copy of the existing local demo database retained its users, activities and completion after two seed runs.

On 16 November at 23:39 WIB, Hifa verified PR #2 at `78fc720` against the dedicated Singapore Turso database. A repeated seed preserved existing rows. Both demo students could sign in. Re-registering the second username returned `409`. Repeated completion for class activity 1 kept one progress row. Student B received `404` for Student A's personal activity 3, and deleting that test activity removed its progress row.

Hifa verified PR #5 with 39 passing backend tests. Web QA at `2415bbb` passed 18 web tests, lint and the production build. These counts belong to their recorded revisions.
