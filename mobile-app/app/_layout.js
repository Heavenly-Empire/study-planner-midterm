import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "../context/AuthContext";

function Screens() {
  const { session } = useAuth();
  return (
    <>
      <Stack key={session ? session.user.id : "signed-out"} screenOptions={{ headerTintColor: "#0f766e" }}>
        <Stack.Screen name="login" options={{ title: "Student sign in", headerBackVisible: false }} />
        <Stack.Screen name="index" options={{ title: "Study Planner", headerBackVisible: false }} />
        <Stack.Screen name="activity/[id]" options={{ title: "Activity" }} />
        <Stack.Screen name="activity/[id]/completion" options={{ title: "Update completion" }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}

export default function RootLayout() {
  return <AuthProvider><Screens /></AuthProvider>;
}
