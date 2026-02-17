import React, { createContext, useContext, useState, ReactNode } from "react";
import type { User } from "@/data/mockData";
import { studentUser, adminUser } from "@/data/mockData";

interface AuthContextType {
  user: User | null;
  role: "student" | "admin";
  login: (role: "student" | "admin") => void;
  logout: () => void;
  toggleRole: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: "student",
  login: () => {},
  logout: () => {},
  toggleRole: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"student" | "admin">("student");

  const login = (r: "student" | "admin") => {
    setRole(r);
    setUser(r === "admin" ? adminUser : studentUser);
  };

  const logout = () => {
    setUser(null);
  };

  const toggleRole = () => {
    const newRole = role === "student" ? "admin" : "student";
    setRole(newRole);
    setUser(newRole === "admin" ? adminUser : studentUser);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, toggleRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
