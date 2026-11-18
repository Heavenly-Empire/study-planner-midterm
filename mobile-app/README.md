# Study Planner mobile

JavaScript, Expo SDK 58, Expo Router with routes in app/.

Run npm ci and npx expo start --tunnel in this folder. See the parent README for API/network setup and the student demo account. config.js reads the public API address once. .env.local is local and ignored.

On Android and iOS, Study Planner saves only the student token in SecureStore. It checks the token with the API when the app opens. If the API is unavailable, try again from the startup screen. Sign out to remove the token. The browser preview keeps its session until the page is reloaded.

## Hosted app

Set the following in this folder's ignored .env.local, then restart Expo:

```text
EXPO_PUBLIC_API_URL=https://study-planner-week13-api.onrender.com
```

Use the team's current private student credentials. On iPhone, sign in to Expo CLI and Expo Go with the same Expo account, then open the tunnel QR code. A teammate can run their own CLI and phone using their own Expo account.

Hifa verified Android 16 over 4G+ and Marcello supplied the iPhone Wi-Fi walkthrough. Hifa's header fix merged in PR #6. See [PROGRESS.md](../PROGRESS.md) for the recorded results.

## Phone checks

1. Open the project in Expo Go. Submit the sign-in form with an empty field, then use **Next** to reach the masked password and **Go** to sign in. The inline error should clear as you type.
2. Close Expo Go and reopen the project. The activity list should return after the server confirms the session. Sign out, close the app and reopen it again to confirm that sign-in is required.
3. On a local test API, change its test JWT secret and restart it while signed in. Refresh the activity list. A 401 should return you to sign-in and clear the saved session.
4. Open an activity with long notes. Scroll through the details and check that **Update completion** stays above the system bar. On the completion screen, interrupt a save and retry. Check that the status updates after the API confirms it.
5. For hosted verification, use the Render URL and repeat the shared activity check on Android and iPhone with Wi-Fi off. Record the device, account label, activity ID and result. Keep screenshots with the demo evidence.
