import { ShieldCheck } from 'lucide-react';
import Logo from './Logo.jsx';
import { bnYear } from '../utils/format.js';
import { PATHS, navigate } from '../utils/router.js';

const LINKS = [
  { label: 'ছবি রিসাইজ করুন', path: PATHS.photo },
  { label: 'স্বাক্ষর রিসাইজ করুন', path: PATHS.signature },
  { label: 'প্রিসেট', path: PATHS.presets },
  { label: 'সুবিধা ও নিরাপত্তা', path: PATHS.why },
  { label: 'গুরুত্বপূর্ণ লিংক', path: PATHS.importantLinks },
  { label: 'ডেভেলপার', path: PATHS.developer },
];

export default function Footer() {
  return (
    <footer className="border-t-[3px] border-accent bg-surface" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-md text-muted">
            চাকরি ও ভর্তির আবেদনের ছবি আর স্বাক্ষর রিসাইজ ও কমপ্রেস করার জন্য একটি ফ্রি বাংলা টুল। সব কাজ ব্রাউজারেই হয়।
          </p>
          <p className="flex max-w-md items-start gap-2 rounded-xl bg-brandsoft p-3 text-sm text-ink">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
            আপনার ছবি কখনোই সার্ভারে যায় না — সব কাজ আপনার ডিভাইসের ব্রাউজারেই হয়।
          </p>
        </div>
        <nav aria-label="ফুটার মেনু">
          <h2 className="mb-3 text-base font-semibold">দ্রুত লিংক</h2>
          <ul className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.path}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
                    e.preventDefault();
                    navigate(l.path);
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
        <p className="mx-auto max-w-7xl px-4 pt-5 pb-2 text-center text-sm text-muted sm:px-6">
          © {bnYear()} সরকারি চাকরি। সর্বস্বত্ব সংরক্ষিত। প্রিসেটের মাপ শুধু নমুনা — সার্কুলার দেখে সঠিক মাপ ব্যবহার করুন।
        </p>
        <p className="mx-auto max-w-7xl px-4 pb-5 text-center text-sm text-muted sm:px-6">
          Made with <span role="img" aria-label="love">❤️</span> by{' '}
          <a
            href="https://github.com/hafiz-sakib"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand hover:underline"
          >
            Mohammad Hafizur Rahman Sakib
          </a>
        </p>
      </div>
    </footer>
  );
}
