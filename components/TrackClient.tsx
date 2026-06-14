"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Inbox,
  Calculator,
  CreditCard,
  ShoppingBag,
  Plane,
  Home,
  Loader2,
  Search,
} from "lucide-react";

const STAGES = [
  { key: "received", label: "Request received", desc: "Your wishlist landed at our Bangkok hub.", icon: Inbox },
  { key: "quoted", label: "Quote ready", desc: "Check your email — your all-in price is waiting.", icon: Calculator },
  { key: "paid", label: "Payment confirmed", desc: "Thanks! Your order is queued for shopping.", icon: CreditCard },
  { key: "purchasing", label: "Shopping in Thailand", desc: "Our team is out buying your items.", icon: ShoppingBag },
  { key: "shipped", label: "On its way", desc: "Packed and flying to you with full tracking.", icon: Plane },
  { key: "delivered", label: "Delivered", desc: "Enjoy your taste of Thailand!", icon: Home },
] as const;

interface PublicOrder {
  code: string;
  status: string;
  country: string;
  quote_cents: number | null;
  currency: string;
  tracking_carrier: string | null;
  tracking_number: string | null;
  created_at: string;
  item_count: number;
}

export default function TrackClient() {
  const params = useSearchParams();
  const reduce = useReducedMotion();
  const [code, setCode] = useState(params.get("code") ?? "");
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lookup = useCallback(async (lookupCode: string) => {
    if (!lookupCode.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(lookupCode.trim())}`);
      if (res.status === 404) {
        setError("We couldn't find that order. Double-check the code — it starts with SNTH-.");
        return;
      }
      if (!res.ok) throw new Error();
      setOrder(await res.json());
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initial = params.get("code");
    if (initial) lookup(initial);
  }, [params, lookup]);

  const stageIndex = order ? STAGES.findIndex((s) => s.key === order.status) : -1;

  return (
    <div className="mt-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          lookup(code);
        }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="SNTH-XXXXXX"
          aria-label="Order code"
          className="flex-1 bg-white border-2 border-night rounded-xl px-5 py-3.5 font-display font-bold tracking-widest text-lg placeholder:text-ink-soft/50 focus:outline-none focus:ring-4 focus:ring-mango/60 transition-shadow"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 font-display font-bold text-lg bg-jade text-white px-7 py-3.5 rounded-xl border-2 border-night shadow-[4px_4px_0_var(--night)] hover:shadow-[1px_1px_0_var(--night)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-60"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
          Track
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-6 font-semibold text-chili-deep bg-chili/10 border-2 border-chili rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {order && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-10 bg-white border-4 border-night rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0_var(--jade)]"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display font-extrabold text-2xl">{order.code}</h2>
            <p className="text-ink-soft text-sm">
              {order.item_count} item{order.item_count === 1 ? "" : "s"} → {order.country}
            </p>
          </div>

          {order.status === "quoted" && order.quote_cents && (
            <Link
              href={`/pay/${order.code}`}
              className="mt-4 block bg-mango border-2 border-night rounded-xl px-5 py-4 font-display font-bold hover:bg-mango-soft transition-colors"
            >
              Your quote is ready: {(order.quote_cents / 100).toFixed(2)}{" "}
              {order.currency.toUpperCase()} — tap to review &amp; pay →
            </Link>
          )}

          {order.tracking_number && (
            <p className="mt-4 bg-cream-deep border-2 border-night rounded-xl px-5 py-3 text-sm">
              <span className="font-display font-bold">Carrier tracking:</span>{" "}
              {order.tracking_carrier ?? "Carrier"} · {order.tracking_number}
            </p>
          )}

          <ol className="mt-8 relative">
            {STAGES.map((stage, i) => {
              const done = i <= stageIndex;
              const current = i === stageIndex;
              return (
                <motion.li
                  key={stage.key}
                  initial={reduce ? false : { opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: reduce ? 0 : 0.1 + i * 0.09, duration: 0.35 }}
                  className="relative flex gap-4 pb-8 last:pb-0"
                >
                  {i < STAGES.length - 1 && (
                    <span
                      aria-hidden
                      className={`absolute left-[21px] top-11 bottom-0 w-1 rounded ${
                        i < stageIndex ? "bg-jade" : "bg-night/15"
                      }`}
                    />
                  )}
                  <span
                    className={`relative z-10 w-11 h-11 shrink-0 rounded-xl border-2 border-night flex items-center justify-center transition-colors ${
                      current
                        ? "bg-mango text-night"
                        : done
                          ? "bg-jade text-white"
                          : "bg-cream text-ink-soft"
                    }`}
                  >
                    <stage.icon size={20} />
                  </span>
                  <div className={done ? "" : "opacity-50"}>
                    <p className="font-display font-bold text-lg leading-tight">
                      {stage.label}
                      {current && (
                        <span className="ml-2 text-xs font-bold bg-night text-mango px-2 py-0.5 rounded-full align-middle">
                          NOW
                        </span>
                      )}
                    </p>
                    <p className="text-ink-soft text-sm mt-0.5">{stage.desc}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </motion.div>
      )}
    </div>
  );
}
