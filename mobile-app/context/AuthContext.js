import { createContext, useCallback, useContext, useState } from "react";
import { apiRequest } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // A restart requires login again. Tokens are never stored in public configuration.
  const [session, setSession] = useState(null);
  const token = session?.token;

  async function signIn(username, password) {
    const data = await apiRequest("/auth/login", {
      method: "POST", body: { username: username.trim(), password },
    });
    if (data.user.role !== "client") {
      throw new Error("This mobile app is for students. Lecturers use the web app.");
    }
    setSession(data);
  }

  const request = useCallback(async (path, options = {}) => {
    try {
      return await apiRequest(path, { ...options, token });
    } catch (error) {
      if (error.status === 401) {
        // A late response from an old account must not clear a newer login.
        setSession(current => current?.token === token ? null : current);
      }
      throw error;
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ session, signIn, signOut: () => setSession(null), request }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
