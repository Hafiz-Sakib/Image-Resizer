import { useEffect, useState } from 'react';
import { Download, MoreVertical, PlusSquare, Share, Smartphone, X } from 'lucide-react';
import { LogoMark } from './Logo.jsx';

function Steps({ ios, mobile }) {
  const steps = ios
    ? [
        [Share, 'Safari ব্রাউজারের নিচে (বা উপরে) “শেয়ার” বাটনে চাপ দিন।'],
        [PlusSquare, 'মেনু নিচে স্ক্রল করে “Add to Home Screen” সিলেক্ট করুন।'],
        [Smartphone, '“Add” চাপুন — হোম স্ক্রিনে অ্যাপের আইকন চলে আসবে।'],
      ]
    : !mobile
    ? [
        [Download, 'অ্যাড্রেস বারের ডান পাশে ইনস্টল আইকনে চাপ দিন — না দেখলে ব্রাউজারের মেনু (⋮) ওপেন করুন।'],
        [PlusSquare, '“Install app” (Edge-এ “Apps → Install this site as an app”) বেছে নিন।'],
        [Smartphone, 'কনফার্ম করলে অ্যাপটি আলাদা উইন্ডোতে ও ডেস্কটপে চলে আসবে।'],
      ]
    : [
        [MoreVertical, 'ব্রাউজারের ডান পাশের উপরের মেনু (⋮) ওপেন করুন।'],
        [PlusSquare, '“Install app” অথবা “Add to Home screen” চাপুন।'],
        [Smartphone, 'কনফার্ম করলে হোম স্ক্রিনে অ্যাপের আইকন চলে আসবে।'],
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

function HelpDialog({ ios, mobile, onClose }) {
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
              {mobile ? 'হোম স্ক্রিনে ইনস্টল করুন' : 'অ্যাপ ইনস্টল করুন'}
            </h2>
          </div>
          <button type="button" onClick={onClose} autoFocus aria-label="বন্ধ করুন" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl hover:bg-sunken">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <Steps ios={ios} mobile={mobile} />
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
  // হেডারের বোতাম ইনস্টল না থাকলে সব ডিভাইসে দেখায়; কার্ড শুধু মোবাইলে/সরাসরি প্রম্পট থাকলে
  const mode = variant === 'header' ? install.headerMode : install.mode;
  const { install: doInstall, ios, mobile } = install;
  if (!mode) return null;

  const click = async () => {
    if (mode === 'prompt') await doInstall();
    else setHelp(true);
  };
  const dialog = help && <HelpDialog ios={ios} mobile={mobile} onClose={() => setHelp(false)} />;

  if (variant === 'header') {
    return (
      <>
        <button
          type="button"
          onClick={click}
          data-testid="install-header"
          aria-label="অ্যাপ ইনস্টল করুন"
          className="hidden h-7 items-center gap-1.5 rounded-lg bg-brand min-[360px]:inline-flex shrink-0 whitespace-nowrap px-2.5 text-xs font-semibold leading-none text-onbrand shadow-card hover:brightness-110 min-[400px]:px-3 min-[400px]:text-[13px] sm:px-3.5"
        >
          <Download size={15} aria-hidden="true" />
          <span>অ্যাপ ইনস্টল</span>
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
          <p className="text-sm text-muted">এক ট্যাপে ওপেন করুন, প্রথমবারের পর নেট ছাড়াও চলবে।</p>
        </div>
        <button type="button" onClick={click} className="btn-primary shrink-0 px-4">
          <Download size={18} aria-hidden="true" /> ইনস্টল
        </button>
      </div>
      {dialog}
    </>
  );
}
