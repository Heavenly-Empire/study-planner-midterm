import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { ActionButton, styles } from "../components/ui";

export default function LoginScreen() {
  const { session, signIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (pending) return;
    setError("");
    if (!username.trim() || !password) {
      setError("Enter your username and password.");
      return;
    }
    setPending(true);
    try { await signIn(username, password); }
    catch (err) { setError(err.message); }
    finally { setPending(false); }
  }

  if (session) return <Redirect href="/" />;
  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Your study, in one place</Text>
        <Text style={styles.body}>Sign in to view class activities and your personal study tasks.</Text>
        <Text style={styles.label}>Username</Text>
        <TextInput accessibilityLabel="Username" style={styles.input} value={username} onChangeText={setUsername}
          autoCapitalize="none" autoCorrect={false} editable={!pending} />
        <Text style={styles.label}>Password</Text>
        <TextInput accessibilityLabel="Password" style={styles.input} value={password} onChangeText={setPassword}
          secureTextEntry autoCapitalize="none" editable={!pending} onSubmitEditing={submit} />
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        <ActionButton title={pending ? "Signing in..." : "Sign in"} onPress={submit} disabled={pending} />
        <Text style={styles.muted}>Student accounts only. A restart requires signing in again.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
