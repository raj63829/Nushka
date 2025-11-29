"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { apiFetch } from "../lib/apiClient"; // We'll create this helper below

interface User {
  email: string;
  id?: number;
  name?: string;
}

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
  sendOTP: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyOTP: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
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

  // Check existing JWT on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const res = await apiFetch("/protected/", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res?.user) {
            dispatch({ type: "SET_USER", payload: res.user });
          } else {
            dispatch({ type: "LOGOUT" });
          }
        } catch {
          dispatch({ type: "LOGOUT" });
        }
      } else {
        dispatch({ type: "LOGOUT" });
      }
    };

    checkAuth();
  }, []);

  // Send OTP
  const sendOTP = async (email: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const res = await apiFetch("/send-otp/", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (res.success) {
        dispatch({ type: "SET_PENDING_EMAIL", payload: email });
        dispatch({ type: "SET_OTP_STEP", payload: "email-sent" });
        return { success: true };
      } else {
        throw new Error(res.error || "Failed to send OTP");
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Verify OTP (Login)
  const verifyOTP = async (email: string, otp: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const res = await apiFetch("/login/", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });

      if (res.tokens) {
        // Save tokens from Django
        localStorage.setItem("accessToken", res.tokens.access);
        localStorage.setItem("refreshToken", res.tokens.refresh);

        dispatch({
          type: "SET_USER",
          payload: { email: res.user.email, id: res.user.id },
        });
        dispatch({ type: "SET_OTP_STEP", payload: "verified" });

        return { success: true };
      } else {
        throw new Error(res.error || "Invalid OTP");
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const logout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ state, sendOTP, verifyOTP, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
