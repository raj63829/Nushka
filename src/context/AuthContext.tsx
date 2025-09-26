"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { User } from "../lib/supabase"

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  otpVerificationStep: "none" | "email-sent" | "verified"
  pendingEmail: string | null
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: User | null }
  | { type: "LOGOUT" }
  | { type: "SET_OTP_STEP"; payload: "none" | "email-sent" | "verified" }
  | { type: "SET_PENDING_EMAIL"; payload: string | null }

const AuthContext = createContext<
  | {
      state: AuthState
      login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
      register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>
      logout: () => Promise<void>
      updateProfile: (userData: Partial<User>) => Promise<{ success: boolean; error?: string }>
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
    case "LOGOUT":
      return {
        user: null,
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
        // Check if there's a logged-in user in localStorage
        const currentUser = localStorage.getItem("current-user")
        if (currentUser) {
          const user = JSON.parse(currentUser)
          dispatch({ type: "SET_USER", payload: user })
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    checkAuth()
  }, [])

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user already exists
      const existingProfiles = JSON.parse(localStorage.getItem("user-profiles") || "[]")
      const existingUser = existingProfiles.find((u: any) => u.email === userData.email)

      if (existingUser) {
        throw new Error("User already exists with this email")
      }

      // Create new user profile
      const newUser = {
        user_id: `user_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || "",
        addresses: [],
        created_at: new Date().toISOString(),
      }

      existingProfiles.push(newUser)
      localStorage.setItem("user-profiles", JSON.stringify(existingProfiles))

      // Set user as logged in
      dispatch({ type: "SET_USER", payload: newUser })

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

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Find user in localStorage
      const existingProfiles = JSON.parse(localStorage.getItem("user-profiles") || "[]")
      const user = existingProfiles.find((u: any) => u.email === email)

      if (!user) {
        throw new Error("No account found with this email")
      }

      // For demo purposes, accept any password
      // In real implementation, you'd verify the password hash
      dispatch({ type: "SET_USER", payload: user })

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const logout = async () => {
    try {
      dispatch({ type: "LOGOUT" })
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const updateProfile = async (userData: Partial<User>) => {
    try {
      if (!state.user) throw new Error("No user logged in")

      const existingProfiles = JSON.parse(localStorage.getItem("user-profiles") || "[]")
      const userIndex = existingProfiles.findIndex((u: any) => u.user_id === state.user?.user_id)

      if (userIndex === -1) throw new Error("User profile not found")

      existingProfiles[userIndex] = { ...existingProfiles[userIndex], ...userData }
      localStorage.setItem("user-profiles", JSON.stringify(existingProfiles))

      dispatch({ type: "SET_USER", payload: { ...state.user, ...userData } })
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const existingProfiles = JSON.parse(localStorage.getItem("user-profiles") || "[]")
      const user = existingProfiles.find((u: any) => u.email === email)

      if (!user) {
        throw new Error("No account found with this email")
      }

      // In real implementation, this would send a password reset email
      console.log(`[DEMO] Password reset email sent to ${email}`)

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const sendOTP = async (email: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      // Mock OTP sending - in real implementation, this would call Supabase
      // await supabase.auth.signInWithOtp({ email });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Store the email for verification
      dispatch({ type: "SET_PENDING_EMAIL", payload: email })
      dispatch({ type: "SET_OTP_STEP", payload: "email-sent" })

      // For demo purposes, show the OTP in console
      const mockOTP = Math.floor(100000 + Math.random() * 900000).toString()
      console.log(`[DEMO] OTP for ${email}: ${mockOTP}`)
      localStorage.setItem("demo-otp", mockOTP)
      localStorage.setItem("demo-otp-email", email)

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

      // Mock OTP verification
      const storedOTP = localStorage.getItem("demo-otp")
      const storedEmail = localStorage.getItem("demo-otp-email")

      if (storedOTP !== otp || storedEmail !== email) {
        throw new Error("Invalid OTP")
      }

      // Create or get user profile
      let userProfile = JSON.parse(localStorage.getItem("user-profiles") || "[]").find((u: any) => u.email === email)

      if (!userProfile) {
        userProfile = {
          user_id: `user_${Date.now()}`,
          email,
          name: email.split("@")[0],
          phone: "",
          addresses: [],
          created_at: new Date().toISOString(),
        }

        const profiles = JSON.parse(localStorage.getItem("user-profiles") || "[]")
        profiles.push(userProfile)
        localStorage.setItem("user-profiles", JSON.stringify(profiles))
      }

      dispatch({ type: "SET_USER", payload: userProfile })
      dispatch({ type: "SET_OTP_STEP", payload: "verified" })

      // Clean up OTP data
      localStorage.removeItem("demo-otp")
      localStorage.removeItem("demo-otp-email")

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
