"use client"

import type React from "react"
import { useState } from "react"
import { X, Mail, Smartphone } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import OTPVerification from "./OTPVerification"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: "otp"
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<"otp" | "otp-verify">("otp")
  const [formData, setFormData] = useState({
    email: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const { loginWithEmailOtp, state } = useAuth()

  if (!isOpen) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const result = await loginWithEmailOtp(formData.email)
      if (result.success) {
        setMode("otp-verify")
        setIsLoading(false)
        return
      }

      if (!result?.success) {
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
      email: "",
    })
    setErrors({})
  }

  const handleOTPSuccess = () => {
    onClose()
    resetForm()
  }

  const handleOTPBack = () => {
    setMode("otp")
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
        <div className="flex items-center justify-between p-6 border-b border-sage-100">
          <h2 className="text-2xl font-bold text-sage-800">Sign In with OTP</h2>
          <button onClick={onClose} className="p-1 hover:bg-sage-50 rounded-full transition-colors">
            <X className="h-5 w-5 text-sage-600" />
          </button>
        </div>

        <div className="px-6 pt-4">
          <div className="flex bg-sage-50 rounded-lg p-1">
            <button
              onClick={() => setMode("otp")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors bg-white text-sage-800 shadow-sm`}
            >
              <Smartphone className="h-4 w-4 inline mr-1" />
              OTP
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {errors.general}
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
              placeholder="Enter email to receive OTP"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="bg-sage-50 p-4 rounded-md">
            <p className="text-sm text-sage-700">
              We'll send a magic link to your email. Click the link to sign in.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-sage-600 text-white py-3 rounded-md font-medium hover:bg-sage-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending OTP...</span>
              </div>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AuthModal
