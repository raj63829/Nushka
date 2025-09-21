import { useState } from "react";
import { signUpWithEmail, signInWithEmail, signInWithOtp, signOut } from "../lib/auth";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
        alert("Logged in successfully ✅");
      } else {
        await signUpWithEmail(email, password);
        alert("Check your email for OTP verification link ✅");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleOtpLogin = async () => {
    try {
      await signInWithOtp(email);
      alert("Check your email for OTP login link ✅");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-4 border rounded max-w-sm mx-auto">
      <h2 className="text-lg font-bold mb-2">{isLogin ? "Sign In" : "Register"}</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {!isLogin && (
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
        <button className="bg-green-600 text-white px-4 py-2 rounded w-full" type="submit">
          {isLogin ? "Sign In" : "Register"}
        </button>
      </form>

      {isLogin && (
        <button
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded w-full"
          onClick={handleOtpLogin}
        >
          Sign In with OTP (Magic Link)
        </button>
      )}

      <p
        className="mt-4 text-sm text-blue-500 cursor-pointer"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Need an account? Register" : "Already have an account? Sign In"}
      </p>
    </div>
  );
}
