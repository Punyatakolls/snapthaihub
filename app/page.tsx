import Link from "next/link";
import {
  Camera,
  CalculatorIcon,
  CreditCard,
  Plane,
  Star,
  MapPin,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";

const steps = [
  {
    icon: Camera,
    color: "bg-chili",
    title: "1 · Snap or paste",
    text: "Upload a photo or screenshot, paste a link from any Thai shop — Shopee, Lazada, Instagram — or just describe what you're craving.",
  },
  {
    icon: CalculatorIcon,
    color: "bg-taxi-pink",
    title: "2 · We quote in 24h",
    text: "Our Bangkok team finds your items, confirms availability, and sends one all-in price: product + service + shipping to your country.",
  },
  {
    icon: CreditCard,
    color: "bg-mango",
    title: "3 · Pay securely",
    text: "Approve the quote and pay by card through our secure checkout. No hidden fees, no surprises at the door.",
  },
  {
    icon: Plane,
    color: "bg-jade",
    title: "4 · We shop & ship",
    text: "We buy your items the same day, pack them with care, and ship with full tracking — from our hub straight to your address.",
  },
];

const categories = [
  { emoji: "🍜", name: "Instant noodles & snacks", note: "Mama, Lays Thai flavors, Bento, Koh-Kae" },
  { emoji: "🧋", name: "Thai tea & coffee", note: "ChaTraMue, Nescafé Thai blends, boba kits" },
  { emoji: "💄", name: "Beauty & pharmacy", note: "Snail White, Srichand, Tiger Balm, Yadom" },
  { emoji: "👕", name: "Fashion & streetwear", note: "Muay Thai gear, market finds, Thai brands" },
  { emoji: "🛕", name: "Home & temple goods", note: "Amulets, incense, celadon, benjarong" },
  { emoji: "🛒", name: "Literally anything", note: "If it's sold in Thailand, we can get it" },
];

const reviews = [
  {
    name: "Mika · Tokyo",
    stars: 5,
    text: "Sent a blurry screenshot of green-curry-flavor Lays from a friend's trip. Box of 12 arrived in nine days. Unreal service.",
  },
  {
    name: "Daniel · Berlin",
    stars: 5,
    text: "They found a discontinued Srichand shade three pharmacies deep in Bangkok. The quote was fair and tracking updated daily.",
  },
  {
    name: "Priya · Sydney",
    stars: 5,
    text: "Ordered a full Thai pantry — fish sauce, palm sugar, curry pastes. Packed so well not a single jar moved. Will reorder monthly.",
  },
];

const faqs = [
  {
    q: "What can I order?",
    a: "Anything legally sold in Thailand that your country allows for import: snacks, beauty products, clothing, homeware, collectibles. We'll flag anything restricted (fresh food, batteries, liquids over limits) when we quote.",
  },
  {
    q: "How is the price calculated?",
    a: "One transparent quote: the product's local price + our service fee (from 15%) + actual shipping by weight to your country. You approve before paying — no surprises.",
  },
  {
    q: "How long does shipping take?",
    a: "Express (DHL/FedEx): 3–7 days. Standard (Thailand Post registered air): 10–21 days depending on destination. Every order ships with full tracking.",
  },
  {
    q: "What if my item can't be found?",
    a: "If we can't source an item, that line is removed from your quote — you only ever pay for what we can actually get. If nothing can be sourced, there's no charge at all.",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />

        {/* How it works */}
        <section id="how" className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
          <Reveal>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">
              From Bangkok shelf to your doorstep
              <span className="text-chili">.</span>
            </h2>
            <p className="mt-3 text-lg text-ink-soft max-w-2xl">
              Four steps. One flat quote. Zero guesswork.
            </p>
          </Reveal>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <div className="h-full bg-white border-4 border-night rounded-2xl p-6 shadow-[6px_6px_0_var(--night)] hover:shadow-[3px_3px_0_var(--night)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all">
                  <div
                    className={`${s.color} w-12 h-12 rounded-xl border-2 border-night flex items-center justify-center text-white`}
                  >
                    <s.icon size={24} />
                  </div>
                  <h3 className="mt-4 font-display font-bold text-xl">{s.title}</h3>
                  <p className="mt-2 text-ink-soft leading-relaxed">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="bg-cream-deep border-y-4 border-night">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
            <Reveal>
              <h2 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">
                What people <span className="text-taxi-pink">snap</span>
              </h2>
              <p className="mt-3 text-lg text-ink-soft max-w-2xl">
                The greatest hits — but the form takes anything.
              </p>
            </Reveal>
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((c, i) => (
                <Reveal key={c.name} delay={i * 0.06}>
                  <Link
                    href="/order"
                    className="group flex items-start gap-4 bg-white border-4 border-night rounded-2xl p-5 shadow-[5px_5px_0_var(--mango)] hover:shadow-[2px_2px_0_var(--mango)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all h-full"
                  >
                    <span className="text-4xl group-hover:scale-110 group-hover:-rotate-6 transition-transform inline-block">
                      {c.emoji}
                    </span>
                    <span>
                      <span className="block font-display font-bold text-lg leading-snug">
                        {c.name}
                      </span>
                      <span className="block text-sm text-ink-soft mt-1">{c.note}</span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Night market special-order section */}
        <section className="bg-night text-cream relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-taxi-pink/15 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-mango/10 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <p className="font-display font-bold text-mango tracking-widest uppercase text-sm">
                Special orders · ของหายาก
              </p>
              <h2 className="mt-3 font-display font-extrabold text-4xl sm:text-5xl leading-tight">
                Saw it once in Thailand?
                <br />
                <span className="text-taxi-pink">We&apos;ll hunt it down.</span>
              </h2>
              <p className="mt-5 text-cream/75 text-lg leading-relaxed max-w-xl">
                That snack from a Chiang Mai 7-Eleven. The sauce your grandmother
                swears by. A limited drop from a Bangkok streetwear stall. Our
                team physically goes to markets, malls, and pharmacies to find
                what online shops don&apos;t list.
              </p>
              <Link
                href="/order"
                className="mt-8 inline-block font-display font-bold text-lg bg-mango text-night px-7 py-3.5 rounded-xl border-2 border-cream shadow-[5px_5px_0_var(--taxi-pink)] hover:shadow-[2px_2px_0_var(--taxi-pink)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                Request a special order
              </Link>
            </Reveal>

            <Reveal delay={0.15}>
              {/* animated shipping route */}
              <div className="bg-night-soft border-2 border-cream/20 rounded-2xl p-6">
                <svg viewBox="0 0 420 200" className="w-full" role="img" aria-label="Shipping route from Bangkok to the world">
                  <path
                    d="M40 150 C 120 30, 300 30, 380 130"
                    fill="none"
                    stroke="var(--mango)"
                    strokeWidth="3"
                    strokeDasharray="4 8"
                    strokeLinecap="round"
                    className="animate-route"
                  />
                  <circle cx="40" cy="150" r="10" fill="var(--chili)" stroke="var(--cream)" strokeWidth="3" />
                  <circle cx="380" cy="130" r="10" fill="var(--jade)" stroke="var(--cream)" strokeWidth="3" />
                  <text x="40" y="185" textAnchor="middle" fill="var(--cream)" fontSize="15" fontWeight="bold" fontFamily="var(--font-kanit)">BKK</text>
                  <text x="380" y="168" textAnchor="middle" fill="var(--cream)" fontSize="15" fontWeight="bold" fontFamily="var(--font-kanit)">YOU</text>
                  <text x="210" y="52" textAnchor="middle" fontSize="26">✈️</text>
                </svg>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="bg-night rounded-xl py-3 border border-cream/15">
                    <p className="font-display font-extrabold text-2xl text-mango">24h</p>
                    <p className="text-xs text-cream/60 mt-1">quote turnaround</p>
                  </div>
                  <div className="bg-night rounded-xl py-3 border border-cream/15">
                    <p className="font-display font-extrabold text-2xl text-taxi-pink">190+</p>
                    <p className="text-xs text-cream/60 mt-1">countries served</p>
                  </div>
                  <div className="bg-night rounded-xl py-3 border border-cream/15">
                    <p className="font-display font-extrabold text-2xl text-jade">100%</p>
                    <p className="text-xs text-cream/60 mt-1">tracked shipping</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Reviews */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
          <Reveal>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">
              Loved across <span className="text-jade">time zones</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <Reveal key={r.name} delay={i * 0.08}>
                <figure className="h-full bg-white border-4 border-night rounded-2xl p-6 shadow-[6px_6px_0_var(--jade)]">
                  <div className="flex gap-1 text-mango" aria-label={`${r.stars} out of 5 stars`}>
                    {Array.from({ length: r.stars }).map((_, s) => (
                      <Star key={s} size={18} fill="currentColor" />
                    ))}
                  </div>
                  <blockquote className="mt-4 text-ink leading-relaxed">
                    &ldquo;{r.text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 font-display font-bold flex items-center gap-1.5">
                    <MapPin size={15} className="text-chili" /> {r.name}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-cream-deep border-t-4 border-night">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20">
            <Reveal>
              <h2 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight text-center">
                Questions, answered<span className="text-chili">.</span>
              </h2>
            </Reveal>
            <div className="mt-10 space-y-4">
              {faqs.map((f, i) => (
                <Reveal key={f.q} delay={i * 0.05}>
                  <details className="group bg-white border-4 border-night rounded-2xl overflow-hidden">
                    <summary className="cursor-pointer list-none px-6 py-4 font-display font-bold text-lg flex justify-between items-center gap-4">
                      {f.q}
                      <span className="text-chili text-2xl leading-none transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="px-6 pb-5 text-ink-soft leading-relaxed">{f.a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20 text-center">
          <Reveal>
            <h2 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight leading-tight">
              Stop missing Thailand.
              <br />
              <span className="text-chili">Start snapping.</span>
            </h2>
            <Link
              href="/order"
              className="mt-8 inline-block font-display font-bold text-xl bg-chili text-white px-10 py-4 rounded-xl border-2 border-night shadow-[6px_6px_0_var(--night)] hover:shadow-[2px_2px_0_var(--night)] hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              Start your order — free quote
            </Link>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
