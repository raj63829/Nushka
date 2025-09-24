import { supabase } from "./supabase";

// ============================
// Sync user profile in 'users' table
// ============================
export async function syncUserProfile(user: any) {
  if (!user) return;

  const { error } = await supabase.from("users").upsert(
    {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || null,
      avatar_url: user.user_metadata?.avatar_url || null,
    },
    { onConflict: "id" }
  );

  if (error) console.error("User sync failed:", error);
}

// ============================
// Google OAuth Sign In
// ============================
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });
  if (error) throw error;
  return data;
}

// ============================
// Email + Password Sign Up
// ============================
export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
  return data;
}

// ============================
// Email + Password Sign In
// ============================
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

// ============================
// Email OTP (Magic Link) Sign In
// ============================
export async function signInWithOtp(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
  return data;
}

// ============================
// Phone OTP Sign In (send OTP)
// ============================
export async function signInWithPhone(phone: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`, // optional, for redirect after verification
    },
  });
  if (error) throw error;
  return data;
}

// ============================
// Phone OTP Verification
// ============================
export async function verifyPhoneOtp(phone: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms", // important for phone OTP
  });
  if (error) throw error;
  return data;
}

// ============================
// Sign Out
// ============================
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
