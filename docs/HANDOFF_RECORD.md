# Week 12 handoff record (Study Planner, Group 10)

Fill the blanks yourself. A blank or "Not run" means it has not been done. Nothing here is marked as passed unless the result is written next to it.

Owner: Nurullah Date: 10 November 2026
Starting commit: not recorded (changes uploaded through the GitHub website to branch feature/study-plan, created from main)
Node version (node -v): v24.19.0

## 1. Checks run by the owner (Windows, local machine, 10 Nov 2026)

Run from the project root after `npm ci` in `backend` and in `study-planner-midterm`.

| Command | Result |
| --- | --- |
| npm --prefix backend test | 28 tests passed, 0 failed (15 original + 13 new in backend/ai.test.js) |
| npm --prefix study-planner-midterm test | 16 tests passed in 3 files (10 original + 6 new in studyPlan.test.js) |
| npm --prefix study-planner-midterm run lint | No errors |
| npm --prefix study-planner-midterm run build | Built successfully |
| git diff --check | Not run (no local Git repository; changes uploaded through GitHub) |

Note: the backend run prints a MODULE_TYPELESS_PACKAGE_JSON warning from the existing mobile adapter test. It is harmless and was there before this work.

## 2. Check run earlier by the AI assistant (Claude, sandbox, Node 22.23.4)

This was a separate run on the assistant's copy, not on the owner's machine.

| Check | Result |
| --- | --- |
| Backend, web tests, lint and build on a clean install | Same results as section 1 (28 and 16 passed, lint clean, build ok) |
| Real server started with blank OPENROUTER_API_KEY, student login, POST /api/ai/generate-plan | 503 with a readable "not set up" message |

## 3. Still to do by a person

| Item | Result |
| --- | --- |
| Click through the dashboard panel in a browser as a student (select, confirm, generate, edit text, error, account switch, lecturer sees no panel) | |
| Live provider test: model id, date, result, latency or tokens, screenshot of the labelled plan and of a readable failure | |
| Two-student phone checks (handoff p. 2), results into MOBILE_CHECKLIST.md | |
| TASKS.md owner and status lines for each task (new file in this PR) | |
| ACCEPTANCE_TESTS.md rows still marked Not run or Partly (new file in this PR) | |
| Design Document and README review by a teammate from a fresh clone | |
| Optional grading: agree scope first (handoff pp. 5-6) | Not started |
