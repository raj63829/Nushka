import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  // Step 1: Sign up user (triggers Supabase OTP email)
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setOtpSent(true);
      setMessage("OTP has been sent to your email.");
    }
  };

  // Step 2: Verify OTP entered by user
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "signup", // important: must match flow
    });

    if (error) {
      setMessage("Invalid or expired OTP");
    } else {
      setMessage("✅ Signup successful! You are now logged in.");
      console.log("User:", data.user);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded">
      {!otpSent ? (
        <form onSubmit={handleSignup} className="space-y-4">
          <h2 className="text-xl font-bold">Create Account</h2>
          <input
            type="email"
            placeholder="Email"
            className="border p-2 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Sign Up
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <h2 className="text-xl font-bold">Verify OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            className="border p-2 w-full tracking-widest"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            Verify
          </button>
        </form>
      )}

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
