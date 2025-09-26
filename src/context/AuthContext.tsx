"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"
import {
  getCurrentSession,
  createUserProfile,
  getUserProfile,
  updateUserProfile,
} from "../lib/auth"

interface AuthState {
  user: User | null
  userProfile: any | null
  isLoading: boolean
  isAuthenticated: boolean
  otpVerificationStep: "none" | "email-sent" | "verified"
  pendingEmail: string | null
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_USER_PROFILE"; payload: any | null }
  | { type: "LOGOUT" }
  | { type: "SET_OTP_STEP"; payload: "none" | "email-sent" | "verified" }
  | { type: "SET_PENDING_EMAIL"; payload: string | null }

interface AuthContextProps {
  state: AuthState
  loginWithEmailOtp: (email: string) => Promise<{ success: boolean; error?: string }>
  verifyOTP: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>
  sendOTP: (email: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateProfile: (userData: { name?: string; phone?: string }) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

const initialState: AuthState = {
  user: null,
  userProfile: null,
  isLoading: true,
  isAuthenticated: false,
  otpVerificationStep: "none",
  pendingEmail: null,
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_USER":
      return { ...state, user: action.payload, isAuthenticated: !!action.payload, isLoading: false }
    case "SET_USER_PROFILE":
      return { ...state, userProfile: action.payload }
    case "LOGOUT":
      return {
        user: null,
        userProfile: null,
        isAuthenticated: false,
        isLoading: false,
        otpVerificationStep: "none",
        pendingEmail: null,
      }
    case "SET_OTP_STEP":
      return { ...state, otpVerificationStep: action.payload }
    case "SET_PENDING_EMAIL":
      return { ...state, pendingEmail: action.payload }
    default:
      return state
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  /** Check auth and load session/profile */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await getCurrentSession()
        if (session?.user) {
          dispatch({ type: "SET_USER", payload: session.user })
          try {
            const profile = await getUserProfile(session.user.id)
            dispatch({ type: "SET_USER_PROFILE", payload: profile })
          } catch {
            if (session.user.email) {
              const profile = await createUserProfile(session.user.id, {
                name: session.user.user_metadata?.name || session.user.email.split("@")[0],
                email: session.user.email,
                phone: session.user.user_metadata?.phone || "",
              })
              dispatch({ type: "SET_USER_PROFILE", payload: profile })
            }
          }
        }
      } catch (err) {
        console.error("Auth check error:", err)
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        dispatch({ type: "SET_USER", payload: session.user })
        try {
          const profile = await getUserProfile(session.user.id)
          dispatch({ type: "SET_USER_PROFILE", payload: profile })
        } catch {
          if (session.user.email) {
            const profile = await createUserProfile(session.user.id, {
              name: session.user.user_metadata?.name || session.user.email.split("@")[0],
              email: session.user.email,
              phone: session.user.user_metadata?.phone || "",
            })
            dispatch({ type: "SET_USER_PROFILE", payload: profile })
          }
        }
      } else if (event === "SIGNED_OUT") {
        dispatch({ type: "LOGOUT" })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  /** Send OTP via Netlify proxy */
  const sendOTP = async (email: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const res = await fetch("/.netlify/functions/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to send OTP")

      dispatch({ type: "SET_PENDING_EMAIL", payload: email })
      dispatch({ type: "SET_OTP_STEP", payload: "email-sent" })

      return { success: true }
    } catch (err: any) {
      console.error("sendOTP error:", err)
      return { success: false, error: err.message }
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  /** Verify OTP via Netlify proxy */
  const verifyOTP = async (email: string, otpCode: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const res = await fetch("/.netlify/functions/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || "OTP verification failed")

      const session = await getCurrentSession()
      if (session?.user) dispatch({ type: "SET_USER", payload: session.user })

      dispatch({ type: "SET_OTP_STEP", payload: "verified" })

      return { success: true }
    } catch (err: any) {
      console.error("verifyOTP error:", err)
      return { success: false, error: err.message }
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  /** Login (send OTP) */
  const loginWithEmailOtp = async (email: string) => sendOTP(email)

  /** Logout */
  const logout = async () => {
    try {
      await supabase.auth.signOut()
      dispatch({ type: "LOGOUT" })
    } catch (err) {
      console.error("Logout error:", err)
    }
  }

  /** Update user profile */
  const updateProfile = async (userData: { name?: string; phone?: string }) => {
    try {
      if (!state.user) throw new Error("No user logged in")
      const updatedProfile = await updateUserProfile(state.user.id, userData)
      dispatch({ type: "SET_USER_PROFILE", payload: updatedProfile })
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        state,
        loginWithEmailOtp,
        sendOTP,
        verifyOTP,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
