"use client";

import { useState } from "react";
import { UserPlus, Loader2 } from "lucide-react";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setMessage("⚠️ Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/.netlify/functions/create-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Signup failed");

      setMessage("✅ Account created successfully! Check your inbox to confirm.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      setMessage("⚠️ An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4">
      <div className="p-8 max-w-md w-full bg-white shadow-xl rounded-2xl border border-gray-100">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mb-3">
            <UserPlus className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-600 mt-2 text-sm">
            Fill in your details to create an account.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              name="firstName"
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              disabled={isLoading}
            />
            <input
              name="lastName"
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              disabled={isLoading}
            />
          </div>

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            disabled={isLoading}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            disabled={isLoading}
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg w-full font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Creating...
              </>
            ) : (
              "Create Account"
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
          <span className="underline hover:text-green-600 cursor-pointer">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="underline hover:text-green-600 cursor-pointer">
            Privacy Policy
          </span>
          .
        </div>
      </div>
    </div>
  );
}
