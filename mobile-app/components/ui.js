import { Pressable, StyleSheet, Text, View } from "react-native";

export function ActionButton({ title, onPress, disabled = false }) {
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}
      style={({ pressed }) => [styles.button, (pressed || disabled) && styles.dim]}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

export function Message({ title, detail, retry }) {
  return (
    <View style={styles.center}>
      <Text style={styles.heading}>{title}</Text>
      {detail ? <Text style={styles.body}>{detail}</Text> : null}
      {retry ? <ActionButton title="Try again" onPress={retry} /> : null}
    </View>
  );
}

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f8fafc" },
  page: { padding: 20, gap: 16, paddingBottom: 40 },
  center: { flex: 1, padding: 24, gap: 16, alignItems: "center", justifyContent: "center" },
  heading: { fontSize: 23, fontWeight: "700", color: "#0f172a" },
  body: { fontSize: 16, lineHeight: 24, color: "#334155" },
  muted: { fontSize: 14, color: "#64748b" },
  label: { fontSize: 15, fontWeight: "600", color: "#334155" },
  input: { backgroundColor: "#fff", borderColor: "#94a3b8", borderWidth: 1, padding: 13, borderRadius: 10, fontSize: 16 },
  button: { backgroundColor: "#0f766e", paddingVertical: 13, paddingHorizontal: 18, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  dim: { opacity: 0.6 },
  error: { color: "#b91c1c", fontSize: 15, lineHeight: 22 },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 18, marginHorizontal: 16, marginBottom: 12, gap: 6, borderWidth: 1, borderColor: "#e2e8f0" },
  listHeader: { padding: 20, gap: 12 },
});
