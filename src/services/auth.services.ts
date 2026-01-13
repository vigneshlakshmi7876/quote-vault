import { supabase } from "@/lib/supabase";
import { AuthCredentials, AuthResponse } from "@/domain/auth";
import { isValidEmail } from "@/utils";

export const login = async ({ email, password }: AuthCredentials): Promise<AuthResponse> => {
  if (!isValidEmail(email)) return { user: null, session: null, error: "Invalid email format" };
  if (!password) return { user: null, session: null, error: "Password is required" };

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { user: data.user, session: data.session, error: error?.message || null };
};

export const signup = async ({ email, password }: AuthCredentials): Promise<AuthResponse> => {
  if (!isValidEmail(email)) return { user: null, session: null, error: "Invalid email format" };
  if (password.length < 6) return { user: null, session: null, error: "Password must be at least 6 characters" };

  const { data, error } = await supabase.auth.signUp({ email, password });
  return { user: data.user, session: data.session, error: error?.message || null };
};

export const resetPassword = async (email: string) => {
  if (!isValidEmail(email)) return { error: "Invalid email format" };
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "exp://127.0.0.1:19000", // Adjust for production later
  });
  return { error: error?.message || null };
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  return { error: error?.message || null };
};