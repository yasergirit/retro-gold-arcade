"use client";

import { useState, useEffect, useCallback } from "react";
import { signOut } from "next-auth/react";

type Transaction = {
  id: string;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
};

type Props = {
  user: { id: string; email: string; name?: string | null };
  initialBalance: number;
  lastClaimDate: string | null;
  transactions: Transaction[];
};

const SIM_TIMES = [
  { label: "11:59 AM (before)", value: "11:59" },
  { label: "12:00 PM (claim time)", value: "12:00" },
  { label: "12:05 PM (after)", value: "12:05" },
  { label: "6:00 PM (evening)", value: "18:00" },
];

const DEMO_AMOUNTS = [10, 50, 100];

export function DashboardClient({ user, initialBalance, lastClaimDate, transactions: initialTx }: Props) {
  const [balance, setBalance] = useState(initialBalance);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTx);
  const [status, setStatus] = useState<{
    canClaim: boolean;
    claimed: boolean;
    countdown: string | null;
    serverTime: string;
  } | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Demo mode state
  const [demoMode, setDemoMode] = useState(false);
  const [simTime, setSimTime] = useState("12:00");

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const fetchStatus = useCallback(async () => {
    try {
      const params = new URLSearchParams({ timezone });
      if (demoMode) {
        params.set("simTime", simTime);
        params.set("demo", "1");
      }
      const res = await fetch(`/api/status?${params}`);
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch {
      // ignore
    }
  }, [timezone, demoMode, simTime]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  async function handleClaim() {
    setClaiming(true);
    setMessage(null);
    try {
      const body: Record<string, string> = { timezone };
      if (demoMode) {
        body.simTime = simTime;
        body.demo = "1";
      }
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setBalance(data.balance);
        setMessage({ text: `+${data.amount} gold claimed! 🎉`, type: "success" });
        if (data.transaction) {
          setTransactions((prev) => [data.transaction, ...prev.slice(0, 9)]);
        }
        fetchStatus();
      } else {
        setMessage({ text: data.error || "Failed to claim", type: "error" });
      }
    } catch {
      setMessage({ text: "Network error", type: "error" });
    } finally {
      setClaiming(false);
    }
  }

  async function handleDemoAdd(amount: number) {
    setDemoLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/demo-add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (res.ok) {
        setBalance(data.balance);
        setMessage({ text: `+${amount} demo gold added!`, type: "success" });
        if (data.transaction) {
          setTransactions((prev) => [data.transaction, ...prev.slice(0, 9)]);
        }
      } else {
        setMessage({ text: data.error || "Failed to add gold", type: "error" });
      }
    } catch {
      setMessage({ text: "Network error", type: "error" });
    } finally {
      setDemoLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
        <div>
          <h1 className="font-pixel text-sm md:text-lg text-neon-gold">RETRO GOLD ARCADE</h1>
          <p className="font-pixel text-xs text-gray-400 mt-1">
            {user.name || user.email}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {demoMode && (
            <span className="font-pixel text-xs bg-neon-magenta/20 text-neon-magenta border border-neon-magenta/50 px-2 py-1 rounded animate-pulse">
              DEMO MODE
            </span>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="btn-retro border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 text-xs"
          >
            LOGOUT
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
        {/* Gold Balance Card */}
        <div className="card-retro glow-border-gold text-center">
          <p className="font-pixel text-xs text-gray-400 mb-2">GOLD BALANCE</p>
          <div className="font-pixel text-4xl text-neon-gold mb-1">
            {balance.toLocaleString()}
          </div>
          <p className="font-pixel text-xs text-yellow-600">GOLD</p>
        </div>

        {/* Daily Claim Card */}
        <div className="card-retro glow-border-cyan">
          <p className="font-pixel text-xs text-gray-400 mb-4">DAILY REWARD</p>

          {message && (
            <div
              className={`font-pixel text-xs mb-4 p-3 rounded border ${
                message.type === "success"
                  ? "text-green-400 bg-green-950/30 border-green-800"
                  : "text-red-400 bg-red-950/30 border-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          {!status ? (
            <div className="font-pixel text-xs text-gray-500 animate-pulse">LOADING...</div>
          ) : status.claimed ? (
            <div className="text-center">
              <div className="font-pixel text-xs text-green-400 mb-2">✓ CLAIMED TODAY</div>
              <div className="font-pixel text-xs text-gray-500">Come back tomorrow at 12:00</div>
            </div>
          ) : status.canClaim ? (
            <div className="text-center">
              <div className="font-pixel text-xs text-neon-cyan mb-4">
                10 GOLD AVAILABLE!
              </div>
              <button
                onClick={handleClaim}
                disabled={claiming}
                className="btn-gold w-full uppercase"
              >
                {claiming ? "CLAIMING..." : "CLAIM 10 GOLD"}
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="font-pixel text-xs text-gray-400 mb-2">NEXT CLAIM AT 12:00</div>
              {status.countdown && (
                <div className="font-pixel text-lg text-neon-magenta">
                  {status.countdown}
                </div>
              )}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-dark-border">
            <p className="font-pixel text-xs text-gray-500">
              Server: {status?.serverTime ?? "..."}
            </p>
          </div>
        </div>

        {/* Test Tools Panel */}
        <div className="card-retro border-neon-magenta/30 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="font-pixel text-xs text-neon-magenta">TEST TOOLS</p>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="font-pixel text-xs text-gray-400">DEMO MODE</span>
              <div
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  demoMode ? "bg-neon-magenta/50" : "bg-gray-700"
                }`}
                onClick={() => setDemoMode(!demoMode)}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full transition-transform ${
                    demoMode ? "translate-x-5 bg-neon-magenta" : "translate-x-0.5 bg-gray-400"
                  }`}
                />
              </div>
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Simulated Time */}
            <div>
              <p className="font-pixel text-xs text-gray-500 mb-2">SIMULATE TIME</p>
              <div className="space-y-2">
                {SIM_TIMES.map((t) => (
                  <label key={t.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="simTime"
                      value={t.value}
                      checked={simTime === t.value}
                      onChange={() => {
                        setSimTime(t.value);
                        if (!demoMode) setDemoMode(true);
                      }}
                      className="accent-neon-cyan"
                      disabled={!demoMode}
                    />
                    <span
                      className={`font-pixel text-xs ${
                        demoMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {t.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Demo Gold */}
            <div>
              <p className="font-pixel text-xs text-gray-500 mb-2">ADD DEMO GOLD</p>
              <div className="flex flex-wrap gap-2">
                {DEMO_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => handleDemoAdd(amt)}
                    disabled={demoLoading}
                    className="btn-gold text-xs px-3 py-2"
                  >
                    +{amt}
                  </button>
                ))}
              </div>
              <p className="font-pixel text-xs text-gray-600 mt-2">
                Add gold for testing
              </p>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="card-retro md:col-span-2">
          <p className="font-pixel text-xs text-gray-400 mb-4">RECENT TRANSACTIONS</p>
          {transactions.length === 0 ? (
            <p className="font-pixel text-xs text-gray-600">No transactions yet</p>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between border-b border-dark-border pb-2 last:border-0"
                >
                  <div>
                    <p className="font-pixel text-xs text-gray-300">{tx.description}</p>
                    <p className="font-pixel text-xs text-gray-600 mt-0.5">
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`font-pixel text-sm font-bold ${
                      tx.amount > 0 ? "text-neon-gold" : "text-red-400"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : ""}{tx.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
