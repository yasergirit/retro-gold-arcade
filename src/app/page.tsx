import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8">
          <span className="font-pixel text-xs text-neon-magenta tracking-widest uppercase">
            ★ Welcome to ★
          </span>
        </div>
        <h1 className="font-pixel text-2xl md:text-4xl text-neon-gold mb-4 leading-relaxed">
          RETRO GOLD
          <br />
          ARCADE
        </h1>
        <p className="font-pixel text-xs text-neon-cyan mb-12 leading-relaxed">
          Claim your daily gold.
          <br />
          Build your fortune.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login" className="btn-cyan uppercase">
            Insert Coin (Login)
          </Link>
          <Link href="/signup" className="btn-magenta uppercase">
            New Player (Sign Up)
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-4 text-center">
          {[
            { label: "Daily Reward", value: "10 GOLD" },
            { label: "Claim Time", value: "12:00" },
            { label: "Players", value: "∞" },
          ].map((stat) => (
            <div key={stat.label} className="card-retro glow-border-cyan">
              <div className="font-pixel text-lg text-neon-gold mb-2">
                {stat.value}
              </div>
              <div className="font-pixel text-xs text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
