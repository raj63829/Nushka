"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  otpVerificationStep: "none" | "email-sent" | "verified";
  pendingEmail: string | null;
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: User | null }
  | { type: "LOGOUT" }
  | { type: "SET_OTP_STEP"; payload: "none" | "email-sent" | "verified" }
  | { type: "SET_PENDING_EMAIL"; payload: string | null };

interface AuthContextProps {
  state: AuthState;
  loginWithEmailOtp: (email: string) => Promise<{ success: boolean; error?: string }>;
  sendOTP: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  otpVerificationStep: "none",
  pendingEmail: null,
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_USER":
      return { ...state, user: action.payload, isAuthenticated: !!action.payload, isLoading: false };
    case "LOGOUT":
      return { ...initialState, isLoading: false };
    case "SET_OTP_STEP":
      return { ...state, otpVerificationStep: action.payload };
    case "SET_PENDING_EMAIL":
      return { ...state, pendingEmail: action.payload };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) console.error("Supabase getSession error:", error);
      if (session?.user) dispatch({ type: "SET_USER", payload: session.user });
      dispatch({ type: "SET_LOADING", payload: false });
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) dispatch({ type: "SET_USER", payload: session.user });
      else dispatch({ type: "LOGOUT" });
    });

    return () => subscription.unsubscribe();
  }, []);

  // Send OTP via Netlify
  const sendOTP = async (email: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const res = await fetch("/.netlify/functions/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to send OTP");

      dispatch({ type: "SET_PENDING_EMAIL", payload: email });
      dispatch({ type: "SET_OTP_STEP", payload: "email-sent" });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const loginWithEmailOtp = async (email: string) => {
    return sendOTP(email);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ state, loginWithEmailOtp, sendOTP, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
