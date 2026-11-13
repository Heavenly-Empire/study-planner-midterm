# Study Planner project rules

- Use JavaScript. The backend is Express with SQLite, the web client is React with Vite, and the mobile client uses Expo SDK 58 and Expo Router.
- Keep the current project folders. The web client reads `VITE_API_URL`. The mobile client reads `EXPO_PUBLIC_API_URL` in `mobile-app/config.js` and keeps its routes in `mobile-app/app/`.
- Keep the existing routes, fields and role checks compatible. Document new routes in `docs/API.md` and Section 5 of the Design Document.
- Keep provider keys, signing secrets, `.env` files and databases out of Git. Only the backend talks to OpenRouter.
- Let the student review the exact activity text before sending it. Keep AI suggestions separate from activities, deadlines, completion and grading.
- Use comments to explain why a permission check is needed or why a preview expires.
- Test with synthetic records. Record automated results, live provider evidence and physical phone checks separately.
