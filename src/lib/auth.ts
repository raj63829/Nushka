import { supabase } from "./supabase";

// Sign Up with Email + Password
export async function signUpWithEmail(email: string, password: string, userData?: { name?: string; phone?: string }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth-callback`,
      data: userData
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

// Sign In with Gmail OAuth
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth-callback`,
    },
  });
  if (error) throw error;
  return data;
}

// Sign In with Email OTP (Magic Link)
export async function signInWithOtp(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth-callback`,
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

// Get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

// Get current session
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

// Create user profile in database
export async function createUserProfile(userId: string, userData: { name?: string; email: string; phone?: string }) {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([
      {
        user_id: userId,
        name: userData.name || userData.email.split('@')[0],
        email: userData.email,
        phone: userData.phone || '',
        created_at: new Date().toISOString()
      }
    ])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Get user profile from database
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data;
}

// Update user profile
export async function updateUserProfile(userId: string, updates: { name?: string; phone?: string }) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
