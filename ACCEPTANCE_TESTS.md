# Acceptance checks for the proposed update

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
