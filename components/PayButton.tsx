"use client";

import { useState } from "react";
import { Loader2, Lock } from "lucide-react";

export default function PayButton({ code, live }: { code: string; live: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function pay() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={pay}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 font-display font-bold text-lg bg-chili text-white px-8 py-3.5 rounded-xl border-2 border-night shadow-[5px_5px_0_var(--night)] hover:shadow-[2px_2px_0_var(--night)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-60"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : <Lock size={18} />}
        {loading ? "Opening secure checkout…" : "Approve & pay securely"}
      </button>
      {!live && (
        <p className="mt-2 text-center text-xs text-ink-soft">
          Demo mode — payment is simulated until Stripe keys are configured.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 text-center font-semibold text-chili-deep">
          {error}
        </p>
      )}
    </div>
  );
}
