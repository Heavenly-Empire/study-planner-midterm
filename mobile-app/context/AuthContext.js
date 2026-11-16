import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { apiRequest } from "../lib/api";

const AuthContext = createContext(null);
const tokenKey = "study-planner.student-token";
const storesToken = Platform.OS !== "web";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState("restoring");
  const currentSession = useRef(null);
  const checkingSession = useRef(false);

  const updateSession = useCallback(nextSession => {
    currentSession.current = nextSession;
    setSession(nextSession);
  }, []);

  const restoreSession = useCallback(async () => {
    if (checkingSession.current) return;
    checkingSession.current = true;
    setStatus("restoring");
    try {
      const token = storesToken ? await SecureStore.getItemAsync(tokenKey) : null;
      if (token) {
        const user = await apiRequest("/auth/me", { token }).catch(error => {
          if (error.status === 401) return null;
          throw error;
        });
        if (user?.role === "client") updateSession({ token, user });
        else await SecureStore.deleteItemAsync(tokenKey);
      }
      setStatus("ready");
    } catch {
      setStatus("restore-error");
    } finally {
      checkingSession.current = false;
    }
  }, [updateSession]);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  async function signIn(username, password) {
    const data = await apiRequest("/auth/login", {
      method: "POST", body: { username: username.trim(), password },
    });
    if (data.user.role !== "client") {
      throw new Error("This mobile app is for students. Lecturers use the web app.");
    }
    if (storesToken) await SecureStore.setItemAsync(tokenKey, data.token);
    updateSession(data);
  }

  const signOut = useCallback(async () => {
    if (checkingSession.current) return;
    checkingSession.current = true;
    updateSession(null);
    setStatus("signing-out");
    try {
      if (storesToken) await SecureStore.deleteItemAsync(tokenKey);
      setStatus("ready");
    } catch {
      setStatus("sign-out-error");
    } finally {
      checkingSession.current = false;
    }
  }, [updateSession]);

  const request = useCallback(async (path, options = {}) => {
    try {
      return await apiRequest(path, { ...options, token: session?.token });
    } catch (error) {
      // A late response from a previous session must leave the current login alone.
      if (error.status === 401 && session && currentSession.current === session) {
        await signOut();
      }
      throw error;
    }
  }, [session, signOut]);

  return (
    <AuthContext.Provider value={{ session, status, signIn, signOut, restoreSession, request }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
