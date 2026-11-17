import { ActivityIndicator, Text, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { Message, styles } from "../components/ui";

function Screens() {
  const { session, status, restoreSession, signOut } = useAuth();

  if (status === "restore-error") {
    return (
      <Message title="Could not confirm your sign-in"
        detail="Check that you can reach Study Planner and try again." retry={restoreSession} />
    );
  }
  if (status === "sign-out-error") {
    return (
      <Message title="Could not finish signing out"
        detail="Try again to remove your saved sign-in from this device." retry={signOut} />
    );
  }
  if (status !== "ready") {
    const label = status === "signing-out" ? "Signing out…" : "Opening Study Planner…";
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" />
        <Text accessibilityLiveRegion="polite" style={styles.body}>{label}</Text>
      </View>
    );
  }

  return (
    <>
      <Stack
        key={session ? session.user.id : "signed-out"}
        screenOptions={{ headerTintColor: "#0f766e", headerTransparent: false }}>
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
