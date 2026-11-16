import { useRef, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../../context/AuthContext";
import { useActivity } from "../../../lib/useActivity";
import { ActionButton, ActionFooter, Message, styles } from "../../../components/ui";

export default function CompletionScreen() {
  const { id } = useLocalSearchParams();
  const { session, request } = useAuth();
  const { activity, loading, error, retry } = useActivity(id);
  const saving = useRef(false);
  const completionToSave = useRef(null);
  const [pending, setPending] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(null);
  const shown = saved || activity;

  async function save() {
    if (saving.current) return;
    saving.current = true;
    // A retry keeps the same target in case the server saved it before the response was lost.
    const completed = completionToSave.current ?? !Boolean(shown.completed);
    completionToSave.current = completed;
    setPending(true);
    setSaveError("");
    try {
      const result = await request(`/activities/${id}/completion`, {
        method: "PATCH", body: { completed },
      });
      setSaved(result);
      completionToSave.current = null;
    } catch (err) {
      setSaveError(err.message);
    } finally {
      saving.current = false;
      setPending(false);
    }
  }

  if (!session) return <Redirect href="/login" />;
  if (loading) return <ActivityIndicator size="large" accessibilityLabel="Loading completion" />;
  if (error) return <Message title="Could not load activity" detail={error} retry={retry} />;
  if (!shown) return <Message title="Activity not found" />;

  const actionLabel = pending ? "Saving…" : saveError ? "Try saving again" :
    shown.completed ? "Mark incomplete" : "Mark complete";

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.heading}>{shown.title}</Text>
        <Text style={styles.body}>{shown.course}</Text>
        <Text style={styles.muted}>Due {shown.dueDate}</Text>
        {shown.notes ? <Text style={styles.body}>{shown.notes}</Text> : null}
      </ScrollView>
      <ActionFooter>
        <Text accessibilityLiveRegion="polite" style={styles.label}>
          Your status: {shown.completed ? "Completed" : "Not completed"}
        </Text>
        {saveError ? <Text accessibilityRole="alert" style={styles.error}>{saveError}</Text> : null}
        <ActionButton title={actionLabel} onPress={save} busy={pending} />
      </ActionFooter>
    </View>
  );
}
