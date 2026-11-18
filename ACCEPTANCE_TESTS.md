# Acceptance checks

The early checklist covers the proposed grading extension. Actual Week 13 results are recorded under [web QA](#week-13-web-qa) and [hosted deployment](#week-13-hosted-deployment).

Record actual result, tester, date and evidence next to each check. Not run means Not run. Use synthetic test accounts and a temporary database, not real student grades.

## Optional grading and submission checks

Run the migration, roster and grading checks when that extension is built.

### Regression and migration

- [x] Current regression checks pass. 33 backend and 18 web tests passed, along with web lint and the production build.
- [ ] Migration on a Week 10 database preserves users, activities and completion.
- [ ] Existing rows become Practice; a second startup skips the applied migration.
- [ ] Personal activities stay personal/Practice even if a client sends assignment or a different owner.
- [ ] An Assignment with submissions cannot be converted back to Practice.
- [ ] Invalid or partial migration cannot leave a half-upgraded database.

### Named progress

- [ ] Lecturer sees A complete and B incomplete for the same class activity.
- [ ] Students with no progress row still appear as incomplete.
- [ ] Class counts agree with the roster. No individual student IDs are hardcoded.
- [ ] Students receive 403 on the lecturer roster endpoint.
- [ ] Lecturer cannot get a personal activity by reusing its ID in the new routes.

### Submission and grading

- [ ] A submits a nonblank response to a class Assignment; id/owner/timestamp come from server.
- [ ] A second submission returns 409 and leaves the first unchanged.
- [ ] Student B cannot read A's response or published grade.
- [ ] Wrong role, expired token and unknown/inaccessible ID return documented errors.
- [ ] Empty/overlong response and boolean/string/out-of-range scores fail validation.
- [ ] Score 0 is accepted and displayed as 0/100 after publication.
- [ ] Lecturer draft is private; student response contains no draft score or feedback.
- [ ] Draft can be edited; publishing without a draft returns 409.
- [ ] Published grade is locked; repeated publish is idempotent and keeps timestamp.
- [ ] Completion checkbox never creates or changes a grade.
- [ ] API restart preserves submission and grade.
- [ ] Deleting a synthetic assignment cascades its submissions and grades only.

## Web/mobile UI

- [ ] New pages have loading, empty, error, retry and pending states.
- [ ] Failed save keeps grade/feedback values and shows an error.
- [ ] Duplicate-click protection does not substitute for server duplicate handling.
- [ ] Returning from detail/review refreshes the relevant list.
- [ ] Phone login, list, detail, completion, back and refresh work against the same backend.
- [ ] Logout/account switching clears stale data; expired token requires sign-in.
- [ ] Native phone capture is labelled separately from responsive browser capture.

## Evidence and release

- [ ] Test output is current; do not reuse the old 7/10 totals after adding tests.
- [ ] Screenshot tokens, real marks, personal IPs and private records are excluded/redacted as appropriate.
- [ ] Report labels unimplemented extensions as planned.
- [ ] Fresh-clone README works for another team member.
- [ ] Diff contains no .env, databases, node_modules, original private submissions or real grading data.

## Week 11 study-plan checks

The results below cover the review branch and the live checks on 12 and 13 November 2026.

| Check | Result |
| --- | --- |
| Authentication and roles | Passed. Requests without a valid student session stop before generation. |
| Activity access | Passed. Students can use visible unfinished work. Other students’ private activities and completed selections are rejected. |
| Limits and empty work | Passed. Invalid dates, minutes, IDs and oversized context are rejected. Empty work returns an empty plan. |
| Text confirmation | Passed. Preview stays local. The server rejects missing confirmation, changed notes, changed choices and another account’s token. |
| Output checks | Passed. Invalid JSON, unfamiliar IDs and over-budget days are rejected. The route allows one validation retry. |
| Provider failures and cost | Passed with a test provider. Timeout, missing setup and rate limit return readable errors. Missing or paid prices stop generation, and the outgoing request includes zero price limits. |
| Browser flow | Passed at 375 px with a test provider. Checked preview, re-review after an edit, generation, editable result, error and lecturer access. |
| Activity data | Passed. Generating and editing a preview leave saved activities and progress intact. |
| Live OpenRouter result | Passed on 12 November. Nemotron 3.5 Lightning (free) returned a study plan, and the OpenRouter log showed $0.00. |
| Android account check | Passed on 13 November. Hifa verified personal activity privacy and separate completion for each student. See `docs/HANDOFF_RECORD.md`. |
| Explain the flow | Pending. Each member explains prompts, token limits, temperature, validation, the server-only key and why the app returns one JSON response. |

## Week 13 web QA

Hifa ran these checks on 17 November 2026 with a fresh local SQLite database and the seeded demo accounts. The baseline was `7abd273`. The mobile navigation fix was tested at `2415bbb`. Browser checks used Chrome 157.0.8103.51 at 1280 × 900 and 375 × 812, with an additional navigation check at 393 × 852.

| Check | Result |
| --- | --- |
| Installation, automated checks, and startup | `npm ci` completed for the API and web app. The backend passed 38 tests. The web app passed 18 tests, `npm run lint`, and `npm run build -- --base=/`. `npm run dev -- --port 5173 --strictPort` started the site at `http://localhost:5173/study-planner-midterm/`. |
| Sign-in and role switching | Passed at both widths. A wrong password displayed an inline error. The lecturer and student could each sign in and sign out. |
| Lecturer dashboard and activity form | Passed at both widths. The lecturer created a class activity and saw its count change from 0 of 1 students to 1 of 1 after the student marked it complete. The dashboard listed class activities. |
| Student dashboard and personal activity form | Passed at both widths. The student saw the class activity, marked it complete, and created a personal activity. The saved result showed `Personal (only you)`. The lecturer's list excluded that activity. Both activity forms showed field-level messages on a blank submission. |
| Study-plan review | Passed at both widths. The preview showed the selected title and notes. The student had to confirm before generating. Editing the daily minutes cleared the preview and required a new review. With OpenRouter unconfigured, generation returned `503` and showed the setup message from Marcello's report. Live generation is part of the Render check. |
| Responsive layout | Passed after the fix. Login, dashboards, forms, and study-plan controls fit at 1280 and 375 px. The long-name case passed at both 375 and 393 px. |

To reproduce the navigation issue on the baseline, sign in as a student, open **Profile**, and save an 80-character name without spaces. At 375 px, the page widened to 1,078 px and the navigation and Logout control extended past the viewport. The expected behavior is for the name to wrap and keep the controls in view. After the fix, the name wrapped and the navigation fit at 375 and 393 px.

The local captures in `docs/week13-web-evidence/` show the inline sign-in error, the 375 px study-plan review, the lecturer's class progress, and the 393 px navigation before and after the fix.

## Week 13 hosted deployment

Hifa ran the hosted checks on 17 November 2026. The production captures identify `458e620` on `main`. The iPhone header fix subsequently merged as `1ed86d4` through PR #6.

| Check | Recorded result |
| --- | --- |
| Public health | `GET https://study-planner-week13-api.onrender.com/api/health` returned `200` with `{"status":"ok"}`. |
| Hosted authentication and data | Student sign-in and activity loading returned `200`. Activities without a Bearer token returned `401`. |
| Vercel connection | The production website at `https://study-planner-midterm.vercel.app` signed in and loaded activities. The API allowed that origin. |
| Android on cellular | Student A completed the web-created class activity 4 on Android 16 over 4G+ at 13:39 WIB. Refreshing Vercel showed the saved status. |
| Two-account visibility | Student B saw activity 4 as incomplete and could not see Student A's personal task. The lecturer progress response showed 1 of 2 completed. |
| Render restart | The Events view records a 13:45 WIB restart. The same activity and completion were present on Android at 13:49 WIB and on Vercel. |
| Live AI | Student B generated a three-day plan from the preview and confirmation flow. OpenRouter logged Nemotron 3.5 Lightning (free) at $0.00. |
| AI role checks | Both AI endpoints returned `403` for the lecturer. |
| iPhone walkthrough | Marcello's Expo Go Wi-Fi report shows the two accounts and separate completion. Hifa fixed the reported header overlap in PR #6. |

The iPhone cellular, session reopen and failed-save retry results remain unverified. Hosted AI failure-and-retry evidence is unrecorded. Earlier acceptance checks cover readable provider failures with a test provider.

See [PROGRESS.md](PROGRESS.md) for ownership and [the Week 13 design update](docs/WEEK13_DESIGN_UPDATE.md) for the API and evidence record.
