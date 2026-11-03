import { useState } from "react";
import { ActivityIndicator, ScrollView, Text } from "react-native";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../../context/AuthContext";
import { useActivity } from "../../../lib/useActivity";
import { ActionButton, Message, styles } from "../../../components/ui";

export default function CompletionScreen() {
  const { id } = useLocalSearchParams();
  const { session, request } = useAuth();
  const { activity, loading, error, retry } = useActivity(id);
  const [pending, setPending] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(null);
  const shown = saved || activity;

  async function save() {
    if (pending) return;
    setPending(true);
    setSaveError("");
    try {
      const result = await request(`/activities/${id}/completion`, {
        method: "PATCH", body: { completed: !Boolean(shown.completed) },
      });
      setSaved(result);
    } catch (err) { setSaveError(err.message); }
    finally { setPending(false); }
  }

  if (!session) return <Redirect href="/login" />;
  if (loading) return <ActivityIndicator size="large" accessibilityLabel="Loading completion" />;
  if (error) return <Message title="Could not load activity" detail={error} retry={retry} />;
  if (!shown) return <Message title="Activity not found" />;
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.page}>
      <Text style={styles.heading}>{shown.title}</Text>
      <Text style={styles.body}>Your status: {shown.completed ? "Completed" : "Not completed"}</Text>
      <Text style={styles.body}>This updates your own progress. It does not award a grade or change another student's status.</Text>
      {saveError ? <Text accessibilityRole="alert" style={styles.error}>{saveError}</Text> : null}
      {saved ? <Text style={styles.label}>Saved to Study Planner.</Text> : null}
      <ActionButton title={pending ? "Saving..." : shown.completed ? "Mark incomplete" : "Mark complete"}
        onPress={save} disabled={pending} />
    </ScrollView>
  );
}
