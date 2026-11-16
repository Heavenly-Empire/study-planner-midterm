# Study Planner mobile

JavaScript, Expo SDK 58, Expo Router with routes in app/.

Run npm install and npx expo start --tunnel in this folder. See the parent README for API/network setup and the student demo account. config.js reads the public API address once. .env.local is local and ignored.

On Android and iOS, Study Planner saves only the student token in SecureStore. It checks the token with the API when the app opens. If the API is unavailable, try again from the startup screen. Sign out to remove the token. The browser preview keeps its session until the page is reloaded.
