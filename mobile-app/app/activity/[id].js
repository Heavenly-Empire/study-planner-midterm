import { ActivityIndicator, ScrollView, Text } from "react-native";
import { Redirect, Stack, router, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useActivity } from "../../lib/useActivity";
import { ActionButton, Message, styles } from "../../components/ui";

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams();
  const { session } = useAuth();
  const { activity, loading, error, retry } = useActivity(id);
  if (!session) return <Redirect href="/login" />;
  if (loading) return <ActivityIndicator size="large" accessibilityLabel="Loading activity" />;
  if (error) return <Message title="Could not load activity" detail={error} retry={retry} />;
  if (!activity) return <Message title="Activity not found" detail="This activity may no longer be available." />;
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.page}>
      <Stack.Screen options={{ title: activity.title }} />
      <Text style={styles.heading}>{activity.title}</Text>
      <Text style={styles.body}>{activity.course}</Text>
      <Text style={styles.body}>Due: {activity.dueDate}</Text>
      <Text style={styles.body}>Visibility: {activity.scope === "class" ? "Class" : "Personal - only you"}</Text>
      <Text style={styles.body}>{activity.notes || "No notes for this activity."}</Text>
      <Text style={styles.label}>Your status: {activity.completed ? "Completed" : "Not completed"}</Text>
      <ActionButton title="Update completion" onPress={() => router.push(`/activity/${activity.id}/completion`)} />
    </ScrollView>
  );
}
