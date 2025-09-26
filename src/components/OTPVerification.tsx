"use client"

import { useState, useEffect } from "react"
import { Mail, ArrowLeft, RefreshCw } from "lucide-react"
import { useAuth } from "../context/AuthContext"

interface OTPVerificationProps {
  onBack: () => void
  onSuccess: () => void
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ onBack, onSuccess }) => {
  const { state, verifyOTP, sendOTP } = useAuth()
  const [otp, setOtp] = useState(Array(6).fill(""))
  const [error, setError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [resendTimer, setResendTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)

  // Countdown for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return // allow only single digit
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }

    // Auto-verify when all digits are entered
    if (newOtp.every((digit) => digit !== "")) {
      handleVerifyOTP(newOtp.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  // Verify OTP via Netlify proxy
  const handleVerifyOTP = async (otpCode: string) => {
    if (!state.pendingEmail) return
    setIsProcessing(true)
    setError("")

    try {
      const result = await verifyOTP(state.pendingEmail, otpCode)
      if (result.success) {
        onSuccess()
      } else {
        setError(result.error || "Invalid OTP. Please try again.")
        setOtp(Array(6).fill(""))
      }
    } catch (err: any) {
      setError(err.message || "OTP verification failed")
      setOtp(Array(6).fill(""))
    } finally {
      setIsProcessing(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    if (!state.pendingEmail || !canResend) return
    setIsProcessing(true)
    setError("")

    try {
      const result = await sendOTP(state.pendingEmail)
      if (result.success) {
        setResendTimer(30)
        setCanResend(false)
      } else {
        setError(result.error || "Failed to resend OTP. Try again.")
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP. Try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow rounded-lg">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-sage-600 hover:text-sage-800 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </button>

      {/* Header */}
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

      {/* OTP Inputs */}
      <div className="flex justify-center space-x-3 mb-4">
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
            className="w-12 h-12 text-center text-xl font-semibold border-2 border-sage-200 rounded-lg focus:border-sage-500 focus:ring-2 focus:ring-sage-200 focus:outline-none transition-colors disabled:bg-gray-100"
            disabled={isProcessing}
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {/* Resend OTP */}
      <div className="text-center mb-4">
        <p className="text-sage-600 text-sm mb-2">Didn't receive the code?</p>
        <button
          onClick={handleResendOTP}
          disabled={!canResend || isProcessing}
          className={`text-sm font-medium flex items-center justify-center space-x-1 transition-colors ${
            canResend && !isProcessing
              ? "text-sage-600 hover:text-sage-800"
              : "text-sage-400 cursor-not-allowed"
          }`}
        >
          <RefreshCw className="h-4 w-4" />
          <span>{canResend ? "Resend Code" : `Resend in ${resendTimer}s`}</span>
        </button>
      </div>

      {/* Loading */}
      {isProcessing && (
        <div className="text-center mb-4">
          <div className="inline-flex items-center space-x-2 text-sage-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sage-600"></div>
            <span>Processing...</span>
          </div>
        </div>
      )}

      {/* Demo Note */}
      <div className="mt-6 p-4 bg-sage-50 rounded-lg">
        <p className="text-xs text-sage-600 text-center">
          <strong>Demo Mode:</strong> Check the browser console for the OTP code
        </p>
      </div>
    </div>
  )
}

export default OTPVerification
