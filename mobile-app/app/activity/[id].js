import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { Redirect, Stack, router, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useActivity } from "../../lib/useActivity";
import { ActionButton, ActionFooter, Message, styles } from "../../components/ui";

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams();
  const { session } = useAuth();
  const { activity, loading, error, retry } = useActivity(id);
  if (!session) return <Redirect href="/login" />;
  if (loading) return <ActivityIndicator size="large" accessibilityLabel="Loading activity" />;
  if (error) return <Message title="Could not load activity" detail={error} retry={retry} />;
  if (!activity) return <Message title="Activity not found" detail="This activity may no longer be available." />;
  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: activity.title }} />
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.heading}>{activity.title}</Text>
        <Text style={styles.body}>{activity.course}</Text>
        <Text style={styles.body}>Due {activity.dueDate}</Text>
        <Text style={styles.body}>{activity.scope === "class" ? "Class activity" : "Personal activity"}</Text>
        <Text style={styles.body}>{activity.notes || "No notes for this activity."}</Text>
      </ScrollView>
      <ActionFooter>
        <Text style={styles.label}>Your status: {activity.completed ? "Completed" : "Not completed"}</Text>
        <ActionButton title="Update completion" onPress={() => router.push(`/activity/${activity.id}/completion`)} />
      </ActionFooter>
    </View>
  );
}
