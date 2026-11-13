"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface User {
  _id: string;
  userId: string;
  name: string;
  email: string;
  role: "user" | "admin";
  phone?: string;
  address?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          const u = {
            ...data.user,
            _id: data.user._id || data.user.userId || "usr_1",
            userId: data.user.userId || data.user._id || "usr_1",
          };
          setUser(u);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const u = {
          ...data.user,
          _id: data.user._id || data.user.userId || "usr_1",
          userId: data.user.userId || data.user._id || "usr_1",
        };
        setUser(u);
        return { success: true, user: u };
      }
      return { success: false, error: data.error || "Login failed" };
    } catch (e: any) {
      return { success: false, error: e.message || "An error occurred" };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const u = {
          ...data.user,
          _id: data.user._id || data.user.userId || "usr_1",
          userId: data.user.userId || data.user._id || "usr_1",
        };
        setUser(u);
        return { success: true, user: u };
      }
      return { success: false, error: data.error || "Signup failed" };
    } catch (e: any) {
      return { success: false, error: e.message || "An error occurred" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        loading: isLoading,
        login,
        signup,
        logout,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
