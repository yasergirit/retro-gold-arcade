"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-pixel text-xs text-neon-cyan hover:text-neon-magenta transition-colors">
            ← BACK
          </Link>
          <h1 className="font-pixel text-xl text-neon-gold mt-4">LOGIN</h1>
        </div>

        <form onSubmit={handleSubmit} className="card-retro glow-border-cyan space-y-4">
          {error && (
            <div className="font-pixel text-xs text-red-400 bg-red-950/30 border border-red-800 rounded p-3">
              {error}
            </div>
          )}

          <div>
            <label className="block font-pixel text-xs text-gray-400 mb-2">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-dark-bg border border-dark-border text-white px-4 py-3 rounded focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan transition-all font-mono"
              placeholder="player@arcade.com"
            />
          </div>

          <div>
            <label className="block font-pixel text-xs text-gray-400 mb-2">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-dark-bg border border-dark-border text-white px-4 py-3 rounded focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan transition-all font-mono"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-cyan w-full uppercase mt-2"
          >
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>

          <p className="font-pixel text-xs text-gray-400 text-center pt-2">
            New player?{" "}
            <Link href="/signup" className="text-neon-magenta hover:underline">
              SIGN UP
            </Link>
          </p>
        </form>

        <div className="mt-4 card-retro border-dark-border">
          <p className="font-pixel text-xs text-gray-500 mb-2">DEMO ACCOUNT:</p>
          <p className="font-mono text-xs text-gray-400">demo@demo.com / demo1234</p>
        </div>
      </div>
    </main>
  );
}
