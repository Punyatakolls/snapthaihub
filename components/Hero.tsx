"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Camera, Link2, PackageCheck } from "lucide-react";

const tickerItems = [
  "Mama Tom Yum noodles",
  "Thai milk tea kits",
  "Durian chips",
  "Snail White cream",
  "Lays Hot Chili Squid",
  "Hand-woven Thai silk",
  "Bento squid snacks",
  "Yadom inhalers",
  "Mango sticky rice kits",
  "Muay Thai shorts",
  "Koh-Kae peanuts",
  "Tiger Balm",
];

export default function Hero() {
  const reduce = useReducedMotion();
  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 34 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.21, 0.65, 0.36, 1] as const },
        };

  return (
    <section className="relative overflow-hidden">
      {/* sunburst blocks */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-24 w-72 h-72 rounded-full bg-mango/40 blur-3xl" />
        <div className="absolute top-40 -left-24 w-80 h-80 rounded-full bg-taxi-pink/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-14 pb-10 sm:pt-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <div>
          <motion.p
            {...enter(0)}
            className="inline-block font-display font-bold text-sm bg-night text-mango px-3 py-1.5 rounded-full rotate-[-1.5deg]"
          >
            🇹🇭 Shipping worldwide from Bangkok
          </motion.p>

          <motion.h1
            {...enter(0.08)}
            className="mt-5 font-display font-extrabold leading-[0.95] text-5xl sm:text-6xl lg:text-7xl tracking-tight"
          >
            Craving
            <span className="relative inline-block mx-3 text-chili">
              Thailand?
              <svg
                aria-hidden
                viewBox="0 0 220 14"
                className="absolute -bottom-2 left-0 w-full"
              >
                <path
                  d="M3 10 Q 60 2 110 8 T 217 6"
                  fill="none"
                  stroke="var(--mango)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <br />
            Snap it. <span className="text-taxi-pink">We ship it.</span>
          </motion.h1>

          <motion.p {...enter(0.16)} className="mt-6 text-lg text-ink-soft max-w-xl">
            Any product in Thailand — a 7-Eleven snack, a pharmacy find, a
            night-market treasure. Send us a photo, a screenshot, or a link.
            We buy it, pack it, and ship it to your door anywhere in the world.
          </motion.p>

          <motion.div {...enter(0.24)} className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/order"
              className="font-display font-bold text-lg bg-chili text-white px-7 py-3.5 rounded-xl border-2 border-night shadow-[5px_5px_0_var(--night)] hover:shadow-[2px_2px_0_var(--night)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              Start your order
            </Link>
            <Link
              href="/track"
              className="font-display font-bold text-lg bg-cream text-ink px-7 py-3.5 rounded-xl border-2 border-night shadow-[5px_5px_0_var(--mango)] hover:shadow-[2px_2px_0_var(--mango)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              Track a package
            </Link>
          </motion.div>

          <motion.div {...enter(0.32)} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-ink-soft">
            <span className="flex items-center gap-1.5"><Camera size={16} className="text-chili" /> Photo or screenshot</span>
            <span className="flex items-center gap-1.5"><Link2 size={16} className="text-taxi-pink" /> Any Thai shop link</span>
            <span className="flex items-center gap-1.5"><PackageCheck size={16} className="text-jade" /> Quote within 24h</span>
          </motion.div>
        </div>

        {/* Snap-frame product collage */}
        <motion.div
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, scale: 0.92, rotate: -2 },
                animate: { opacity: 1, scale: 1, rotate: 0 },
                transition: { duration: 0.7, delay: 0.2, ease: [0.21, 0.65, 0.36, 1] as const },
              })}
          className="relative hidden sm:block"
          aria-hidden
        >
          <div className="relative mx-auto w-fit">
            <div className="bg-white border-4 border-night rounded-2xl p-5 shadow-[10px_10px_0_var(--mango)] rotate-2 w-72">
              <div className="bg-cream-deep rounded-lg h-44 flex items-center justify-center text-7xl">
                🍜
              </div>
              <p className="mt-4 font-display font-bold text-lg leading-tight">
                Mama Tom Yum — whole box
              </p>
              <p className="text-ink-soft text-sm mt-1">฿180 · 7-Eleven, Sukhumvit</p>
              <div className="mt-3 inline-flex items-center gap-1.5 bg-jade text-white text-xs font-bold px-2.5 py-1 rounded-full">
                <PackageCheck size={13} /> Sourced &amp; shipped
              </div>
            </div>
            <div className="absolute -left-24 -bottom-16 bg-white border-4 border-night rounded-2xl p-3 shadow-[7px_7px_0_var(--taxi-pink)] -rotate-6 w-40">
              <div className="bg-cream-deep rounded-md h-20 flex items-center justify-center text-4xl">
                🧴
              </div>
              <p className="mt-2 font-display font-bold text-xs leading-snug">
                Snail White serum
              </p>
            </div>
            <div className="absolute -right-10 -top-8 bg-mango border-4 border-night rounded-full px-4 py-2 rotate-6 font-display font-extrabold text-night">
              SNAP!
            </div>
          </div>
        </motion.div>
      </div>

      {/* marquee ticker */}
      <div className="relative bg-night border-y-4 border-night py-3 overflow-hidden">
        <div className="animate-marquee flex w-max gap-8 whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="font-display font-semibold text-cream/90">
              {item} <span className="text-mango mx-2">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
