import { API_URL } from "../config.js";

export async function apiRequest(path, { token, method = "GET", body } = {}) {
  if (!API_URL) throw new Error("Set EXPO_PUBLIC_API_URL in .env.local and restart Expo.");
  let response;
  try {
    response = await fetch(`${API_URL}/api${path}`, {
      method,
      headers: {
        ...(body !== undefined && { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...(body !== undefined && { body: JSON.stringify(body) }),
    });
  } catch {
    throw new Error("Cannot reach Study Planner. Check the API address and that the backend is running.");
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(data?.error || `Server responded with status ${response.status}.`);
    error.status = response.status;
    throw error;
  }
  if (data === null) throw new Error("The server did not return valid JSON.");
  return data;
}
