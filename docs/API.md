# API reference

Base URL: http://localhost:3000/api. JSON bodies. Protected requests use Authorization: Bearer <token>. User responses contain id, username, name and role, never password hashes.

| Method | Path | Access | Request | Response |
| --- | --- | --- | --- | --- |
| GET | /health | Public | None | 200: status=ok |
| POST | /auth/register | Public; always student | username, name, password | 201: user |
| POST | /auth/login | Public | username, password | 200: token, user |
| GET | /auth/me | Signed in | None | 200: user |
| PUT | /profile | Own account | name | 200: user |
| GET | /activities | Visible activities | None | 200: activity array |
| POST | /activities | Lecturer: class; student: private | title, course, dueDate, optional notes | 201: activity |
| GET | /activities/:id | Class or own private | None | 200: activity |
| PUT | /activities/:id | Lecturer: class; student: own private | title, course, dueDate, optional notes | 200: activity |
| DELETE | /activities/:id | Same management rules | None | 204: no body |
| PATCH | /activities/:id/completion | Student; visible activity; own progress | completed (boolean) | 200: activity |
| GET | /progress | Lecturer | None | 200: class progress array |
| POST | /ai/plan-preview | Student | startDate, endDate, dailyMinutes, optional activityIds | 200: activities, previewToken |
| POST | /ai/generate-plan | Student | Same plan request, confirmed and previewToken | 200: plan, warnings |

Activity fields: id, title, course, dueDate (YYYY-MM-DD), notes, scope, ownerId, createdAt, completed (0 or 1). completed is the requesting student's status, defaulting to 0. Scope and owner are assigned by the server and cannot be changed by PUT. Progress rows contain id, title, students (all registered students), completed (students who marked the class activity complete).

Errors use an error string in a JSON object. Statuses: 400 invalid fields or JSON; 401 missing, invalid or expired session; 403 known user lacks permission; 404 missing or invisible activity; 409 duplicate username; 413 oversized request; 500 unexpected failure. Another student's private activity returns 404.

Validation: username uses letters, digits and underscores (maximum 40); name maximum 80; password minimum 6 characters, maximum 72 UTF-8 bytes. Usernames are case-insensitive. Activities require title (maximum 120), course (maximum 100), and a valid calendar date; notes are optional text (maximum 2000). SQL values use placeholders. All activity reads require login.

POST /activities example (illustration, not test output):

```json
{"title":"Review JWT middleware","course":"Web Development","dueDate":"2026-10-29","notes":"Trace a protected request."}
```

The server responds with the saved activity. A lecturer receives class scope; a student receives personal scope. IDs and creation timestamps come from SQLite. Submitted roles and ownership values cannot grant permissions.

## Review and generate a study plan

Both routes require a student session. Start with `/ai/plan-preview` to see the exact activity text and receive a token valid for five minutes. This request uses SQLite. After the student confirms the text, send the same choices to `/ai/generate-plan` with `confirmed: true` and the `previewToken`. The server checks the token against the student's account, planning choices and current text. The plan stays in the web preview.

Request: startDate and endDate (real dates, YYYY-MM-DD, end not before start, at most 7 days), dailyMinutes (whole number, 15 to 240), optional activityIds (1 to 10 different positive integers). Without activityIds the server picks up to 10 unfinished activities (class work and the student's own private tasks) in due-date order.

```json
{"startDate":"2026-11-10","endDate":"2026-11-11","dailyMinutes":60,"activityIds":[2]}
```

The preview returns `activities` and `previewToken`. Generation returns `plan` and `warnings`. An example response follows.

```json
{"plan":[{"date":"2026-11-10","activityId":2,"minutes":30,"focus":"Review the selected topic"}],"warnings":[]}
```

What is sent to the provider: id, title, course, due date and notes of the selected activities (combined title, course and notes text of at most 5000 characters). No names, usernames, tokens, grades or submissions. Activity text is sent as data inside JSON and the system prompt tells the model not to follow it.

The server checks the JSON, dates, activity IDs, daily minutes and text length. For one activity, the answer must include a different study task on each of up to three days. When several activities are explicitly selected, the answer must cover at least as many as can fit with one 15-minute session per activity. One retry is allowed if the answer is rejected. The whole request has a 15-second deadline, a 600-token output cap and temperature 0.3. Without activityIds the server skips unfinished work that would push the text over 5000 characters. For deadlines before the first study day, warnings distinguish overdue work from upcoming deadlines. The server logs only outcome, status, model, time and token count.

| Status | Meaning |
| --- | --- |
| 200 | Plan returned. If there is no unfinished work the plan is empty and the provider is not called |
| 400 | Invalid dates, range, minutes or IDs, chosen activities with more than 5000 characters of text, or an explicitly selected completed activity |
| 401 / 403 | No or expired session / lecturer account |
| 404 | An ID is missing or not visible to this student (another student's private task) |
| 409 | Confirmation is missing or the preview no longer matches. Ask the student to review the current text |
| 429 | More than 5 requests per student per minute (the counter is kept in memory and resets when the server restarts) |
| 502 | Provider failed or its answer was not usable |
| 503 | OPENROUTER_API_KEY or AI_MODEL missing, or the model is not a verified zero-price model |
| 504 | The provider did not answer within 15 seconds |

Set `OPENROUTER_API_KEY` and `AI_MODEL` in `backend/.env`. Before each generation attempt, the server checks the model catalogue for explicit zero input and output prices. The request also sets a zero limit for input, output and per-request charges. Provider fallback and SDK retries are disabled.
