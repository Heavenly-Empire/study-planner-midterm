# Week 12 task tracker

Use this table to track the work and the evidence. Add an owner when the team assigns one.

| Task | Suggested owner | Dependency | Deliverable and completion gate | Actual owner / status |
| --- | --- | --- | --- | --- |
| W12-01 | Integration lead | None | Fresh clone runs; baseline checks and starting commit recorded | Fresh checkout of `b8e1827` verified on 10 Nov. Backend and web tests, lint and build passed. |
| W11-AI1 | Backend + web | W12-01 | Protected study-plan route, server-only provider client, bounded prompt and JSON contract | Nurullah built the generator on `main`. The review branch adds server-side confirmation and passes the local checks on 10 Nov. |
| W11-AI2 | Backend + web + reviewer | W11-AI1 | Timeout, validation, cost limits, labelled UI, automated tests and real provider demonstration | Nurullah implemented validation, timeout and rate limits. The review branch adds zero-price enforcement. A live OpenRouter run and reviewer assignment are pending. |
| W12-02 | Backend + mobile | 01 | Optional HOST support; phone health works; protected task list still returns 401 without JWT | Hifa / Phone health and LAN setup shown in the Week 12 submission. |
| W12-03 | Mobile | 02 | SDK58 JavaScript shell, Router app/, config.js and ignored local address; Expo Go loads | Hifa / Expo client published on `main` and demonstrated on Android. |
| W12-04 | Mobile | 03 | Student login, FlatList, ID detail, completion, refresh and error states tested on phone | Hifa / Login, list, detail, completion, refresh and recovery demonstrated. Teammate two-account check pending. |
| W12-05 | Web + backend | 01 | Agree Assignment/Practice, immutable submission, fixed /100 and draft/publication policy | Unassigned / Not started |
| W12-06 | Backend | 05 | Versioned migration preserves old rows and cascades new records correctly | Unassigned / Not started |
| W12-07 | Backend | 06 | Proposed contract implemented with authorization, draft privacy and validation tests | Unassigned / Not started |
| W12-08 | Web | 07 | Named progress, submission form, grade review and student results; pending/error states | Unassigned / Not started |
| W12-09 | Reviewer + owners | 04,08 | Two-student privacy test, restart persistence, regression checks and real screenshots | API role and privacy checks pass. Teammate phone check and live provider result pending. Optional grading checks follow if the team builds it. |
| W12-10 | Documentation owner | Actual progress | Same report updated; mobile use cases, architecture, UI designs, real progress and owners | Hifa / Week 12 mobile report complete. The study-plan update records the local results and the pending live check. |

## Scope gate

The Week 11 working-AI milestone, required report work and suggested phone work come first. W12-05 through W12-08 are requested extensions. If time runs short, keep them planned and finish the Week 12 mobile/report handoff. Do not delay all required documentation to build a full grading system.

Week 11 slides 86-106 expect teams to select and start a project feature, working by the following week. Develop W11-AI1/2 in parallel with mobile after the baseline. Grading stays optional.

## Review each task

- Which files changed? Why?
- Can the author explain the code?
- What acceptance checks actually passed or failed?
- Is the migration safe for a database with old activities?
- Are private student tasks and draft grades still hidden?
- Does the report distinguish real implementation, wireframes and future plans?
- Are the commit and pull request focused on this task?

## Suggested commit boundaries

Commit after real working increments: LAN configuration; mobile shell/login; mobile list/detail; mobile completion; named progress API; submission schema/API; draft/publication API; web review/results; updated design document. Do not create empty commits, backdate work or rewrite published history to imitate weekly progress.
