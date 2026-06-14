import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderWizard from "@/components/OrderWizard";

export const metadata: Metadata = {
  title: "Start an order — Snap Thai Hub",
  description:
    "Upload a photo, paste a link, or describe any product in Thailand. We'll send you an all-in quote within 24 hours.",
};

export default function OrderPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl w-full px-4 sm:px-6 py-12 flex-1">
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">
          What are you <span className="text-chili">craving?</span>
        </h1>
        <p className="mt-3 text-lg text-ink-soft">
          Add as many items as you like — links, photos, screenshots, or just a
          description. We&apos;ll quote everything in one go, within 24 hours.
        </p>
        <OrderWizard />
      </main>
      <Footer />
    </>
  );
}
