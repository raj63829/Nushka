"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { User } from "@supabase/supabase-js"
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithGoogle, 
  signInWithOtp, 
  signOut, 
  getCurrentUser, 
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
      login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
      register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>
      loginWithGoogle: () => Promise<{ success: boolean; error?: string }>
      logout: () => Promise<void>
      updateProfile: (userData: { name?: string; phone?: string }) => Promise<{ success: boolean; error?: string }>
      resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
      sendOTP: (email: string) => Promise<{ success: boolean; error?: string }>
      verifyOTP: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>
      loginWithOTP: (email: string) => Promise<{ success: boolean; error?: string }>
    }
  | undefined
>(undefined)

interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
}

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

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      // Sign up with Supabase
      const { user } = await signUpWithEmail(userData.email, userData.password, {
        name: userData.name,
        phone: userData.phone
      })

      if (user) {
        // Create user profile in database
        const profile = await createUserProfile(user.id, {
          name: userData.name,
          email: userData.email,
          phone: userData.phone
        })

        dispatch({ type: "SET_USER", payload: user })
        dispatch({ type: "SET_USER_PROFILE", payload: profile })
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      // Sign in with Supabase
      const { user } = await signInWithEmail(email, password)

      if (user) {
        // Get user profile from database
        const profile = await getUserProfile(user.id)
        
        dispatch({ type: "SET_USER", payload: user })
        dispatch({ type: "SET_USER_PROFILE", payload: profile })
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const loginWithGoogle = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      // Sign in with Google OAuth
      await signInWithGoogle()

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

  const resetPassword = async (email: string) => {
    try {
      // Use Supabase password reset
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const sendOTP = async (email: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      // Send OTP using Supabase
      await signInWithOtp(email)

      // Store the email for verification
      dispatch({ type: "SET_PENDING_EMAIL", payload: email })
      dispatch({ type: "SET_OTP_STEP", payload: "email-sent" })

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const verifyOTP = async (email: string, otp: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      // Verify OTP with Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      })

      if (error) throw error

      if (data.user) {
        // Get or create user profile
        try {
          const profile = await getUserProfile(data.user.id)
          dispatch({ type: "SET_USER_PROFILE", payload: profile })
        } catch (error) {
          if (data.user.email) {
            const profile = await createUserProfile(data.user.id, {
              name: data.user.user_metadata?.name || data.user.email.split('@')[0],
              email: data.user.email,
              phone: data.user.user_metadata?.phone || ''
            })
            dispatch({ type: "SET_USER_PROFILE", payload: profile })
          }
        }

        dispatch({ type: "SET_USER", payload: data.user })
        dispatch({ type: "SET_OTP_STEP", payload: "verified" })
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const loginWithOTP = async (email: string) => {
    return await sendOTP(email)
  }

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        register,
        loginWithGoogle,
        logout,
        updateProfile,
        resetPassword,
        sendOTP,
        verifyOTP,
        loginWithOTP,
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
