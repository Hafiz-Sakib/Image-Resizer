import { ShieldCheck } from 'lucide-react';
import Logo from './Logo.jsx';
import { bnYear } from '../utils/format.js';
import { navigate } from '../utils/router.js';

const LINKS = [
  { href: 'workspace', label: 'ছবি রিসাইজ করুন', tool: 'photo' },
  { href: 'workspace', label: 'স্বাক্ষর রিসাইজ করুন', tool: 'signature' },
  { href: 'presets', label: 'প্রিসেট' },
  { href: 'how', label: 'কীভাবে ব্যবহার করবেন' },
  { href: 'privacy', label: 'গোপনীয়তা ও নিরাপত্তা' },
  { href: 'developer', label: 'ডেভেলপার', path: '/developer' },
];

export default function Footer({ onTool, onGoto, onPage = navigate }) {
  return (
    <footer className="border-t-[3px] border-accent bg-surface" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-md text-muted">
            বাংলাদেশের চাকরি ও ভর্তির আবেদনের জন্য ছবি ও স্বাক্ষর রিসাইজ এবং কমপ্রেস করার একটি বিনামূল্যের, ব্রাউজারভিত্তিক বাংলা টুল।
          </p>
          <p className="flex max-w-md items-start gap-2 rounded-xl bg-brandsoft p-3 text-sm text-ink">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
            আপনার ছবি কখনোই সার্ভারে পাঠানো হয় না — সব প্রসেসিং আপনার ডিভাইসের ব্রাউজারেই হয়।
          </p>
        </div>
        <nav aria-label="ফুটার মেনু">
          <h2 className="mb-3 text-base font-semibold">দ্রুত লিংক</h2>
          <ul className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.path || `#${l.href}`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (l.path) onPage(l.path);
                    else if (l.tool) onTool(l.tool);
                    else onGoto(l.href);
                  }}
                  className="flex min-h-[2.75rem] items-center text-muted transition hover:text-brand"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-sm text-muted sm:px-6">
          © {bnYear()} বিডি ইমেজ রিসাইজার। সর্বস্বত্ব সংরক্ষিত। প্রিসেটের মাপ কেবল উদাহরণ — আবেদনের বিজ্ঞপ্তি অনুযায়ী সঠিক মাপ ব্যবহার করুন।
        </p>
      </div>
    </footer>
  );
}
