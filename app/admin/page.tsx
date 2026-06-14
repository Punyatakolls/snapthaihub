"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Loader2, RefreshCw, LogIn } from "lucide-react";

const STATUSES = ["received", "quoted", "paid", "purchasing", "shipped", "delivered"] as const;

interface AdminItem {
  id: number;
  kind: string;
  url: string | null;
  image_path: string | null;
  description: string;
  quantity: number;
}

interface AdminOrder {
  code: string;
  name: string;
  email: string;
  country: string;
  notes: string;
  status: string;
  quote_cents: number | null;
  currency: string;
  tracking_carrier: string | null;
  tracking_number: string | null;
  created_at: string;
  items: AdminItem[];
}

const badgeColor: Record<string, string> = {
  received: "bg-cream-deep text-ink",
  quoted: "bg-mango text-night",
  paid: "bg-jade text-white",
  purchasing: "bg-taxi-pink text-white",
  shipped: "bg-chili text-white",
  delivered: "bg-night text-mango",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(
    async (pw: string) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admin/orders", {
          headers: { "x-admin-password": pw },
        });
        if (res.status === 401) {
          setError("Wrong password (or ADMIN_PASSWORD not set in .env.local).");
          setAuthed(false);
          return;
        }
        const data = await res.json();
        setOrders(data.orders);
        setAuthed(true);
      } catch {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  async function patch(body: Record<string, unknown>) {
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify(body),
    });
    if (res.ok) load(password);
    else {
      const data = await res.json();
      setError(data.error ?? "Update failed");
    }
  }

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            load(password);
          }}
          className="w-full max-w-sm bg-white border-4 border-night rounded-2xl p-8 shadow-[6px_6px_0_var(--mango)]"
        >
          <h1 className="font-display font-extrabold text-2xl">Hub admin</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="mt-4 w-full bg-cream border-2 border-night rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-mango/60"
            autoFocus
          />
          {error && <p className="mt-3 text-sm font-semibold text-chili-deep">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full flex items-center justify-center gap-2 font-display font-bold bg-night text-mango px-6 py-3 rounded-xl border-2 border-night hover:bg-night-soft transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
            Enter
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display font-extrabold text-3xl">
          Orders <span className="text-ink-soft text-xl">({orders.length})</span>
        </h1>
        <button
          onClick={() => load(password)}
          className="flex items-center gap-2 font-display font-bold bg-cream-deep px-4 py-2 rounded-lg border-2 border-night hover:bg-mango-soft transition-colors"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>
      {error && <p className="mt-4 font-semibold text-chili-deep">{error}</p>}

      <div className="mt-8 space-y-6">
        {orders.length === 0 && (
          <p className="text-ink-soft">No orders yet. They&apos;ll appear here as customers submit requests.</p>
        )}
        {orders.map((o) => (
          <details key={o.code} className="bg-white border-4 border-night rounded-2xl overflow-hidden">
            <summary className="cursor-pointer list-none px-5 py-4 flex flex-wrap items-center gap-3">
              <span className="font-display font-extrabold text-lg">{o.code}</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeColor[o.status]}`}>
                {o.status.toUpperCase()}
              </span>
              <span className="text-sm text-ink-soft">
                {o.name} · {o.country} · {o.items.length} item{o.items.length === 1 ? "" : "s"}
              </span>
              {o.quote_cents && (
                <span className="text-sm font-bold ml-auto">
                  {(o.quote_cents / 100).toFixed(2)} {o.currency.toUpperCase()}
                </span>
              )}
            </summary>

            <div className="border-t-2 border-night/10 px-5 py-4 space-y-4">
              <p className="text-sm">
                <strong>{o.email}</strong>
                {o.notes && <span className="text-ink-soft"> — “{o.notes}”</span>}
              </p>

              <ul className="space-y-2">
                {o.items.map((it) => (
                  <li key={it.id} className="flex items-center gap-3 text-sm bg-cream rounded-lg px-3 py-2">
                    <span className="font-bold text-xs uppercase bg-night text-mango px-2 py-0.5 rounded">
                      {it.kind}
                    </span>
                    {it.image_path && (
                      <a href={it.image_path} target="_blank" rel="noreferrer">
                        <Image
                          src={it.image_path}
                          alt="Customer upload"
                          width={40}
                          height={40}
                          unoptimized
                          className="w-10 h-10 object-cover rounded border border-night"
                        />
                      </a>
                    )}
                    {it.url && (
                      <a href={it.url} target="_blank" rel="noreferrer" className="underline truncate max-w-[14rem]">
                        {it.url}
                      </a>
                    )}
                    <span className="truncate">{it.description}</span>
                    <span className="ml-auto shrink-0 text-ink-soft">×{it.quantity}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-end gap-4 pt-2">
                <QuoteForm
                  disabled={!["received", "quoted"].includes(o.status)}
                  initial={o.quote_cents ? (o.quote_cents / 100).toFixed(2) : ""}
                  onSubmit={(usd) => patch({ code: o.code, quote_cents: usd * 100 })}
                />
                <label className="text-sm font-semibold">
                  Status
                  <select
                    value={o.status}
                    onChange={(e) => patch({ code: o.code, status: e.target.value })}
                    className="block mt-1 bg-cream border-2 border-night rounded-lg px-3 py-2"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <TrackingForm
                  carrier={o.tracking_carrier ?? ""}
                  number={o.tracking_number ?? ""}
                  onSubmit={(carrier, number) =>
                    patch({ code: o.code, status: "shipped", tracking_carrier: carrier, tracking_number: number })
                  }
                />
              </div>
            </div>
          </details>
        ))}
      </div>
    </main>
  );
}

function QuoteForm({
  initial,
  disabled,
  onSubmit,
}: {
  initial: string;
  disabled: boolean;
  onSubmit: (usd: number) => void;
}) {
  const [value, setValue] = useState(initial);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const usd = parseFloat(value);
        if (usd > 0) onSubmit(usd);
      }}
      className="text-sm font-semibold"
    >
      Quote (USD)
      <div className="flex gap-2 mt-1">
        <input
          type="number"
          step="0.01"
          min="1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          className="w-28 bg-cream border-2 border-night rounded-lg px-3 py-2 disabled:opacity-50"
          placeholder="49.00"
        />
        <button
          type="submit"
          disabled={disabled}
          className="font-display font-bold bg-mango px-4 rounded-lg border-2 border-night hover:bg-mango-soft transition-colors disabled:opacity-50"
        >
          Send quote
        </button>
      </div>
    </form>
  );
}

function TrackingForm({
  carrier: c0,
  number: n0,
  onSubmit,
}: {
  carrier: string;
  number: string;
  onSubmit: (carrier: string, number: string) => void;
}) {
  const [carrier, setCarrier] = useState(c0);
  const [number, setNumber] = useState(n0);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (number.trim()) onSubmit(carrier.trim() || "Carrier", number.trim());
      }}
      className="text-sm font-semibold"
    >
      Ship with tracking
      <div className="flex gap-2 mt-1">
        <input
          value={carrier}
          onChange={(e) => setCarrier(e.target.value)}
          placeholder="DHL"
          className="w-24 bg-cream border-2 border-night rounded-lg px-3 py-2"
        />
        <input
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Tracking #"
          className="w-36 bg-cream border-2 border-night rounded-lg px-3 py-2"
        />
        <button
          type="submit"
          className="font-display font-bold bg-chili text-white px-4 rounded-lg border-2 border-night hover:bg-chili-deep transition-colors"
        >
          Mark shipped
        </button>
      </div>
    </form>
  );
}
