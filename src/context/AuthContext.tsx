"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { User } from "@supabase/supabase-js"
import { 
  signInWithOtp, 
  signOut, 
  getCurrentSession,
  createUserProfile,
  getUserProfile,
  updateUserProfile
} from "../lib/auth"
import { supabase } from "../lib/supabase"

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

const AuthContext = createContext<
  | {
      state: AuthState
      loginWithEmailOtp: (email: string) => Promise<{ success: boolean; error?: string }>
      logout: () => Promise<void>
      updateProfile: (userData: { name?: string; phone?: string }) => Promise<{ success: boolean; error?: string }>
    }
  | undefined
>(undefined)

interface RegisterData {}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      }
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

const initialState: AuthState = {
  user: null,
  userProfile: null,
  isLoading: true,
  isAuthenticated: false,
  otpVerificationStep: "none",
  pendingEmail: null,
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current session from Supabase
        const session = await getCurrentSession()
        if (session?.user) {
          dispatch({ type: "SET_USER", payload: session.user })
          
          // Try to get user profile from database
          try {
            const profile = await getUserProfile(session.user.id)
            dispatch({ type: "SET_USER_PROFILE", payload: profile })
          } catch (error) {
            // If profile doesn't exist, create one
            if (session.user.email) {
              const profile = await createUserProfile(session.user.id, {
                name: session.user.user_metadata?.name || session.user.email.split('@')[0],
                email: session.user.email,
                phone: session.user.user_metadata?.phone || ''
              })
              dispatch({ type: "SET_USER_PROFILE", payload: profile })
            }
          }
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        dispatch({ type: "SET_USER", payload: session.user })
        
        // Get or create user profile
        try {
          const profile = await getUserProfile(session.user.id)
          dispatch({ type: "SET_USER_PROFILE", payload: profile })
        } catch (error) {
          if (session.user.email) {
            const profile = await createUserProfile(session.user.id, {
              name: session.user.user_metadata?.name || session.user.email.split('@')[0],
              email: session.user.email,
              phone: session.user.user_metadata?.phone || ''
            })
            dispatch({ type: "SET_USER_PROFILE", payload: profile })
          }
        }
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: "LOGOUT" })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loginWithEmailOtp = async (email: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      await signInWithOtp(email)
      dispatch({ type: "SET_PENDING_EMAIL", payload: email })
      dispatch({ type: "SET_OTP_STEP", payload: "email-sent" })
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const logout = async () => {
    try {
      await signOut()
      dispatch({ type: "LOGOUT" })
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const updateProfile = async (userData: { name?: string; phone?: string }) => {
    try {
      if (!state.user) throw new Error("No user logged in")

      // Update profile in Supabase database
      const updatedProfile = await updateUserProfile(state.user.id, userData)
      
      dispatch({ type: "SET_USER_PROFILE", payload: updatedProfile })
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // OTP verification is handled by magic link redirect; no manual verify here

  return (
    <AuthContext.Provider
      value={{
        state,
        loginWithEmailOtp,
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
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
