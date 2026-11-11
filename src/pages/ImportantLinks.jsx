import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Copy, ExternalLink, Image as ImageIcon, Newspaper, Puzzle, Search, Send, ShieldAlert, X } from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import useTheme from '../hooks/useTheme.js';
import useInstall from '../hooks/useInstall.js';
import { PATHS, navigate } from '../utils/router.js';
import { IMPORTANT_LINKS, LINK_CATEGORIES } from '../data/links.js';

const ICONS = { newspaper: Newspaper, send: Send, puzzle: Puzzle };

const STEPS = [
  ['১', 'সার্কুলার খুঁজুন', 'BD Govt Job-এ চলমান নিয়োগ ও শেষ তারিখ দেখে বিজ্ঞপ্তি পড়ুন।'],
  ['২', 'ছবি ও স্বাক্ষর তৈরি করুন', 'বিজ্ঞপ্তির মাপ ও KB অনুযায়ী এই সাইটেই রিসাইজ ও কমপ্রেস করুন।'],
  ['৩', 'অনলাইনে আবেদন করুন', 'টেলিটক পোর্টালে আবেদন করুন; চাইলে ApplyMama দিয়ে ফর্ম দ্রুত পূরণ করুন।'],
];

const pill = 'inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-full font-semibold transition';

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // পুরনো ব্রাউজার/অনিরাপদ কনটেক্সটের জন্য বিকল্প উপায়
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

function LinkCard({ link, index }) {
  const [copied, setCopied] = useState(false);
  const Icon = ICONS[link.icon] || ExternalLink;
  const host = new URL(link.url).hostname.replace(/^www\./, '');

  const onCopy = async () => {
    if (await copyText(link.url)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: Math.min(index, 4) * 0.05 }}
      className="card group flex flex-col gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-pop sm:p-6"
    >
      <div className="flex items-start gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brandsoft text-brand transition group-hover:bg-brand group-hover:text-onbrand">
          <Icon size={28} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <span className="rounded-full border border-brand/30 bg-brandsoft px-2.5 py-0.5 text-xs font-bold text-brand">{link.badge}</span>
          <h3 className="mt-1.5 text-xl font-bold leading-snug">{link.title}</h3>
          <p className="break-all text-xs text-muted">{host}</p>
        </div>
      </div>

      <p className="font-medium leading-relaxed">{link.tagline}</p>

      <div>
        <h4 className="mb-1.5 text-sm font-bold text-brand">এখানে কী পাবেন</h4>
        <ul className="space-y-1.5 text-sm leading-relaxed">
          {link.features.map((f) => (
            <li key={f} className="flex gap-2">
              <Check size={16} className="mt-1 shrink-0 text-ok" aria-hidden="true" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {link.shortcuts.length > 1 && (
        <div>
          <h4 className="mb-1.5 text-sm font-bold text-brand">দ্রুত শর্টকাট</h4>
          <ul className="flex flex-wrap gap-2">
            {link.shortcuts.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[2.25rem] items-center gap-1 rounded-full border border-line bg-surface px-3 text-sm transition hover:border-brand hover:bg-brandsoft hover:text-brand"
                >
                  {s.label}
                  <ArrowRight size={14} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="flex items-start gap-2 rounded-xl bg-warnsoft p-3 text-xs leading-relaxed text-ink">
        <ShieldAlert size={16} className="mt-0.5 shrink-0 text-warn" aria-hidden="true" />
        {link.note}
      </p>

      <div className="mt-auto flex flex-wrap gap-2 pt-1">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${pill} flex-1 bg-brand px-5 text-onbrand hover:opacity-90`}
        >
          <ExternalLink size={18} aria-hidden="true" /> খুলুন
        </a>
        <button type="button" onClick={onCopy} className={`${pill} border border-line bg-surface px-4 text-sm hover:border-brand hover:text-brand`} aria-live="polite">
          {copied ? <Check size={18} className="text-ok" aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
          {copied ? 'কপি হয়েছে' : 'লিংক কপি'}
        </button>
      </div>
    </motion.li>
  );
}

export default function ImportantLinks() {
  const { theme, toggle } = useTheme();
  const install = useInstall();
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  const home = (scroll, tool) => navigate(PATHS.home, { scroll, tool });

  useEffect(() => {
    const prev = document.title;
    document.title = 'গুরুত্বপূর্ণ লিংক — সরকারি চাকরি';
    window.scrollTo({ top: 0 });
    return () => {
      document.title = prev;
    };
  }, []);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return IMPORTANT_LINKS.filter((l) => {
      if (cat !== 'all' && l.category !== cat) return false;
      if (!t) return true;
      const hay = [l.title, l.badge, l.tagline, l.url, ...l.features, ...l.shortcuts.map((s) => s.label)].join(' ').toLowerCase();
      return hay.includes(t);
    });
  }, [cat, q]);

  return (
    <>
      <Header
        theme={theme}
        onToggleTheme={toggle}
        onTool={(mode) => home('workspace', mode)}
        onGoto={(id) => home(id)}
        install={install}
        currentPath={PATHS.importantLinks}
      />
      <main id="main">
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
              <span className="mx-2" aria-hidden="true">/</span>
              <span className="font-semibold">গুরুত্বপূর্ণ লিংক</span>
            </nav>
            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">সরকারি চাকরির গুরুত্বপূর্ণ লিংক</h1>
            <p className="mt-2 max-w-2xl font-medium leading-relaxed opacity-90">
              সার্কুলার দেখা থেকে আবেদন করা পর্যন্ত — দরকারি সব ওয়েবসাইট ও টুলের শর্টকাট এক জায়গায়।
            </p>
          </div>
        </section>

        <div className="mx-auto -mt-16 max-w-6xl space-y-10 px-4 pb-16 sm:-mt-20 sm:px-6">
          {/* সার্চ ও ফিল্টার */}
          <div className="card flex flex-col gap-3 p-4 shadow-pop sm:flex-row sm:items-center sm:p-5">
            <label className="relative block flex-1">
              <span className="sr-only">লিংক খুঁজুন</span>
              <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="লিংক বা বিষয় খুঁজুন (যেমন: টেলিটক, সার্কুলার)"
                className="min-h-[2.75rem] w-full rounded-xl border border-line bg-surface pl-10 pr-10 text-base outline-none transition focus:border-brand"
              />
              {q && (
                <button type="button" onClick={() => setQ('')} aria-label="খোঁজা মুছুন" className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-sunken">
                  <X size={16} aria-hidden="true" />
                </button>
              )}
            </label>
            <div role="group" aria-label="ক্যাটাগরি" className="flex flex-wrap gap-2">
              {LINK_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={cat === c.id}
                  onClick={() => setCat(c.id)}
                  className={`min-h-[2.5rem] rounded-full border px-4 text-sm font-semibold transition ${cat === c.id ? 'border-brand bg-brand text-onbrand' : 'border-line bg-surface hover:border-brand hover:text-brand'}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* লিংক কার্ড */}
          <section aria-labelledby="links-title">
            <h2 id="links-title" className="flex items-center gap-3 text-2xl font-bold">
              <span className="h-7 w-1.5 rounded-full bg-gradient-to-b from-brand to-accent" aria-hidden="true" />
              দরকারি ওয়েবসাইট ও টুল
            </h2>
            <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {list.map((l, i) => (
                  <LinkCard key={l.id} link={l} index={i} />
                ))}
              </AnimatePresence>
            </ul>
            {list.length === 0 && (
              <p className="card mt-4 p-6 text-center text-muted">
                কোনো লিংক পাওয়া যায়নি।{' '}
                <button type="button" onClick={() => (setQ(''), setCat('all'))} className="font-semibold text-brand underline-offset-4 hover:underline">
                  সব দেখুন
                </button>
              </p>
            )}
          </section>

          {/* আবেদনের ধাপ */}
          <section aria-labelledby="steps-title">
            <h2 id="steps-title" className="flex items-center gap-3 text-2xl font-bold">
              <span className="h-7 w-1.5 rounded-full bg-gradient-to-b from-brand to-accent" aria-hidden="true" />
              আবেদনের সহজ ধাপ
            </h2>
            <ol className="mt-4 grid gap-3 md:grid-cols-3">
              {STEPS.map(([n, t, d]) => (
                <li key={n} className="card flex items-start gap-3.5 p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand text-lg font-bold text-onbrand" aria-hidden="true">{n}</span>
                  <div>
                    <h3 className="font-bold leading-snug">{t}</h3>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* ছবি-স্বাক্ষর টুলে যাওয়ার আমন্ত্রণ */}
          <section aria-labelledby="tool-cta" className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-emerald-800 p-6 text-center text-white sm:p-10">
            <div className="absolute -right-10 -top-16 -z-10 h-56 w-56 rounded-full bg-emerald-300/25 blur-3xl" aria-hidden="true" />
            <h2 id="tool-cta" className="text-2xl font-bold sm:text-3xl">আবেদনের ছবি ও স্বাক্ষর তৈরি করবেন?</h2>
            <p className="mx-auto mt-2 max-w-xl leading-relaxed text-white/90">
              Pixel ও KB অনুযায়ী ছবি-স্বাক্ষর রিসাইজ ও কমপ্রেস করুন — সব কাজ আপনার ব্রাউজারেই, কোনো ছবি সার্ভারে যায় না।
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => home('workspace', 'photo')} className={`${pill} bg-white px-6 text-emerald-900 hover:bg-emerald-50`}>
                <ImageIcon size={18} aria-hidden="true" /> ছবি রিসাইজ
              </button>
              <button type="button" onClick={() => home('workspace', 'signature')} className={`${pill} border border-white/50 px-6 hover:bg-white/10`}>
                স্বাক্ষর রিসাইজ
              </button>
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
