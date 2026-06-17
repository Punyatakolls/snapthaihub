"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import CupMark from "./CupMark";

const links = [
  { href: "/order", label: "Start an order" },
  { href: "/track", label: "Track" },
  { href: "/#how", label: "How it works" },
  { href: "/#faq", label: "FAQ" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur border-b-4 border-night">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight">
          <CupMark className="w-9 h-9 shrink-0" />
          <span>
            <span className="text-chili">SNAP</span>
            <span className="text-ink">THAI</span>
            <span className="bg-mango px-1.5 py-0.5 ml-1 rotate-2 inline-block rounded-sm border-2 border-night">
              HUB
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-medium transition-colors hover:text-chili ${
                pathname === l.href ? "text-chili" : "text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/order"
            className="font-display font-bold bg-chili text-white px-4 py-2 rounded-lg border-2 border-night shadow-[3px_3px_0_var(--night)] hover:shadow-[1px_1px_0_var(--night)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            Snap it →
          </Link>
        </nav>

        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t-2 border-night bg-cream px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-display font-semibold text-lg"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
