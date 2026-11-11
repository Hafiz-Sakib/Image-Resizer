export function LogoMark({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="shrink-0">
      <rect width="64" height="64" rx="16" fill="rgb(var(--brand))" />
      <circle cx="33" cy="32" r="12" fill="#e5304a" />
      <path
        d="M14 24V14h10M50 24V14H40M14 40v10h10M50 40v10H40"
        fill="none"
        stroke="rgb(var(--onbrand))"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Logo({ compact = false }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark size={compact ? 32 : 40} />
      <span className="min-w-0 leading-tight">
        <span className="block whitespace-nowrap text-base font-bold sm:text-lg">বিডি ইমেজ রিসাইজার</span>
        {!compact && <span className="hidden text-xs text-muted sm:block">ছবি ও স্বাক্ষর রিসাইজ টুল</span>}
      </span>
    </span>
  );
}
