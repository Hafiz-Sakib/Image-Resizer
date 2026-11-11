import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, Mail } from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import useTheme from '../hooks/useTheme.js';
import useInstall from '../hooks/useInstall.js';
import { PATHS, navigate } from '../utils/router.js';
import photo from '../assets/developer.jpg';

// লুসিডে ব্র্যান্ড আইকন নেই, তাই নিজস্ব SVG পাথ
const PATH = {
  github: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22',
  linkedin: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 110 4 2 2 0 010-4z',
  facebook: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
  x: 'M4 4l16 16M20 4L4 20',
};
const brand = (d) =>
  function BrandIcon({ size = 18 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={d} />
      </svg>
    );
  };
const Github = brand(PATH.github);
const Linkedin = brand(PATH.linkedin);
const Facebook = brand(PATH.facebook);
const Twitter = brand(PATH.x);

// ডেভেলপার পরিচিতি — সম্পূর্ণ বাংলায়
const NAME = 'মোহাম্মদ হাফিজুর রহমান সাকিব';
const EMAIL = 'hafizsakib5@gmail.com';
const MAIL_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`;

const LINKS = [
  ['পোর্টফোলিও', 'https://hafizsakib.vercel.app/', Globe],
  ['গিটহাব', 'https://github.com/Hafiz-Sakib', Github],
  ['লিংকডইন', 'https://linkedin.com/in/hafizsakib', Linkedin],
  ['ফেসবুক', 'https://www.facebook.com/Sakib.1118/', Facebook],
  ['ইমেইল', MAIL_URL, Mail],
  ['টুইটার / এক্স', 'https://twitter.com/hafiz_sakib1', Twitter],
];

const BIO = [
  'আসসালামু আলাইকুম। আমি সাকিব — একজন প্রযুক্তিপ্রেমী ও শেখার প্রতি আগ্রহী মানুষ। কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং নিয়ে পড়াশোনার পাশাপাশি সফটওয়্যার ও ওয়েব ডেভেলপমেন্ট, প্রোগ্রামিং, কৃত্রিম বুদ্ধিমত্তা (AI) ও মেশিন লার্নিং নিয়ে কাজ করতে ভালোবাসি। নতুন কিছু শেখা আর বাস্তব সমস্যার সমাধান করাই আমার পছন্দ।',
  'এখন প্রযুক্তির পাশাপাশি গাড়ি চালানোও শিখছি — ড্রাইভিংয়ের নিয়মকানুন ও বাস্তব প্রশিক্ষণের মাধ্যমে নিজেকে একজন দক্ষ ও দায়িত্বশীল চালক হিসেবে গড়ে তোলার চেষ্টা করছি।',
  'আমার বিশ্বাস, সফল হতে স্বপ্নের সঙ্গে চাই নিয়মিত পরিশ্রম, ধৈর্য আর শেখার মানসিকতা। ভবিষ্যতে একজন দক্ষ প্রযুক্তিবিদ হওয়ার পাশাপাশি একজন ভালো মানুষ হিসেবেও নিজেকে প্রতিষ্ঠিত করাই আমার লক্ষ্য।',
];

const INTERESTS = [
  ['💻', 'সফটওয়্যার ডেভেলপমেন্ট', 'সফটওয়্যার বিল্ড করতে ভালোবাসি, সফটওয়্যার বানানো এনজয় করি'],
  ['🧮', 'ম্যাথ সলভ', 'ম্যাথমেটিক্যাল প্রবলেম নিয়ে ভাবতে ভালো লাগে এবং সলভ করতে ভালোবাসি'],
  ['👨‍🏫', 'টিচিং', 'স্টুডেন্ট পড়াতে ভালো লাগে, ফিজিক্স, কেমিস্ট্রি এবং ICT প্রিয় সাবজেক্ট'],
  ['⚽', 'ফুটবল', 'ফুটবল খেলতে ও দেখতে ভালোবাসি, প্রিয় দল রিয়াল মাদ্রিদ'],
  ['🏊', 'সাঁতার', 'সাঁতার কাটতে ভালোবাসি, পানিতে নামলে মন ভালো হয়ে যায়'],
  ['🧭', 'ঘুরাঘুরি', 'নতুন নতুন জায়গায় ঘুরতে যেতে ভালোবাসি'],
];

const pill =
  'inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-full font-semibold transition';

export default function Developer() {
  const { theme, toggle } = useTheme();
  const install = useInstall();
  const home = (scroll, tool) => navigate(PATHS.home, { scroll, tool });

  useEffect(() => {
    const prev = document.title;
    document.title = 'সরকারি চাকরি';
    window.scrollTo({ top: 0 });
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <>
      <Header
        theme={theme}
        onToggleTheme={toggle}
        onTool={(mode) => home('workspace', mode)}
        onGoto={(id) => home(id)}
        install={install}
        currentPath={PATHS.developer}
      />
      <main id="main">
        {/* শিরোনাম ব্যান্ড */}
        <section className="relative overflow-hidden bg-brand text-onbrand">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-accent/70" aria-hidden="true" />
          <div className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 sm:pb-28">
            <nav aria-label="ব্রেডক্রাম্ব" className="text-sm opacity-90">
              <a
                href="/"
                onClick={(e) => (e.preventDefault(), navigate(PATHS.home))}
                className="inline-flex min-h-[2.75rem] items-center underline-offset-4 hover:underline"
              >
                হোম
              </a>
              <span className="mx-2" aria-hidden="true">
                /
              </span>
              <span className="font-semibold">ডেভেলপার</span>
            </nav>
            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">ডেভেলপার পরিচিতি</h1>
            <p className="mt-2 font-medium opacity-90">এই ওয়েবসাইটের পেছনের মানুষ</p>
          </div>
        </section>

        <div className="mx-auto -mt-16 max-w-6xl space-y-10 px-4 pb-16 sm:-mt-20 sm:px-6">
          {/* প্রোফাইল কার্ড */}
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="card relative grid gap-6 p-5 shadow-pop sm:p-8 md:grid-cols-[14rem_1fr] md:items-center md:gap-9"
          >
            <figure className="mx-auto text-center md:mx-0">
              <div className="rounded-full bg-gradient-to-br from-brand via-emerald-500 to-accent p-1.5 shadow-xl">
                <img
                  src={photo}
                  width={640}
                  height={640}
                  alt={`${NAME} — ডেভেলপার`}
                  decoding="async"
                  className="h-44 w-44 rounded-full border-4 border-surface object-cover sm:h-52 sm:w-52 md:h-56 md:w-56"
                />
              </div>
              <figcaption className="mt-3 text-sm font-bold text-accent">ডেভেলপার</figcaption>
            </figure>

            <div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h2 className="text-2xl font-bold sm:text-3xl">{NAME}</h2>
                <span className="rounded-full border border-brand/30 bg-brandsoft px-3 py-1 text-xs font-bold text-brand">
                  একসাথে কাজ করতে প্রস্তুত
                </span>
              </div>
              <p className="mt-1 text-lg font-semibold text-brand">ফুল স্ট্যাক ডেভেলপার · Chattogram, বাংলাদেশ 🇧🇩</p>
              <a href={`mailto:${EMAIL}`} className="inline-flex min-h-[2.75rem] items-center break-all text-sm text-muted hover:text-brand">
                {EMAIL}
              </a>

              <div className="mt-2 space-y-3 leading-[1.9]">
                {BIO.map((t) => (
                  <p key={t}>{t}</p>
                ))}
              </div>
              <p className="mt-4 rounded-2xl border border-brand/25 bg-brandsoft px-4 py-3 font-bold leading-relaxed">
                “নিজেকে প্রতিনিয়ত ছাড়িয়ে যাওয়াই আমার কাছে সবচেয়ে বড় অর্জন।”
              </p>

              <ul className="mt-4 flex flex-wrap gap-2">
                {LINKS.map(([label, href, I]) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${pill} border border-line bg-surface px-4 text-sm hover:border-brand hover:text-brand hover:shadow-md`}
                    >
                      <I size={18} aria-hidden="true" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>

          {/* আগ্রহের বিষয় */}
          <section aria-labelledby="dev-interests">
            <h2 id="dev-interests" className="flex items-center gap-3 text-2xl font-bold">
              <span className="h-7 w-1.5 rounded-full bg-gradient-to-b from-brand to-accent" aria-hidden="true" />
              আগ্রহের বিষয়
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {INTERESTS.map(([emoji, t, d], i) => (
                <motion.li
                  key={t}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ delay: Math.min(i, 5) * 0.05 }}
                  className="card flex items-start gap-3.5 p-4"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brandsoft text-2xl" aria-hidden="true">
                    {emoji}
                  </span>
                  <div>
                    <h3 className="font-bold leading-snug">{t}</h3>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted">{d}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </section>

          {/* আমন্ত্রণ */}
          <section aria-labelledby="dev-cta" className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-emerald-800 p-6 text-center text-white sm:p-10">
            <div className="absolute -right-10 -top-16 -z-10 h-56 w-56 rounded-full bg-emerald-300/25 blur-3xl" aria-hidden="true" />
            <h2 id="dev-cta" className="text-2xl font-bold sm:text-3xl">
              আসুন, একসাথে কিছু বানাই
            </h2>
            <p className="mx-auto mt-2 max-w-xl leading-relaxed text-white/90">
              নতুন কোনো আইডিয়া, ফ্রিল্যান্স কাজ বা ওপেন সোর্স প্রজেক্ট — যেকোনো কিছু নিয়েই কথা বলতে পারেন। আপনার বার্তার অপেক্ষায় থাকলাম।
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href={MAIL_URL} target="_blank" rel="noopener noreferrer" className={`${pill} bg-white px-6 text-emerald-900 hover:bg-emerald-50`}>
                <Mail size={18} aria-hidden="true" /> ইমেইল করুন
              </a>
              <a href="https://github.com/Hafiz-Sakib" target="_blank" rel="noopener noreferrer" className={`${pill} border border-white/50 px-6 hover:bg-white/10`}>
                <Github size={18} aria-hidden="true" /> গিটহাব প্রোফাইল
              </a>
              <a href="https://hafizsakib.vercel.app/" target="_blank" rel="noopener noreferrer" className={`${pill} border border-white/50 px-6 hover:bg-white/10`}>
                <Globe size={18} aria-hidden="true" /> পোর্টফোলিও
              </a>
            </div>
          </section>

          <button type="button" onClick={() => navigate(PATHS.home)} className="btn-ghost px-5">
            <ArrowLeft size={18} aria-hidden="true" /> হোমে ফিরে যান
          </button>
        </div>
      </main>
      <Footer onTool={(mode) => home('workspace', mode)} onGoto={(id) => home(id)} onPage={navigate} />
    </>
  );
}
