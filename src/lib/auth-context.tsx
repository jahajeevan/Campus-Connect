"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getRepository } from "@/lib/data";
import type { StaffUser } from "@/lib/types";

interface AuthContextValue {
  user: StaffUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<StaffUser>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const current = await getRepository().getCurrentUser();
    setUser(current);
  }, []);

  useEffect(() => {
    let active = true;
    getRepository()
      .getCurrentUser()
      .then((current) => {
        if (active) setUser(current);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const signedIn = await getRepository().signIn(email, password);
    setUser(signedIn);
    return signedIn;
  }, []);

  const signOut = useCallback(async () => {
    await getRepository().signOut();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, signIn, signOut, refresh }),
    [user, loading, signIn, signOut, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
