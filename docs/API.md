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

Activity fields: id, title, course, dueDate (YYYY-MM-DD), notes, scope, ownerId, createdAt, completed (0 or 1). completed is the requesting student's status, defaulting to 0. Scope and owner are assigned by the server and cannot be changed by PUT. Progress rows contain id, title, students (all registered students), completed (students who marked the class activity complete).

Errors use an error string in a JSON object. Statuses: 400 invalid fields or JSON; 401 missing, invalid or expired session; 403 known user lacks permission; 404 missing or invisible activity; 409 duplicate username; 413 oversized request; 500 unexpected failure. Another student's private activity returns 404.

Validation: username uses letters, digits and underscores (maximum 40); name maximum 80; password minimum 6 characters, maximum 72 UTF-8 bytes. Usernames are case-insensitive. Activities require title (maximum 120), course (maximum 100), and a valid calendar date; notes are optional text (maximum 2000). SQL values use placeholders. All activity reads require login.

POST /activities example (illustration, not test output):

```json
{"title":"Review JWT middleware","course":"Web Development","dueDate":"2026-10-29","notes":"Trace a protected request."}
```

The server responds with the saved activity. A lecturer receives class scope; a student receives personal scope. IDs and creation timestamps come from SQLite. Submitted roles and ownership values cannot grant permissions.
