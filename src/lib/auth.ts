import { supabase } from "./supabase";

// ============================
// Types
// ============================
interface UserMetadata {
  full_name?: string;
  avatar_url?: string;
}

interface Address {
  label?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

// ============================
// Sync user profile in 'users' table
// ============================
export async function syncUserProfile(user: any) {
  if (!user) return { success: false, message: "No user provided" };

  try {
    const { error } = await supabase.from("users").upsert(
      {
        id: user.id,
        email: user.email,
        name: (user.user_metadata as UserMetadata)?.full_name || null,
        avatar_url: (user.user_metadata as UserMetadata)?.avatar_url || null,
      },
      { onConflict: "id" }
    );

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("User sync failed:", err);
    return { success: false, message: err.message || "Failed to sync user" };
  }
}

// ============================
// Insert address into user_addresses table
// ============================
export async function addUserAddress(userId: string, address: Address) {
  try {
    const { error } = await supabase.from("user_addresses").insert([
      {
        user_id: userId,
        label: address.label || "Home",
        address_line1: address.address_line1 || null,
        address_line2: address.address_line2 || null,
        city: address.city || null,
        state: address.state || null,
        postal_code: address.postal_code || null,
        country: address.country || null,
      },
    ]);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("Add address failed:", err);
    return { success: false, message: err.message || "Failed to add address" };
  }
}

// ============================
// Google OAuth Sign In
// ============================
export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    console.error("Google sign-in failed:", err);
    return { success: false, message: err.message || "Google login failed" };
  }
}

// ============================
// Email + Password Sign Up
// ============================
export async function signUpWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    console.error("Email signup failed:", err);
    return { success: false, message: err.message || "Signup failed" };
  }
}

// ============================
// Email + Password Sign In
// ============================
export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    console.error("Email login failed:", err);
    return { success: false, message: err.message || "Login failed" };
  }
}

// ============================
// Email OTP (Magic Link) Sign In
// ============================
export async function signInWithOtp(email: string) {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    console.error("OTP login failed:", err);
    return { success: false, message: err.message || "OTP login failed" };
  }
}

// ============================
// Phone OTP Sign In (send OTP)
// ============================
export async function signInWithPhone(phone: string) {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    console.error("Phone OTP send failed:", err);
    return { success: false, message: err.message || "Phone OTP failed" };
  }
}

// ============================
// Phone OTP Verification
// ============================
export async function verifyPhoneOtp(phone: string, token: string) {
  try {
    const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: "sms" });
    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    console.error("Phone OTP verification failed:", err);
    return { success: false, message: err.message || "OTP verification failed" };
  }
}

// ============================
// Sign Out
// ============================
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("Sign out failed:", err);
    return { success: false, message: err.message || "Sign out failed" };
  }
}
