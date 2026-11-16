import { useRef, useState } from "react";
import { Keyboard, Platform, ScrollView, Text, TextInput } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { ActionButton, styles } from "../components/ui";

export default function LoginScreen() {
  const { session, signIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const usernameInput = useRef(null);
  const passwordInput = useRef(null);
  const submitting = useRef(false);
  const missingUsername = attempted && !username.trim();
  const missingPassword = attempted && !password;

  async function submit() {
    if (submitting.current) return;
    setAttempted(true);
    setError("");
    if (!username.trim() || !password) {
      const firstEmptyInput = username.trim() ? passwordInput : usernameInput;
      firstEmptyInput.current?.focus();
      return;
    }

    submitting.current = true;
    setPending(true);
    Keyboard.dismiss();
    try {
      await signIn(username, password);
    } catch (err) {
      setError(err.message);
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  if (session) return <Redirect href="/" />;
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.page}
      keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}>
      <Text style={styles.body}>Sign in to view your class activities and personal study tasks.</Text>
      <Text style={styles.label}>Username</Text>
      <TextInput ref={usernameInput} accessibilityLabel="Username" style={styles.input}
        value={username} onChangeText={value => { setUsername(value); setError(""); }}
        autoCapitalize="none" autoCorrect={false} autoComplete="username" editable={!pending}
        returnKeyType="next" submitBehavior="submit" onSubmitEditing={() => passwordInput.current?.focus()} />
      {missingUsername ? <Text accessibilityRole="alert" style={styles.error}>Enter your username.</Text> : null}
      <Text style={styles.label}>Password</Text>
      <TextInput ref={passwordInput} accessibilityLabel="Password" style={styles.input}
        value={password} onChangeText={value => { setPassword(value); setError(""); }}
        secureTextEntry autoCapitalize="none" autoCorrect={false} autoComplete="current-password"
        editable={!pending} returnKeyType="go" submitBehavior="submit" onSubmitEditing={submit} />
      {missingPassword ? <Text accessibilityRole="alert" style={styles.error}>Enter your password.</Text> : null}
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      <ActionButton title={pending ? "Signing in…" : "Sign in"} onPress={submit} busy={pending} />
      {Platform.OS === "web" ? null :
        <Text style={styles.muted}>Your sign-in is saved on this device.</Text>}
    </ScrollView>
  );
}
