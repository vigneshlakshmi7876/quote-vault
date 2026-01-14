import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import * as authService from "@/services/auth.services";
import { AuthCredentials, AuthResponse } from "@/domain/auth";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (creds: AuthCredentials) => Promise<AuthResponse>;
  signUp: (creds: AuthCredentials) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Wrapper functions
  const signIn = async (creds: AuthCredentials) => authService.login(creds);
  const signUp = async (creds: AuthCredentials) => authService.signup(creds);
  const signOut = async () => { await authService.logout(); };
  const resetPassword = async (email: string) => authService.resetPassword(email);

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);