import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PayButton from "@/components/PayButton";
import { getOrderByCode } from "@/lib/orders";
import { isLiveMode } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Review & pay — Snap Thai Hub",
};

export default async function PayPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ paid?: string; demo_paid?: string; canceled?: string }>;
}) {
  const { code } = await params;
  const flags = await searchParams;
  const order = getOrderByCode(code);
  if (!order) notFound();

  const justPaid = flags.paid === "1" || flags.demo_paid === "1";
  const canceled = flags.canceled === "1";
  const isPaid = ["paid", "purchasing", "shipped", "delivered"].includes(order.status);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl w-full px-4 sm:px-6 py-12 flex-1">
        <h1 className="font-display font-extrabold text-4xl tracking-tight">
          Order <span className="text-chili">{order.code}</span>
        </h1>

        {justPaid && (
          <div className="mt-6 flex items-start gap-3 bg-jade/10 border-2 border-jade rounded-xl px-5 py-4">
            <CheckCircle2 className="text-jade shrink-0 mt-0.5" size={22} />
            <div>
              <p className="font-display font-bold text-jade">Payment confirmed — kob khun ka! 🙏</p>
              <p className="text-sm text-ink-soft mt-1">
                Our team starts shopping for your items right away. Track progress
                any time with your order code.
              </p>
            </div>
          </div>
        )}
        {canceled && !isPaid && (
          <div className="mt-6 flex items-start gap-3 bg-chili/10 border-2 border-chili rounded-xl px-5 py-4">
            <XCircle className="text-chili shrink-0 mt-0.5" size={22} />
            <p className="font-semibold text-chili-deep">
              Payment was canceled — no charge was made. You can try again below.
            </p>
          </div>
        )}

        <div className="mt-8 bg-white border-4 border-night rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0_var(--mango)]">
          <p className="font-display font-bold text-lg">Order summary</p>
          <ul className="mt-4 space-y-3">
            {order.items.map((item, i) => (
              <li key={item.id} className="flex justify-between gap-4 text-sm border-b border-night/10 pb-3 last:border-0">
                <span>
                  <span className="font-semibold">Item {i + 1}</span>{" "}
                  <span className="text-ink-soft">
                    · {item.kind === "link" ? "from link" : item.kind === "photo" ? "from photo" : "described"}
                    {item.description ? ` — ${item.description.slice(0, 60)}` : ""}
                  </span>
                </span>
                <span className="text-ink-soft shrink-0">×{item.quantity}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink-soft">Shipping to {order.country}</p>

          <div className="mt-6 border-t-2 border-night pt-5 flex items-baseline justify-between">
            <p className="font-display font-bold text-lg">All-in total</p>
            {order.quote_cents ? (
              <p className="font-display font-extrabold text-3xl">
                {(order.quote_cents / 100).toFixed(2)}{" "}
                <span className="text-lg">{order.currency.toUpperCase()}</span>
              </p>
            ) : (
              <p className="font-display font-bold text-ink-soft">Quote in progress…</p>
            )}
          </div>
          <p className="mt-1 text-xs text-ink-soft">
            Includes products, service fee, and tracked shipping. No further charges.
          </p>

          <div className="mt-6">
            {isPaid ? (
              <Link
                href={`/track?code=${order.code}`}
                className="block text-center font-display font-bold text-lg bg-jade text-white px-8 py-3.5 rounded-xl border-2 border-night shadow-[5px_5px_0_var(--night)] hover:shadow-[2px_2px_0_var(--night)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                Paid ✓ — track your order
              </Link>
            ) : order.status === "quoted" && order.quote_cents ? (
              <PayButton code={order.code} live={isLiveMode()} />
            ) : (
              <div className="text-center bg-cream-deep border-2 border-night rounded-xl px-5 py-4 text-sm">
                We&apos;re still preparing your quote — you&apos;ll get an email at{" "}
                <strong>{order.email}</strong> within 24 hours of your request.
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
