# Acceptance checks for the proposed update

Record actual result, tester, date and evidence next to each check. Not run means Not run. Use synthetic test accounts and a temporary database, not real student grades.

## Regression and migration

- [ ] Existing backend/frontend checks, lint and build still pass.
- [ ] Migration on a Week 10 database preserves users, activities and completion.
- [ ] Existing rows become Practice; a second startup skips the applied migration.
- [ ] Personal activities stay personal/Practice even if a client sends assignment or a different owner.
- [ ] An Assignment with submissions cannot be converted back to Practice.
- [ ] Invalid or partial migration cannot leave a half-upgraded database.

## Named progress

- [ ] Lecturer sees A complete and B incomplete for the same class activity.
- [ ] Students with no progress row still appear as incomplete.
- [ ] Class counts agree with the roster. No individual student IDs are hardcoded.
- [ ] Students receive 403 on the lecturer roster endpoint.
- [ ] Lecturer cannot get a personal activity by reusing its ID in the new routes.

## Submission and grading

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


## Week 11 AI acceptance

- [x] Missing/expired token returns 401 before any provider request; lecturer gets 403 for the student-only plan route.  
  Result: automated, backend/ai.test.js, run in sandbox 2026-11-10 (Node 22.23.4); no teammate has re-run it yet; lecturer 403 checked.
- [x] Inaccessible IDs return 404; own unfinished personal IDs are allowed, but other students' private IDs return 404 and completed selections are rejected.  
  Result: automated, backend/ai.test.js, run in sandbox 2026-11-10 (Node 22.23.4); no teammate has re-run it yet.
- [x] Empty/overlong IDs, invalid days/minutes and excessive combined text are rejected before billing.  
  Result: automated, backend/ai.test.js, run in sandbox 2026-11-10 (Node 22.23.4); no teammate has re-run it yet; over 5000 characters returns 400.
- [ ] Prompt instructions inside activity text cannot grant permissions, run tools, change marks or make server writes.  
  Result: Partly: text is sent as data inside markers and the route has no tools or writes (automated). Not tried against a live model.
- [ ] Only authorized context is sent; only the signed-in student's selected visible work may reach the provider after confirmation; no keys, tokens, identities, other users' records, submissions or grades are sent. Raw task text is not routinely logged.  
  Result: Partly: fields sent and logs checked with a stub (automated). The confirmation step is not yet clicked through in a browser.
- [x] Missing configuration, timeout, provider failure and rate limit show safe errors.  
  Result: automated, backend/ai.test.js, run in sandbox 2026-11-10 (Node 22.23.4); no teammate has re-run it yet (503, 504, 502, 429).
- [x] Malformed JSON, unknown IDs, invalid days, over-budget minutes and oversized output fail validation.  
  Result: automated, backend/ai.test.js, run in sandbox 2026-11-10 (Node 22.23.4); no teammate has re-run it yet.
- [x] Validation retry is bounded; it cannot cause an unlimited request loop.  
  Result: automated, backend/ai.test.js, run in sandbox 2026-11-10 (Node 22.23.4); no teammate has re-run it yet; 2 provider calls at most.
- [x] Cache keys, if used, include user/source/config and are invalidated on content changes.  
  Result: N/A: no cache implemented.
- [ ] UI shows empty, loading, labelled success and recoverable error; clears state between users.  
  Result: Not run: panel is built but not clicked through in a browser.
- [ ] Real provider integration is demonstrated separately from mocked tests, or a real blocker is recorded.  
  Result: Not run: needs your OpenRouter key and a free model; record the blocker if it fails.
- [ ] Developer explains tokens, temperature, system/user prompts, API key placement, SSE and non-streaming choice.  
  Result: Not run: for each member to answer.
- [x] AI never saves a grade or changes completion/deadlines. Lecturer-only grading tests remain in force.  
  Result: automated, backend/ai.test.js, run in sandbox 2026-11-10 (Node 22.23.4); no teammate has re-run it yet (activities and completion unchanged after a request).

- [x] Valid date range and per-date minute totals checked; empty eligible work skips the provider.  
  Result: automated, backend/ai.test.js, run in sandbox 2026-11-10 (Node 22.23.4); no teammate has re-run it yet.
- [ ] Free model and zero-price routing verified; paid fallback is disabled.  
  Result: Partly: zero-price check and no paid fallback tested with a fake catalogue (automated). Live catalogue check not run.
- [ ] Editable preview never writes activities, completion or grades.  
  Result: Partly: server writes nothing (automated). The editable preview is client-only by design but not checked in a browser.
