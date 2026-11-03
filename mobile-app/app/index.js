import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { Redirect, router, useFocusEffect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { ActionButton, Message, styles } from "../components/ui";

export default function ActivityListScreen() {
  const { session, request, signOut } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useFocusEffect(useCallback(() => {
    let current = true;
    if (!session) return;
    setLoading(true);
    setError("");
    request("/activities")
      .then(data => { if (current) setActivities(data); })
      .catch(err => { if (current) setError(err.message); })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [session, request, attempt]));

  async function refresh() {
    setRefreshing(true);
    setError("");
    try { setActivities(await request("/activities")); }
    catch (err) { setError(err.message); }
    finally { setRefreshing(false); }
  }

  if (!session) return <Redirect href="/login" />;
  const header = (
    <View style={styles.listHeader}>
      <Text style={styles.heading}>Hello, {session.user.name}</Text>
      <Text style={styles.body}>Class activities and your private study tasks.</Text>
      <ActionButton title="Sign out" onPress={signOut} />
    </View>
  );
  return (
    <View style={styles.screen}>
      {loading ? <>{header}<ActivityIndicator size="large" accessibilityLabel="Loading activities" /></> :
        error ? <>{header}<Message title="Could not load activities" detail={error} retry={() => setAttempt(value => value + 1)} /></> :
        <FlatList data={activities} keyExtractor={item => String(item.id)}
          ListHeaderComponent={header}
          renderItem={({ item }) => (
            <Pressable accessibilityRole="button" onPress={() => router.push(`/activity/${item.id}`)}
              style={({ pressed }) => [styles.card, pressed && styles.dim]}>
              <Text style={styles.label}>{item.title}</Text>
              <Text style={styles.body}>{item.course}</Text>
              <Text style={styles.muted}>Due {item.dueDate} - {item.scope === "class" ? "Class" : "Personal"}</Text>
              <Text style={styles.body}>{item.completed ? "Completed" : "Not completed"}</Text>
            </Pressable>
          )}
          ListEmptyComponent={<Message title="No activities yet" detail="Your visible class and personal activities will appear here." />}
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshing={refreshing} onRefresh={refresh} />}
    </View>
  );
}
