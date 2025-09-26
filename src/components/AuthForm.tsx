"use client"

import type React from "react"
import { useState } from "react"
import { X, Mail, Lock, User, Eye, EyeOff, Smartphone } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import OTPVerification from "./OTPVerification"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: "signin" | "register" | "otp"
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = "signin" }) => {
  const [mode, setMode] = useState<"signin" | "register" | "otp" | "otp-verify">(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const { login, register, loginWithOTP, loginWithGoogle, state } = useAuth()

  if (!isOpen) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (mode === "signin" || mode === "register") {
      if (!formData.password) {
        newErrors.password = "Password is required"
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters"
      }
    }

    if (mode === "register") {
      if (!formData.firstName) {
        newErrors.firstName = "First name is required"
      }
      if (!formData.lastName) {
        newErrors.lastName = "Last name is required"
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      let result

      if (mode === "register") {
        result = await register({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
        })
      } else if (mode === "signin") {
        result = await login(formData.email, formData.password)
      } else if (mode === "otp") {
        result = await loginWithOTP(formData.email)
        if (result.success) {
          setMode("otp-verify")
          setIsLoading(false)
          return
        }
      }

      if (result?.success) {
        onClose()
        resetForm()
      } else {
        setErrors({ general: result?.error || "An error occurred" })
      }
    } catch (error) {
      setErrors({ general: "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
    setErrors({})
  }

  const switchMode = (newMode: "signin" | "register" | "otp") => {
    setMode(newMode)
    setErrors({})
    resetForm()
  }

  const handleOTPSuccess = () => {
    onClose()
    resetForm()
  }

  const handleOTPBack = () => {
    setMode("otp")
  }

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      const result = await loginWithGoogle()
      
      if (result?.success) {
        onClose()
        resetForm()
      } else {
        setErrors({ general: result?.error || "Google login failed" })
      }
    } catch (error) {
      setErrors({ general: "Google login failed" })
    } finally {
      setIsLoading(false)
    }
  }

  if (mode === "otp-verify") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md relative p-6">
          <OTPVerification onBack={handleOTPBack} onSuccess={handleOTPSuccess} />
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sage-100">
          <h2 className="text-2xl font-bold text-sage-800">
            {mode === "signin" ? "Welcome Back" : mode === "register" ? "Create Account" : "Sign In with OTP"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-sage-50 rounded-full transition-colors">
            <X className="h-5 w-5 text-sage-600" />
          </button>
        </div>

        {(mode === "signin" || mode === "otp") && (
          <div className="px-6 pt-4">
            <div className="flex bg-sage-50 rounded-lg p-1">
              <button
                onClick={() => switchMode("signin")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  mode === "signin" ? "bg-white text-sage-800 shadow-sm" : "text-sage-600 hover:text-sage-800"
                }`}
              >
                <Lock className="h-4 w-4 inline mr-1" />
                Password
              </button>
              <button
                onClick={() => switchMode("otp")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  mode === "otp" ? "bg-white text-sage-800 shadow-sm" : "text-sage-600 hover:text-sage-800"
                }`}
              >
                <Smartphone className="h-4 w-4 inline mr-1" />
                OTP
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {errors.general}
            </div>
          )}

          {mode === "register" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors ${
                    errors.firstName ? "border-red-300" : "border-sage-200"
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors ${
                    errors.lastName ? "border-red-300" : "border-sage-200"
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-sage-700 mb-2">
              <Mail className="h-4 w-4 inline mr-1" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors ${
                errors.email ? "border-red-300" : "border-sage-200"
              }`}
              placeholder={mode === "otp" ? "Enter email to receive OTP" : "Enter your email"}
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          {(mode === "signin" || mode === "register") && (
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                <Lock className="h-4 w-4 inline mr-1" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors pr-10 ${
                    errors.password ? "border-red-300" : "border-sage-200"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sage-400 hover:text-sage-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
            </div>
          )}

          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                <Lock className="h-4 w-4 inline mr-1" />
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors ${
                  errors.confirmPassword ? "border-red-300" : "border-sage-200"
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          )}

          {mode === "signin" && (
            <div className="text-right">
              <button type="button" className="text-sm text-sage-600 hover:text-sage-800 transition-colors">
                Forgot Password?
              </button>
            </div>
          )}

          {mode === "otp" && (
            <div className="bg-sage-50 p-4 rounded-md">
              <p className="text-sm text-sage-700">
                We'll send a 6-digit verification code to your email address. No password required!
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-sage-600 text-white py-3 rounded-md font-medium hover:bg-sage-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>
                  {mode === "signin" ? "Signing In..." : mode === "register" ? "Creating Account..." : "Sending OTP..."}
                </span>
              </div>
            ) : mode === "signin" ? (
              "Sign In"
            ) : mode === "register" ? (
              "Create Account"
            ) : (
              "Send OTP"
            )}
          </button>

          {/* Google Sign In Button */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-sage-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-sage-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-sage-200 rounded-md shadow-sm bg-white text-sm font-medium text-sage-700 hover:bg-sage-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </form>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          {mode !== "register" && (
            <p className="text-sage-600 mb-2">
              Don't have an account?{" "}
              <button onClick={() => switchMode("register")} className="text-sage-800 font-medium hover:underline">
                Sign Up
              </button>
            </p>
          )}
          {mode === "register" && (
            <p className="text-sage-600 mb-2">
              Already have an account?{" "}
              <button onClick={() => switchMode("signin")} className="text-sage-800 font-medium hover:underline">
                Sign In
              </button>
            </p>
          )}
        </div>

        {mode === "register" && (
          <div className="px-6 pb-6">
            <p className="text-xs text-sage-500 text-center">
              By creating an account, you agree to our{" "}
              <a href="#" className="underline hover:text-sage-700">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-sage-700">
                Privacy Policy
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthModal
