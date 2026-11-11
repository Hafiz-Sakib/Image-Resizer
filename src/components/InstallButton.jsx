import { useEffect, useState } from 'react';
import { Download, MoreVertical, PlusSquare, Share, Smartphone, X } from 'lucide-react';
import { LogoMark } from './Logo.jsx';

function Steps({ ios }) {
  const steps = ios
    ? [
        [Share, 'Safari ব্রাউজারের নিচে (বা উপরে) “শেয়ার” বোতাম চাপুন।'],
        [PlusSquare, 'মেনু নিচে স্ক্রল করে “Add to Home Screen” (হোম স্ক্রিনে যোগ করুন) বেছে নিন।'],
        [Smartphone, '“Add” চাপুন — হোম স্ক্রিনে অ্যাপের আইকন চলে আসবে।'],
      ]
    : [
        [MoreVertical, 'ব্রাউজারের ডান পাশের উপরের মেনু (⋮) খুলুন।'],
        [PlusSquare, '“ইনস্টল অ্যাপ” অথবা “Add to Home screen” (হোম স্ক্রিনে যোগ করুন) চাপুন।'],
        [Smartphone, 'নিশ্চিত করলে হোম স্ক্রিনে অ্যাপের আইকন চলে আসবে।'],
      ];
  return (
    <ol className="space-y-3">
      {steps.map(([I, t], i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brandsoft text-brand">
            <I size={20} aria-hidden="true" />
          </span>
          <p className="pt-1.5 text-sm leading-relaxed">
            <span className="sr-only">ধাপ {i + 1}: </span>
            {t}
          </p>
        </li>
      ))}
    </ol>
  );
}

function HelpDialog({ ios, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/50 p-3 sm:place-items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-title"
        onClick={(e) => e.stopPropagation()}
        className="card w-full max-w-md space-y-4 p-5 shadow-pop"
        style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <LogoMark size={44} />
            <h2 id="install-title" className="text-lg font-bold leading-snug">
              হোম স্ক্রিনে ইনস্টল করুন
            </h2>
          </div>
          <button type="button" onClick={onClose} autoFocus aria-label="বন্ধ করুন" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl hover:bg-sunken">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <Steps ios={ios} />
        <button type="button" onClick={onClose} className="btn-primary w-full">
          বুঝেছি
        </button>
      </div>
    </div>
  );
}

/** variant: 'header' (ছোট বোতাম) | 'card' (হোমের ইনস্টল কার্ড) */
export default function InstallButton({ install, variant = 'card' }) {
  const [help, setHelp] = useState(false);
  const { mode, install: doInstall, ios } = install;
  if (!mode) return null;

  const click = async () => {
    if (mode === 'prompt') await doInstall();
    else setHelp(true);
  };
  const dialog = help && <HelpDialog ios={ios} onClose={() => setHelp(false)} />;

  if (variant === 'header') {
    return (
      <>
        <button
          type="button"
          onClick={click}
          data-testid="install-header"
          aria-label="অ্যাপ ইনস্টল করুন"
          className="hidden h-11 items-center gap-2 rounded-xl bg-brand min-[360px]:inline-flex px-3 text-sm font-semibold text-onbrand shadow-card hover:brightness-110 sm:px-4"
        >
          <Download size={18} aria-hidden="true" />
          <span className="hidden sm:inline">অ্যাপ ইনস্টল</span>
        </button>
        {dialog}
      </>
    );
  }

  return (
    <>
      <div data-testid="install-card" className="mt-6 flex items-center gap-4 rounded-2xl border border-brand/25 bg-brandsoft p-4 sm:max-w-xl">
        <LogoMark size={52} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-snug">মোবাইলের হোম স্ক্রিনে অ্যাপ হিসেবে রাখুন</p>
          <p className="text-sm text-muted">এক ট্যাপে খুলুন, প্রথমবারের পর ইন্টারনেট ছাড়াও চলবে।</p>
        </div>
        <button type="button" onClick={click} className="btn-primary shrink-0 px-4">
          <Download size={18} aria-hidden="true" /> ইনস্টল
        </button>
      </div>
      {dialog}
    </>
  );
}
