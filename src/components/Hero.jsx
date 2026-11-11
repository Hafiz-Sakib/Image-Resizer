import { motion } from 'framer-motion';
import InstallButton from './InstallButton.jsx';
import samplePhoto from '../assets/sample-portrait.jpg';
import { ArrowRight, Check, Gift, PlayCircle, ShieldCheck, UserX, PenLine, Repeat } from 'lucide-react';

const TRUST = [
  { icon: Gift, text: 'সম্পূর্ণ বিনামূল্যে' },
  { icon: UserX, text: 'অ্যাকাউন্ট লাগে না' },
  { icon: ShieldCheck, text: 'ছবি ডিভাইসেই থাকে' },
];

function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[34rem]" aria-hidden="true">
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-brand/20 via-transparent to-accent/20 blur-2xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="card p-4 sm:p-6"
      >
        <div className="mb-4 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-warn/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand/70" />
          <span className="ml-3 text-xs text-muted">ছবি রিসাইজ — মুহূর্তেই</span>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sunken">
              <img src={samplePhoto} alt="" className="h-full w-full object-cover object-top" loading="eager" decoding="async" />
            </div>
            <p className="mt-2 text-center text-xs font-medium text-muted">মূল ছবি</p>
            <p className="text-center text-[0.7rem] text-muted">4000 × 3000 px · 3.2 MB</p>
          </div>

          <motion.div
            animate={{ x: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="grid h-10 w-10 place-items-center rounded-full bg-brand text-onbrand"
          >
            <ArrowRight size={20} />
          </motion.div>

          <div>
            <div className="relative mx-auto aspect-square w-4/5 rounded-xl border-2 border-brand bg-brandsoft">
              <img src={samplePhoto} alt="" className="h-full w-full rounded-[0.65rem] object-cover" loading="eager" decoding="async" />
              <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-brand text-onbrand">
                <Check size={14} strokeWidth={3} />
              </span>
            </div>
            <p className="mt-2 text-center text-xs font-medium text-brand">প্রস্তুত ছবি</p>
            <p className="text-center text-[0.7rem] text-muted">300 × 300 px · 48 KB</p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-xl border border-dashed border-line bg-sunken/60 p-3">
          <PenLine size={20} className="shrink-0 text-accent" />
          <svg viewBox="0 0 200 40" className="h-9 flex-1 text-ink" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <motion.path
              d="M6 28 C16 2 28 4 26 22 S40 36 48 18 S62 10 60 26 S78 34 88 16 S104 8 102 24 S120 34 132 14 S150 10 150 26 S172 30 194 12"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.6, repeat: Infinity, repeatDelay: 2.5 }}
            />
          </svg>
          <span className="shrink-0 text-right text-[0.7rem] leading-tight text-muted">
            স্বাক্ষর
            <br />
            300 × 80 px · 22 KB
          </span>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="absolute -right-2 -top-5 flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-xs font-semibold shadow-card sm:-right-6"
      >
        <Repeat size={14} className="text-brand" /> JPG · PNG
      </motion.div>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
        className="absolute -bottom-5 -left-2 flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-xs font-semibold shadow-card sm:-left-6"
      >
        <ShieldCheck size={14} className="text-brand" /> আপলোড নেই, ব্রাউজারেই প্রসেস
      </motion.div>
    </div>
  );
}

export default function Hero({ onStart, onHow, install }) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(circle at 12% 18%, rgb(var(--brand) / .14), transparent 45%), radial-gradient(circle at 88% 70%, rgb(var(--accent) / .12), transparent 40%)',
        }}
        aria-hidden="true"
      />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-8 lg:py-24">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brandsoft px-3.5 py-1.5 text-sm font-medium text-brand"
          >
            <ShieldCheck size={16} aria-hidden="true" /> ১০০% ব্রাউজারে — কোনো ছবি সার্ভারে যায় না
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-[2rem] font-bold leading-[1.3] sm:text-5xl sm:leading-[1.3] lg:text-[3.4rem]"
          >
            চাকরির আবেদনের{' '}
            <span className="bg-gradient-to-r from-brand to-emerald-500 bg-clip-text text-transparent dark:to-emerald-300">
              ছবি ও স্বাক্ষর
            </span>{' '}
            রিসাইজ করুন সহজেই
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-5 max-w-xl text-base text-muted sm:text-lg"
          >
            সরকারি চাকরি, বিসিএস, ব্যাংক নিয়োগসহ বিভিন্ন অনলাইন আবেদনের জন্য প্রয়োজনীয় Pixel ও KB অনুযায়ী ছবি রিসাইজ এবং
            কমপ্রেস করুন মুহূর্তেই।
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <button type="button" onClick={onStart} className="btn-primary px-7 text-lg">
              ছবি রিসাইজ শুরু করুন <ArrowRight size={20} aria-hidden="true" />
            </button>
            <button type="button" onClick={onHow} className="btn-ghost px-7 text-lg">
              <PlayCircle size={20} aria-hidden="true" /> কীভাবে কাজ করে দেখুন
            </button>
          </motion.div>
          <InstallButton install={install} variant="card" />
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            {TRUST.map(({ icon: I, text }) => (
              <li key={text} className="flex items-center gap-2">
                <I size={16} className="text-brand" aria-hidden="true" /> {text}
              </li>
            ))}
          </ul>
        </div>

        <HeroIllustration />
      </div>
    </section>
  );
}
