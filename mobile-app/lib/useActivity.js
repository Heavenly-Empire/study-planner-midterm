import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useAuth } from "../context/AuthContext";

export function useActivity(id) {
  const { session, request } = useAuth();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useFocusEffect(useCallback(() => {
    let current = true;
    if (!session) return;
    setLoading(true);
    setError("");
    setActivity(null);
    request(`/activities/${id}`)
      .then(data => { if (current) setActivity(data); })
      .catch(err => { if (current) setError(err.message); })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [id, session, request, attempt]));

  return { activity, loading, error, retry: () => setAttempt(value => value + 1) };
}
