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
        </div>
      </div>
      <div className="border-t border-cream/15 py-4 text-center text-cream/50 text-sm">
        © {new Date().getFullYear()} Snap Thai Hub. All rights reserved.
      </div>
    </footer>
  );
}
