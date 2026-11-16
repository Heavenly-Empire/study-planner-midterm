# Week 13 progress

| Task | Owner | Branch | Status | PR | Blockers |
| --- | --- | --- | --- | --- | --- |
| Turso conversion, hosted seed, PROGRESS.md | Naraga | feature/week13-turso | Ready
for review | add link after opening the PR | none |
| Render API deployment | Nurullah | feature/week13-render-api | Not started, waits
for the Turso PR review | none yet | Needs the Turso URL and a token, shared
privately |
| Vercel frontend and Android test | Hifa | feature/week13-mobile-ux | Not started |
none yet | Needs the public API URL |
| Local web QA and fixes | Marcello | feature/week13-web-qa | Not started | none yet
| none |

Each owner updates their own row.

## Evidence (Naraga, 16 November 2026)

Local tests after the conversion: 34 passed, 0 failed. The baseline before the change
was 33 passed. The extra test checks that repeated completion requests keep one
progress row.

Old driver removed: after `npm uninstall better-sqlite3`, a search for
`better-sqlite3`, `.prepare(` and `.pragma(` in the backend source returned no
matches, and the tests still passed.

Production guard: running `NODE_ENV=production node server.js` with no Turso
variables printed this and exited without starting:

    Study Planner API could not open its database: TURSO_DATABASE_URL and
TURSO_AUTH_TOKEN must both be set for a hosted or production database.

Hosted database: Turso database `study-planner`, region aws-ap-northeast-1. The URL
and token are shared privately and are not in the repository.

Hosted seed, run twice with `REMOTE_INIT_CONFIRMED=YES` and chosen demo passwords.
Both runs printed:

    Remote database ready. Accounts "lecturer" and "student" exist.

Rows afterward: `lecturer` (administrator), `student` (client), and 2 activities. The
second run added no duplicates.

Hosted API check against Turso, logged in as `student`:
- Created a private activity. The returned ID was 3, a plain number, so the BigInt
conversion works.
- Marked it complete twice. The progress table held 1 row for it, so the upsert stays
atomic.
- Deleted it. The server returned 204 and the progress count for that ID became 0, so
cascade delete works on Turso.

## Public URLs

- API: none yet
- Web: none yet
