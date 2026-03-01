"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to create account");
      setLoading(false);
      return;
    }

    await signIn("credentials", { email, password, redirect: false });
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-pixel text-xs text-neon-cyan hover:text-neon-magenta transition-colors">
            ← BACK
          </Link>
          <h1 className="font-pixel text-xl text-neon-gold mt-4">SIGN UP</h1>
        </div>

        <form onSubmit={handleSubmit} className="card-retro glow-border-magenta space-y-4">
          {error && (
            <div className="font-pixel text-xs text-red-400 bg-red-950/30 border border-red-800 rounded p-3">
              {error}
            </div>
          )}

          <div>
            <label className="block font-pixel text-xs text-gray-400 mb-2">NAME (optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border text-white px-4 py-3 rounded focus:outline-none focus:border-neon-magenta transition-all font-mono"
              placeholder="Player One"
            />
          </div>

          <div>
            <label className="block font-pixel text-xs text-gray-400 mb-2">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-dark-bg border border-dark-border text-white px-4 py-3 rounded focus:outline-none focus:border-neon-magenta transition-all font-mono"
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
              minLength={8}
              className="w-full bg-dark-bg border border-dark-border text-white px-4 py-3 rounded focus:outline-none focus:border-neon-magenta transition-all font-mono"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-magenta w-full uppercase mt-2"
          >
            {loading ? "CREATING..." : "CREATE ACCOUNT"}
          </button>

          <p className="font-pixel text-xs text-gray-400 text-center pt-2">
            Already a player?{" "}
            <Link href="/login" className="text-neon-cyan hover:underline">
              LOGIN
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
