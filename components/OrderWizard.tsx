"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Link2,
  Camera,
  PenLine,
  Plus,
  Trash2,
  Upload,
  Loader2,
  PartyPopper,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

type ItemKind = "link" | "photo" | "description";

interface DraftItem {
  id: number;
  kind: ItemKind;
  url: string;
  imagePath: string;
  uploading: boolean;
  description: string;
  quantity: number;
}

let nextId = 1;
const newItem = (kind: ItemKind = "link"): DraftItem => ({
  id: nextId++,
  kind,
  url: "",
  imagePath: "",
  uploading: false,
  description: "",
  quantity: 1,
});

const kindTabs: { kind: ItemKind; label: string; icon: typeof Link2 }[] = [
  { kind: "link", label: "Paste a link", icon: Link2 },
  { kind: "photo", label: "Upload a photo", icon: Camera },
  { kind: "description", label: "Describe it", icon: PenLine },
];

const inputCls =
  "w-full bg-white border-2 border-night rounded-lg px-4 py-3 placeholder:text-ink-soft/60 focus:outline-none focus-visible:outline-none focus:ring-4 focus:ring-mango/60 transition-shadow";

export default function OrderWizard() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0); // 0 items, 1 contact, 2 done
  const [items, setItems] = useState<DraftItem[]>([newItem()]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderCode, setOrderCode] = useState("");
  const fileInputs = useRef<Record<number, HTMLInputElement | null>>({});

  const update = (id: number, patch: Partial<DraftItem>) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const itemReady = (it: DraftItem) =>
    (it.kind === "link" && it.url.trim().length > 3) ||
    (it.kind === "photo" && it.imagePath) ||
    (it.kind === "description" && it.description.trim().length > 2);

  const readyItems = items.filter(itemReady);

  async function handleFile(id: number, file: File) {
    update(id, { uploading: true });
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      update(id, { imagePath: data.path, uploading: false });
    } catch (e) {
      update(id, { uploading: false });
      setError(e instanceof Error ? e.message : "Upload failed");
    }
  }

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          country,
          notes,
          items: readyItems.map((it) => ({
            kind: it.kind,
            url: it.kind === "link" ? it.url.trim() : undefined,
            imagePath: it.kind === "photo" ? it.imagePath : undefined,
            description: it.description.trim(),
            quantity: it.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setOrderCode(data.code);
      setStep(2);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const stepAnim = reduce
    ? {}
    : {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -24 },
        transition: { duration: 0.3 },
      };

  return (
    <div className="mt-8">
      {/* progress */}
      {step < 2 && (
        <div className="flex items-center gap-3 mb-8" aria-label={`Step ${step + 1} of 2`}>
          {["Your items", "Your details"].map((label, i) => (
            <div key={label} className="flex items-center gap-3">
              <span
                className={`font-display font-bold text-sm px-3 py-1.5 rounded-full border-2 border-night transition-colors ${
                  i <= step ? "bg-mango text-night" : "bg-white text-ink-soft"
                }`}
              >
                {i + 1} · {label}
              </span>
              {i === 0 && <span className="w-8 h-0.5 bg-night/30" aria-hidden />}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="items" {...stepAnim}>
            <div className="space-y-6">
              {items.map((it, idx) => (
                <div
                  key={it.id}
                  className="bg-white border-4 border-night rounded-2xl p-5 shadow-[5px_5px_0_var(--cream-deep)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-display font-bold text-lg">Item {idx + 1}</p>
                    {items.length > 1 && (
                      <button
                        onClick={() => setItems((p) => p.filter((x) => x.id !== it.id))}
                        className="text-ink-soft hover:text-chili transition-colors p-1"
                        aria-label={`Remove item ${idx + 1}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2" role="tablist">
                    {kindTabs.map((t) => (
                      <button
                        key={t.kind}
                        role="tab"
                        aria-selected={it.kind === t.kind}
                        onClick={() => update(it.id, { kind: t.kind })}
                        className={`flex items-center gap-1.5 font-display font-semibold text-sm px-3.5 py-2 rounded-lg border-2 border-night transition-all ${
                          it.kind === t.kind
                            ? "bg-night text-mango"
                            : "bg-cream hover:bg-cream-deep"
                        }`}
                      >
                        <t.icon size={15} /> {t.label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 space-y-3">
                    {it.kind === "link" && (
                      <input
                        type="url"
                        value={it.url}
                        onChange={(e) => update(it.id, { url: e.target.value })}
                        placeholder="https://shopee.co.th/… or any Thai shop link"
                        className={inputCls}
                        aria-label="Product link"
                      />
                    )}

                    {it.kind === "photo" && (
                      <div>
                        <input
                          ref={(el) => {
                            fileInputs.current[it.id] = el;
                          }}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleFile(it.id, f);
                          }}
                        />
                        {it.imagePath ? (
                          <div className="flex items-center gap-4">
                            <Image
                              src={it.imagePath}
                              alt="Uploaded product"
                              width={96}
                              height={96}
                              unoptimized
                              className="w-24 h-24 object-cover rounded-lg border-2 border-night"
                            />
                            <button
                              onClick={() => fileInputs.current[it.id]?.click()}
                              className="font-semibold text-sm underline underline-offset-4 hover:text-chili transition-colors"
                            >
                              Replace photo
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => fileInputs.current[it.id]?.click()}
                            disabled={it.uploading}
                            className="w-full border-2 border-dashed border-night/50 rounded-xl py-8 flex flex-col items-center gap-2 hover:border-chili hover:bg-cream transition-colors disabled:opacity-60"
                          >
                            {it.uploading ? (
                              <Loader2 className="animate-spin text-chili" size={28} />
                            ) : (
                              <Upload className="text-chili" size={28} />
                            )}
                            <span className="font-display font-semibold">
                              {it.uploading ? "Uploading…" : "Tap to upload a photo or screenshot"}
                            </span>
                            <span className="text-xs text-ink-soft">JPG, PNG, WebP, GIF or HEIC · max 8MB</span>
                          </button>
                        )}
                      </div>
                    )}

                    <textarea
                      value={it.description}
                      onChange={(e) => update(it.id, { description: e.target.value })}
                      placeholder={
                        it.kind === "description"
                          ? "Describe it: name, brand, where you saw it, size, flavor…"
                          : "Anything we should know? Size, flavor, color… (optional)"
                      }
                      rows={it.kind === "description" ? 3 : 2}
                      className={inputCls}
                      aria-label="Item description"
                    />

                    <label className="flex items-center gap-3 font-medium text-sm">
                      Quantity
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={it.quantity}
                        onChange={(e) =>
                          update(it.id, {
                            quantity: Math.max(1, Math.min(99, Number(e.target.value) || 1)),
                          })
                        }
                        className="w-20 bg-white border-2 border-night rounded-lg px-3 py-2 focus:ring-4 focus:ring-mango/60 focus:outline-none"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setItems((p) => [...p, newItem()])}
              className="mt-5 flex items-center gap-2 font-display font-bold text-chili hover:text-chili-deep transition-colors"
            >
              <Plus size={18} /> Add another item
            </button>

            {error && (
              <p role="alert" className="mt-4 font-semibold text-chili-deep bg-chili/10 border-2 border-chili rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            <button
              onClick={() => {
                if (readyItems.length === 0) {
                  setError("Add at least one item — a link, a photo, or a description.");
                  return;
                }
                setError("");
                setStep(1);
              }}
              className="mt-8 w-full sm:w-auto flex items-center justify-center gap-2 font-display font-bold text-lg bg-chili text-white px-8 py-3.5 rounded-xl border-2 border-night shadow-[5px_5px_0_var(--night)] hover:shadow-[2px_2px_0_var(--night)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              Continue <ArrowRight size={20} />
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="contact" {...stepAnim}>
            <div className="bg-white border-4 border-night rounded-2xl p-6 shadow-[5px_5px_0_var(--cream-deep)] space-y-4">
              <label className="block">
                <span className="font-display font-semibold">Your name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Somchai Smith"
                  className={`mt-1.5 ${inputCls}`}
                  autoComplete="name"
                />
              </label>
              <label className="block">
                <span className="font-display font-semibold">Email — your quote lands here</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`mt-1.5 ${inputCls}`}
                  autoComplete="email"
                />
              </label>
              <label className="block">
                <span className="font-display font-semibold">Country we&apos;re shipping to</span>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Japan, Germany, USA…"
                  className={`mt-1.5 ${inputCls}`}
                  autoComplete="country-name"
                />
              </label>
              <label className="block">
                <span className="font-display font-semibold">Notes (optional)</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Deadlines, substitutions OK or not, packing requests…"
                  rows={3}
                  className={`mt-1.5 ${inputCls}`}
                />
              </label>
            </div>

            <p className="mt-4 text-sm text-ink-soft">
              Sending {readyItems.length} item{readyItems.length === 1 ? "" : "s"} for a free
              quote. You only pay after you approve it.
            </p>

            {error && (
              <p role="alert" className="mt-4 font-semibold text-chili-deep bg-chili/10 border-2 border-chili rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => setStep(0)}
                className="flex items-center gap-2 font-display font-bold text-lg bg-cream text-ink px-6 py-3.5 rounded-xl border-2 border-night shadow-[5px_5px_0_var(--mango)] hover:shadow-[2px_2px_0_var(--mango)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                <ArrowLeft size={20} /> Back
              </button>
              <button
                onClick={submit}
                disabled={submitting}
                className="flex items-center gap-2 font-display font-bold text-lg bg-chili text-white px-8 py-3.5 rounded-xl border-2 border-night shadow-[5px_5px_0_var(--night)] hover:shadow-[2px_2px_0_var(--night)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Sending…
                  </>
                ) : (
                  "Get my free quote"
                )}
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="done"
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0, scale: 0.9 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { duration: 0.45, ease: [0.21, 0.65, 0.36, 1] as const },
                })}
            className="bg-white border-4 border-night rounded-2xl p-8 shadow-[8px_8px_0_var(--mango)] text-center"
          >
            <PartyPopper className="mx-auto text-chili" size={48} />
            <h2 className="mt-4 font-display font-extrabold text-3xl">
              Request received!
            </h2>
            <p className="mt-2 text-ink-soft">
              Your order code — keep it to track progress and pay your quote:
            </p>
            <p className="mt-4 font-display font-extrabold text-4xl tracking-widest bg-night text-mango inline-block px-6 py-3 rounded-xl">
              {orderCode}
            </p>
            <p className="mt-4 text-ink-soft">
              We&apos;ll email your all-in quote to <strong>{email}</strong> within 24 hours.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href={`/track?code=${orderCode}`}
                className="font-display font-bold bg-chili text-white px-6 py-3 rounded-xl border-2 border-night shadow-[4px_4px_0_var(--night)] hover:shadow-[1px_1px_0_var(--night)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                Track this order
              </Link>
              <Link
                href="/"
                className="font-display font-bold bg-cream text-ink px-6 py-3 rounded-xl border-2 border-night shadow-[4px_4px_0_var(--mango)] hover:shadow-[1px_1px_0_var(--mango)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                Back home
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
