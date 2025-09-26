"use client"

import { useState } from "react"
import { Mail } from "lucide-react"
import { useAuth } from "../../context/AuthContext"


export default function Signup() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { sendOTP } = useAuth()

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setIsLoading(true)

    try {
      const result = await sendOTP(email)
      if (result.success) {
        setMessage("✅ Check your email for a 6-digit OTP to sign in.")
      } else {
        setMessage(result.error || "Failed to send OTP. Try again.")
      }
    } catch (err: any) {
      console.error("Signup error:", err)
      setMessage("⚠️ An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="p-8 max-w-md w-full bg-white shadow-lg rounded-lg">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full mb-3">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Sign in with Email</h2>
          <p className="text-gray-600 mt-2 text-sm">
            Enter your email and we’ll send a 6-digit OTP to log you in.
          </p>
        </div>

        <form onSubmit={handleSendOTP} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-3 rounded w-full font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {isLoading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <div className="mt-6 text-center text-gray-500 text-xs">
          By continuing, you agree to our <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
        </div>
      </div>
    </div>
  )
}
