import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { signInWithGoogle, signInWithPhone, verifyPhoneOtp } from "../../lib/auth";

export default function Signup() {
  // States for email signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // States for phone signup
  const [phone, setPhone] = useState("");
  const [phoneStep, setPhoneStep] = useState<"phone" | "verify">("phone");

  // Messages
  const [message, setMessage] = useState("");

  // ✅ Step 1: Email Signup (Supabase OTP email)
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

  // ✅ Step 2: Verify Email OTP
  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
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

  // ✅ Step 3: Send Phone OTP
  async function handleSendPhoneOtp() {
    try {
      await signInWithPhone(phone);
      setPhoneStep("verify");
    } catch (err) {
      setMessage("❌ Failed to send OTP");
    }
  }

  // ✅ Step 4: Verify Phone OTP
  async function handleVerifyPhoneOtp() {
    try {
      await verifyPhoneOtp(phone, otp);
      setMessage("✅ Phone verified successfully!");
    } catch (err) {
      setMessage("❌ Invalid phone OTP");
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded space-y-6">
      <h1 className="text-2xl font-bold text-center">Sign Up</h1>

      {/* 🔹 Google OAuth */}
      <button
        onClick={signInWithGoogle}
        className="bg-red-500 text-white px-4 py-2 rounded w-full"
      >
        Sign in with Google
      </button>

      {/* 🔹 Email Signup */}
      {!otpSent ? (
        <form onSubmit={handleSignup} className="space-y-3">
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
            Sign Up with Email
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyEmailOtp} className="space-y-3">
          <input
            type="text"
            placeholder="Enter Email OTP"
            className="border p-2 w-full tracking-widest"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            Verify Email OTP
          </button>
        </form>
      )}

      {/* 🔹 Phone Signup */}
      <div className="border-t pt-4">
        {phoneStep === "phone" ? (
          <div className="space-y-3">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className="border p-2 w-full"
            />
            <button
              onClick={handleSendPhoneOtp}
              className="bg-purple-600 text-white px-4 py-2 rounded w-full"
            >
              Send Phone OTP
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter Phone OTP"
              className="border p-2 w-full tracking-widest"
            />
            <button
              onClick={handleVerifyPhoneOtp}
              className="bg-green-600 text-white px-4 py-2 rounded w-full"
            >
              Verify Phone OTP
            </button>
          </div>
        )}
      </div>

      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </div>
  );
}
