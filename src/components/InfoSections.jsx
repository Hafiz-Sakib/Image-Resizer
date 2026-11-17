import { motion } from 'framer-motion';
import { CircleOff, Eraser, Gift, Gauge, Monitor, ShieldCheck, UserX, Zap, Eye, HardDrive, Upload, SlidersHorizontal, Download } from 'lucide-react';
import { SectionHeading } from './ui.jsx';
import { Spotlight, CountUp } from './motion/kit.jsx';
import PrivacyNotice from './PrivacyNotice.jsx';

const FEATURES = [
  { icon: Gift, title: 'সম্পূর্ণ বিনামূল্যে', desc: 'কোনো ফি, ওয়াটারমার্ক বা লুকানো চার্জ নেই। যতবার খুশি ব্যবহার করুন।' },
  { icon: UserX, title: 'অ্যাকাউন্ট লাগে না', desc: 'সাইন-আপ বা লগইন ছাড়াই সরাসরি কাজ শুরু করুন।' },
  { icon: Zap, title: 'দ্রুত ছবি রিসাইজ', desc: 'আপলোডের অপেক্ষা নেই — আপনার ডিভাইসেই সাথে সাথে কাজ শেষ।' },
  { icon: Gauge, title: 'যত KB লাগে, তত KB-তে কমপ্রেস', desc: '20, 50, 100 KB বা নিজের মতো যেকোনো সীমায় ছবি আনুন, আর আসল সাইজ নিজের চোখেই দেখে নিন।' },
  { icon: ShieldCheck, title: 'নিরাপদ ও প্রাইভেট', desc: 'আপনার ছবি আপনার ডিভাইসের বাইরে যায় না। কিছুই সার্ভারে সেভ হয় না।' },
  { icon: Monitor, title: 'মোবাইল ও কম্পিউটার — দুটোতেই চলে', desc: 'ফোন, ট্যাব বা কম্পিউটার — যেকোনো ডিভাইসের ব্রাউজারে একইভাবে কাজ করে।' },
];

const GUARANTEES = [
  { icon: CircleOff, title: 'সার্ভারে কিছুই যায় না', desc: 'এই টুলে কোনো ব্যাকএন্ড, ডেটাবেস বা ক্লাউড স্টোরেজ নেই।' },
  { icon: HardDrive, title: 'ছবি সেভ হয় না', desc: 'শুধু প্রিসেটের সেটিংস ব্রাউজারে থাকে — ছবি নয়।' },
  { icon: Eraser, title: 'মেমরি ক্লিন', desc: 'ছবি ডিলিট করলে বা পেজ বন্ধ করলে সাময়িক ডেটা মুছে যায়।' },
  { icon: Eye, title: 'নিজেই চেক করে দেখুন', desc: 'ব্রাউজারের Network ট্যাব ওপেন করে দেখুন — ছবি প্রসেসের সময় কোনো আপলোড হয় না।' },
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
        <SectionHeading eyebrow="সুবিধা" title={<span id="why-title">কেন এই টুল ব্যবহার করবেন?</span>} desc="আবেদনের ছবি ও স্বাক্ষর রিসাইজের ঝামেলা কমাতেই এই টুল।" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.li key={f.title} {...reveal(i)}>
              <Spotlight className="card h-full p-5 transition-transform duration-300 hover:-translate-y-1">
                <span className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-brandsoft text-brand">
                  <f.icon size={24} aria-hidden="true" />
                </span>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-1 text-muted">{f.desc}</p>
              </Spotlight>
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
          নোট: ফন্ট ও কোড এই সাইট থেকেই লোড হয় — অন্য কোনো সার্ভারে আপনার ছবি বা তথ্য যায় না।
        </p>
      </div>
    </section>
  );
}

const STEPS = [
  { icon: Upload, title: 'ছবি আপলোড করুন', desc: 'ছবি বা স্বাক্ষর আপলোড করুন, অথবা Ctrl + V দিয়ে পেস্ট করুন।' },
  { icon: SlidersHorizontal, title: 'মাপ ঠিক করুন', desc: 'প্রিসেট সিলেক্ট করুন (ছবি ৩০০×৩০০, স্বাক্ষর ৩০০×৮০) অথবা নিজের মাপ ও KB লিখুন।' },
  { icon: Download, title: 'ডাউনলোড করুন', desc: 'রেডি ছবি দেখে নিয়ে এক ক্লিকে ডাউনলোড করুন। কিছুই সার্ভারে যায় না।' },
];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 py-14 sm:py-20" aria-labelledby="how-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="কীভাবে কাজ করে" title={<span id="how-title">তিন ধাপে কাজ শেষ</span>} desc="অ্যাকাউন্ট বা অপেক্ষা ছাড়াই, সরাসরি ব্রাউজারে।" />
        <ol className="relative grid gap-4 md:grid-cols-3">
          {STEPS.map((st, i) => (
            <motion.li key={st.title} {...reveal(i)} className="relative">
              <Spotlight className="card h-full p-6 text-center">
                <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand text-onbrand shadow-card">
                  <st.icon size={26} aria-hidden="true" />
                </span>
                <p className="text-sm font-semibold text-brand">ধাপ <CountUp to={i + 1} /></p>
                <h3 className="mt-1 text-xl font-semibold">{st.title}</h3>
                <p className="mt-2 text-muted">{st.desc}</p>
              </Spotlight>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
