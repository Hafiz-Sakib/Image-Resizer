import { motion } from 'framer-motion';
import { CircleOff, Cpu, Eraser, Gift, Gauge, Monitor, ShieldCheck, Sparkles, UserX, Zap, Eye, HardDrive } from 'lucide-react';
import { SectionHeading } from './ui.jsx';
import PrivacyNotice from './PrivacyNotice.jsx';

const FEATURES = [
  { icon: Gift, title: 'সম্পূর্ণ বিনামূল্যে', desc: 'কোনো ফি, ওয়াটারমার্ক বা লুকানো চার্জ নেই। যতবার খুশি ব্যবহার করুন।' },
  { icon: UserX, title: 'কোনো অ্যাকাউন্ট প্রয়োজন নেই', desc: 'সাইন-আপ বা লগইন ছাড়াই সরাসরি ছবি তৈরি শুরু করুন।' },
  { icon: Zap, title: 'দ্রুত ছবি রিসাইজ', desc: 'ইন্টারনেটে আপলোডের অপেক্ষা নেই — আপনার ডিভাইসেই মুহূর্তে কাজ শেষ।' },
  { icon: Gauge, title: 'নির্দিষ্ট KB অনুযায়ী কমপ্রেস', desc: '20, 50, 100 KB বা নিজের পছন্দের সীমায় ছবি আনুন, আর প্রকৃত সাইজ নিজ চোখে দেখুন।' },
  { icon: ShieldCheck, title: 'নিরাপদ ও ব্যক্তিগত', desc: 'আপনার ছবি আপনার ডিভাইসের বাইরে যায় না। কিছুই সার্ভারে সংরক্ষিত হয় না।' },
  { icon: Monitor, title: 'মোবাইল ও কম্পিউটারে ব্যবহারযোগ্য', desc: 'ফোন, ট্যাবলেট বা কম্পিউটার — যেকোনো ডিভাইসের ব্রাউজারে সমানভাবে কাজ করে।' },
];

const GUARANTEES = [
  { icon: CircleOff, title: 'সার্ভারে কিছুই যায় না', desc: 'এই টুলে কোনো ব্যাকএন্ড, ডেটাবেস বা ক্লাউড স্টোরেজ নেই।' },
  { icon: HardDrive, title: 'ছবি সংরক্ষিত হয় না', desc: 'শুধু প্রিসেটের সেটিংস ব্রাউজারে থাকে — ছবি নয়।' },
  { icon: Eraser, title: 'মেমরি পরিষ্কার', desc: 'ছবি মুছলে বা পেজ বন্ধ করলে সাময়িক ডেটা মুছে যায়।' },
  { icon: Eye, title: 'নিজে যাচাই করুন', desc: 'ব্রাউজারের Network ট্যাব খুলে দেখুন — ছবি প্রসেসের সময় কোনো আপলোড নেই।' },
];

function reveal(i = 0) {
  return {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.45, delay: Math.min(i, 5) * 0.06 },
  };
}

export function WhyUs() {
  return (
    <section id="why" className="scroll-mt-20 border-y border-line bg-sunken/40 py-14 sm:py-20" aria-labelledby="why-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="সুবিধা" title={<span id="why-title">কেন এই টুল ব্যবহার করবেন?</span>} desc="চাকরির আবেদনের ছবি ও স্বাক্ষর রিসাইজের ঝামেলা কমাতেই এই টুল।" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.li key={f.title} {...reveal(i)} className="card p-5">
              <span className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-brandsoft text-brand">
                <f.icon size={24} aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-muted">{f.desc}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function PrivacySection() {
  return (
    <section id="privacy" className="scroll-mt-20 border-t border-line bg-sunken/40 py-14 sm:py-20" aria-labelledby="privacy-title">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading eyebrow="গোপনীয়তা" title={<span id="privacy-title">গোপনীয়তা ও নিরাপত্তা</span>} desc="আপনার ছবি আপনার ডিভাইসের বাইরে কখনোই যায় না।" />
        <PrivacyNotice variant="full" />
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {GUARANTEES.map((g, i) => (
            <motion.li key={g.title} {...reveal(i)} className="card flex gap-4 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brandsoft text-brand">
                <g.icon size={22} aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold">{g.title}</h3>
                <p className="text-sm text-muted">{g.desc}</p>
              </div>
            </motion.li>
          ))}
        </ul>
        <p className="mt-5 text-center text-xs text-muted">
          নোট: পেজের ফন্ট ও কোড এই সাইট থেকেই লোড হয় — কোনো তৃতীয় পক্ষের সার্ভারে আপনার ছবি বা তথ্য পাঠানো হয় না।
        </p>
      </div>
    </section>
  );
}
