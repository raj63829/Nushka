"use client";

import { useState } from "react";
import { LogIn, Loader2 } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "/.netlify/functions/login", // ✅ Uses your Netlify backend
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid credentials");
      }

      // ✅ Store session and user info
      localStorage.setItem("session", JSON.stringify(data.session));
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } catch (err: any) {
      console.error("Login Error:", err);
      setMessage("⚠️ " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4">
      <div className="p-8 max-w-md w-full bg-white shadow-xl rounded-2xl border border-gray-100">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 flex items-center justify-center bg-indigo-100 rounded-full mb-3">
            <LogIn className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mt-2 text-sm">
            Sign in to continue to your account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            disabled={isLoading}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg w-full font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p
            className={`mt-5 text-center font-medium transition-all duration-300 ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Signup Redirect */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
