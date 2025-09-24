import { supabase } from "./supabase";
import { supabase } from "./supabase";


export async function syncUserProfile(user: any) {
  if (!user) return;

  const { error } = await supabase.from("users").upsert(
    {
      id: user.id,
      email: user.email,
      name: user.user_metadata.full_name,
      avatar_url: user.user_metadata.avatar_url,
    },
    { onConflict: "id" }
  );

  if (error) console.error("User sync failed:", error);
}



export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });
  if (error) throw error;
  return data;
}


// Sign Up with Email + Password + OTP
export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`, // where user will be redirected after verification
    },
  });
  if (error) throw error;
  return data;
}

// Sign In with Email + Password
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

// Sign In with Email OTP (Magic Link)
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

// Sign Out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
