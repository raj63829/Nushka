"use client";

import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      // Call Netlify proxy function → backend API
      const response = await fetch("/.netlify/functions/proxy-api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setMessage("✅ Check your email for a 6-digit OTP to sign in.");
    } catch (error: any) {
      console.error("Signup error:", error);
      setMessage("⚠️ An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="p-8 max-w-md w-full bg-white shadow-xl rounded-2xl border border-gray-100">
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
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-60"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg w-full font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Sending...
              </>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>

        {message && (
          <p
            className={`mt-5 text-center font-medium transition-all duration-300 ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <div className="mt-6 text-center text-gray-500 text-xs">
          By continuing, you agree to our{" "}
          <span className="underline hover:text-blue-600 cursor-pointer">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="underline hover:text-blue-600 cursor-pointer">
            Privacy Policy
          </span>
          .
        </div>
      </div>
    </div>
  );
}
