"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Mail, ArrowLeft, RefreshCw } from "lucide-react"
import { useAuth } from "../context/AuthContext"

interface OTPVerificationProps {
  onBack: () => void
  onSuccess: () => void
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ onBack, onSuccess }) => {
  const { state, verifyOTP, sendOTP } = useAuth()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [resendTimer, setResendTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }

    // Auto-verify when all digits are entered
    if (newOtp.every((digit) => digit !== "") && newOtp.join("").length === 6) {
      handleVerifyOTP(newOtp.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleVerifyOTP = async (otpCode: string) => {
    if (!state.pendingEmail) return

    setIsVerifying(true)
    setError("")

    const result = await verifyOTP(state.pendingEmail, otpCode)

    if (result.success) {
      onSuccess()
    } else {
      setError(result.error || "Invalid OTP. Please try again.")
      setOtp(["", "", "", "", "", ""])
    }

    setIsVerifying(false)
  }

  const handleResendOTP = async () => {
    if (!state.pendingEmail || !canResend) return

    const result = await sendOTP(state.pendingEmail)
    if (result.success) {
      setResendTimer(30)
      setCanResend(false)
      setError("")
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-sage-600 hover:text-sage-800 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </button>

      <div className="text-center mb-8">
        <div className="bg-sage-100 p-4 rounded-full inline-block mb-4">
          <Mail className="h-8 w-8 text-sage-600" />
        </div>
        <h2 className="text-2xl font-bold text-sage-800 mb-2">Verify Your Email</h2>
        <p className="text-sage-600">
          We've sent a 6-digit code to <br />
          <span className="font-medium">{state.pendingEmail}</span>
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center space-x-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-semibold border-2 border-sage-200 rounded-lg focus:border-sage-500 focus:ring-2 focus:ring-sage-200 focus:outline-none transition-colors"
              disabled={isVerifying}
            />
          ))}
        </div>

        {error && <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">{error}</div>}

        <div className="text-center">
          <p className="text-sage-600 text-sm mb-2">Didn't receive the code?</p>
          <button
            onClick={handleResendOTP}
            disabled={!canResend || isVerifying}
            className={`text-sm font-medium ${
              canResend && !isVerifying ? "text-sage-600 hover:text-sage-800" : "text-sage-400 cursor-not-allowed"
            } transition-colors flex items-center justify-center space-x-1`}
          >
            <RefreshCw className="h-4 w-4" />
            <span>{canResend ? "Resend Code" : `Resend in ${resendTimer}s`}</span>
          </button>
        </div>

        {isVerifying && (
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-sage-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sage-600"></div>
              <span>Verifying...</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-sage-50 rounded-lg">
        <p className="text-xs text-sage-600 text-center">
          <strong>Demo Mode:</strong> Check the browser console for the OTP code
        </p>
      </div>
    </div>
  )
}

export default OTPVerification
