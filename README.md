# Study Planner — Group 10

Study Planner is a small React web application for organizing class and personal study activities. It was created for the Web and Mobile Application Development midterm project.

The project demonstrates a complete front-end flow: simulated sign-in, role-based content, protected routes, a dashboard, a profile page, a controlled activity form, validation, submitted output, responsive styling, and a real GitHub Pages deployment.

**Live website:** https://heavenly-empire.github.io/study-planner-midterm/

## Midterm scope

This version is deliberately front-end only. It uses hardcoded demo accounts and activities, then keeps new activities in React state.

It does **not** include:

- a backend API;
- a database;
- permanent user accounts or real authentication;
- data persistence after a full page refresh; or
- the final mobile application and AI features.

Refreshing the page returns the app to its original demo data and signed-out state. That behavior is intentional for the midterm scope.

## Demo accounts

| Role shown in the app | Username | Password | Main goal |
|---|---|---|---|
| Lecturer (administrator) | `lecturer` | `demo123` | Create and review activities shared with the whole class. |
| Student (client) | `student` | `demo123` | Review class activities and manage personal study activities. |

## Permission matrix

| Capability | Lecturer | Student |
|---|:---:|:---:|
| Sign in, navigate, view profile, and log out | Yes | Yes |
| View class activities | Yes | Yes |
| View personal activities | No | Own activities only |
| Create class activities | Yes | No |
| Create personal activities | No | Yes |
| Receive validation and submitted output | Yes | Yes |

The same form component is used by both roles. It creates a class activity for the lecturer and a personal activity for the student.

## Pages and routes

| Route | Purpose |
|---|---|
| `#/login` | Simulated role-based sign-in with clear invalid-credential feedback. |
| `#/dashboard` | Role-filtered activity summary and upcoming activity cards. |
| `#/profile` | Current user's role and permissions. |
| `#/form` | Controlled activity form with required-field validation and submitted output. |
| Any unknown route | A 404 page with a route back to the dashboard. |

Dashboard, profile, and form routes are protected. A signed-out visitor is redirected to the login page.

## Activity data model

Activities follow one shared structure:

```js
{
  id,
  title,
  course,
  dueDate,
  notes,
  scope,   // "class" or "personal"
  ownerId
}
```

The source arrays are kept in `src/data/`. Dashboard filtering is handled by `getVisibleTasks`, and stable activity IDs are used as React keys.

## Loading, empty, and error states

The app loads the hardcoded activity data through a small asynchronous adapter. This keeps the data local while exercising the same loading, success, empty, and error states that a later API-backed version will require.

For demonstration and grading, open one of these URLs and then sign in:

- Normal data: https://heavenly-empire.github.io/study-planner-midterm/
- Empty state: https://heavenly-empire.github.io/study-planner-midterm/?demo-state=empty#/login
- Error state: https://heavenly-empire.github.io/study-planner-midterm/?demo-state=error#/login

The error view includes a retry button. The empty view directs the user to the activity form.

## Run the project locally

Requirements: a current Node.js release and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Quality checks

Run the complete unit-test suite:

```bash
npm test
```

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

The tests cover demo credential matching, role-based task visibility and sorting, immutability of the shared data, and the normal, empty, and error loading states.

## Technology

- React 19
- React Router with `HashRouter`
- Vite
- Plain CSS with a 375-pixel responsive breakpoint
- Vitest
- ESLint
- GitHub Pages

`HashRouter` and the Vite base path allow routes to work correctly on GitHub Pages without server-side route configuration.

## Suggested live-demo flow

1. Show an incorrect login and the error message.
2. Sign in as the lecturer and explain the class-only dashboard.
3. Submit a valid class activity and show the submitted output.
4. Return to the dashboard and confirm the new class activity is listed.
5. Log out, sign in as the student, and show both class and personal activities.
6. Submit a personal activity and point out “Personal (only you).”
7. Briefly show the profile page, protected-route behavior, responsive layout, and the empty/error demonstration URLs.

## Repository structure

```text
src/
├── components/    Shared navigation and activity-card components
├── data/          Demo users, activities, selectors, and unit tests
├── pages/         Login, dashboard, profile, form, and 404 pages
├── App.jsx        Shared state, authentication flow, and routes
├── main.jsx       HashRouter entry point
└── styles.css     Shared and responsive styling
```
