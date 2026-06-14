import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrackClient from "@/components/TrackClient";

export const metadata: Metadata = {
  title: "Track your order — Snap Thai Hub",
  description: "Enter your SNTH order code to follow your package from Bangkok to your door.",
};

export default function TrackPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl w-full px-4 sm:px-6 py-12 flex-1">
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">
          Where&apos;s my <span className="text-jade">package?</span>
        </h1>
        <p className="mt-3 text-lg text-ink-soft">
          Enter the order code from your confirmation (it looks like
          SNTH-A1B2C3).
        </p>
        <Suspense>
          <TrackClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
