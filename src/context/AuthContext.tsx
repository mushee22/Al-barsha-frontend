import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { apiFetch } from "../utils/api";

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("albarsha_auth") === "true";
  });

  useEffect(() => {
    // Initial check is now handled in useState initializer
  }, []);

  const login = useCallback(async (email: string, pass: string) => {
    try {
      // Connects to the provided backend
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password: pass }),
      });
      
      setIsAuthenticated(true);
      localStorage.setItem("albarsha_auth", "true");
      if (data.token || data.access_token) {
        localStorage.setItem("albarsha_auth_token", data.token || data.access_token);
      }
      return true;
    } catch (err: any) {
      console.error("Login failed:", err);
      throw err; // Let the LoginPage handle the error display
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      setIsAuthenticated(false);
      localStorage.removeItem("albarsha_auth");
      localStorage.removeItem("albarsha_auth_token");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
