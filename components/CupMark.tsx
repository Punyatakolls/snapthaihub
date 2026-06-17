// The Snap Thai Hub cha-yen (Thai iced tea) mascot mark — matches the favicon
// and the brand logo. Renders a self-contained SVG; size it with className.
export default function CupMark({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden role="img">
      <rect width="32" height="32" rx="9" fill="#1c1410" />
      <rect x="19.1" y="3.2" width="2.4" height="10.5" rx="1.2" fill="#f0428c" transform="rotate(18 20.3 8.4)" />
      <rect x="8.6" y="8" width="14.8" height="4.2" rx="2.1" fill="#fff3e0" />
      <path d="M10 12.2 H22 L21 26 Q20.8 27.6 19.2 27.6 H12.8 Q11.2 27.6 11 26 Z" fill="#e8500f" />
      <path d="M10.2 12.2 H21.8 L21.3 16 H10.7 Z" fill="#ffd9a8" />
      <circle cx="14.2" cy="19.8" r="1" fill="#3a1c0c" />
      <circle cx="17.8" cy="19.8" r="1" fill="#3a1c0c" />
      <path d="M14.1 21.8 Q16 23.4 17.9 21.8" stroke="#3a1c0c" strokeWidth="1" fill="none" strokeLinecap="round" />
      <circle cx="12.9" cy="21.2" r="0.9" fill="#f0428c" opacity="0.55" />
      <circle cx="19.1" cy="21.2" r="0.9" fill="#f0428c" opacity="0.55" />
    </svg>
  );
}
