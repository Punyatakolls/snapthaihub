import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-night text-cream mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 grid gap-10 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-extrabold">
            <span className="text-chili">SNAP</span>
            <span className="text-cream">THAI</span>
            <span className="text-mango">HUB</span>
          </p>
          <p className="mt-3 text-cream/70 max-w-xs">
            Anything from Thailand, shipped to your door. From 7-Eleven shelves
            to night-market stalls — snap it, we&apos;ll get it.
          </p>
          <p className="mt-3 text-mango font-display">
            ส่งตรงจากไทยถึงหน้าบ้านคุณ
          </p>
        </div>
        <div>
          <p className="font-display font-bold text-mango mb-3">Explore</p>
          <ul className="space-y-2 text-cream/80">
            <li><Link href="/order" className="hover:text-mango transition-colors">Start a special order</Link></li>
            <li><Link href="/track" className="hover:text-mango transition-colors">Track your order</Link></li>
            <li><Link href="/#how" className="hover:text-mango transition-colors">How it works</Link></li>
            <li><Link href="/#faq" className="hover:text-mango transition-colors">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-display font-bold text-mango mb-3">Contact</p>
          <ul className="space-y-2 text-cream/80">
            <li>
              <a href="mailto:hello@snapthaihub.com" className="hover:text-mango transition-colors">
                hello@snapthaihub.com
              </a>
            </li>
            <li>LINE: @snapthaihub</li>
            <li>Bangkok, Thailand 🇹🇭</li>
          </ul>
          <div className="mt-4 flex items-center gap-4">
            <a
              href="https://instagram.com/snapthaihub"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Snap Thai Hub on Instagram"
              className="text-cream/80 hover:text-mango transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://facebook.com/snapthaihub"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Snap Thai Hub on Facebook"
              className="text-cream/80 hover:text-mango transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.62.77-1.62 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
              </svg>
            </a>
            <a
              href="https://x.com/snapthaihub"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Snap Thai Hub on X"
              className="text-cream/80 hover:text-mango transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-cream/15 py-4 text-center text-cream/50 text-sm">
        © {new Date().getFullYear()} Snap Thai Hub. All rights reserved.
      </div>
    </footer>
  );
}
