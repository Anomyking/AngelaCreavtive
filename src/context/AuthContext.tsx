"use client";

import {
  createContext, useContext, useEffect, useState, ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { createBrowser } from "@/lib/supabase-browser";

interface AuthContextValue {
  user:     User | null;
  session:  Session | null;
  loading:  boolean;
  signUp:   (email: string, password: string, name: string, phone: string) => Promise<{ error: string | null }>;
  signIn:   (email: string, password: string) => Promise<{ error: string | null }>;
  signOut:  () => Promise<void>;
  updateProfile: (data: { name?: string; phone?: string; company?: string; address?: string }) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowser();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string, phone: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone },
        // emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) return { error: error.message };

    // Update profile with phone (trigger creates the row)
    const { data: { user: newUser } } = await supabase.auth.getUser();
    if (newUser) {
      await supabase.from("profiles").upsert({ id: newUser.id, name, phone });
    }
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (data: { name?: string; phone?: string; company?: string; address?: string }) => {
    if (!user) return { error: "Not logged in" };
    const { error } = await supabase.from("profiles").update(data).eq("id", user.id);
    if (error) return { error: error.message };
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

