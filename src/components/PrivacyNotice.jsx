import { ShieldCheck } from 'lucide-react';

export const PRIVACY_TEXT =
  'আপনার ছবির সম্পূর্ণ নিরাপত্তা আমাদের অগ্রাধিকার। আপনার আপলোড করা কোনো ছবি আমাদের সার্ভারে পাঠানো হয় না। ছবির সব ধরনের প্রসেসিং আপনার নিজের ডিভাইসের ব্রাউজারেই সম্পন্ন হয়।';

/** variant: 'compact' (ওয়ার্কস্পেসে ছোট) | 'full' (বড়, গোপনীয়তা সেকশনে) */
export default function PrivacyNotice({ variant = 'compact' }) {
  if (variant === 'full') {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-brand p-6 text-onbrand shadow-pop sm:p-10">
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-onbrand/10" aria-hidden="true" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-onbrand/15">
            <ShieldCheck size={30} aria-hidden="true" />
          </span>
          <p className="text-lg font-medium leading-relaxed sm:text-xl">{PRIVACY_TEXT}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-brand/25 bg-brandsoft p-4 text-sm text-ink">
      <ShieldCheck size={22} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
      <p className="leading-relaxed">
        <strong className="text-brand">১০০% নিরাপদ ও ব্যক্তিগত — </strong>
        {PRIVACY_TEXT}
      </p>
    </div>
  );
}
