import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { BookOpen, ChevronLeft, ChevronRight, ExternalLink, GraduationCap, Globe, Mail, School } from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { PixelBlast } from '../components/pixel-blast.jsx';
import { BackspaceText, BlurText, HighlightText, Reveal, Spotlight } from '../components/motion/kit.jsx';
import useTheme from '../hooks/useTheme.js';
import useInstall from '../hooks/useInstall.js';
import photo from '../assets/developer.jpg';
import { DEV } from '../data/developer.js';

// lucide has no brand icons, so these are custom SVG paths
const PATH = {
  github: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22',
  linkedin: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 110 4 2 2 0 010-4z',
  instagram: 'M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zM16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01',
};
const brandIcon = (d) =>
  function BrandIcon({ size = 18 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={d} />
      </svg>
    );
  };
const Github = brandIcon(PATH.github);
const Linkedin = brandIcon(PATH.linkedin);
const Instagram = brandIcon(PATH.instagram);

const EMAIL = 'hafizsakib5@gmail.com';
const MAIL_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`;

// each link takes its own brand colour on hover (portfolio = the app's green)
const LINKS = [
  ['portfolio', 'https://hsakib.vercel.app/', Globe, 'hover:border-brand hover:bg-brand hover:text-onbrand'],
  ['email', MAIL_URL, Mail, 'hover:border-[#EA4335] hover:bg-[#EA4335] hover:text-white'],
  ['linkedin', 'https://linkedin.com/in/hafizsakib', Linkedin, 'hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white'],
  ['github', 'https://github.com/Hafiz-Sakib', Github, 'hover:border-[#24292f] hover:bg-[#24292f] hover:text-white dark:hover:border-[#3d444d] dark:hover:bg-[#2d333b]'],
  ['instagram', 'https://www.instagram.com/___sakib.404/', Instagram, 'hover:border-[#DD2A7B] hover:bg-[linear-gradient(45deg,#F58529,#DD2A7B,#8134AF)] hover:text-white'],
];

const ICONS = [Globe, Mail, Linkedin, Github, Instagram];

const pill = 'mb-3 inline-block rounded-full bg-brandsoft px-3 py-1 text-xs font-semibold text-brand';
const btn = 'inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-md';

/* Education path: the line on the left fills as you scroll */
function Path({ items, t }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 65%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  return (
    <ol ref={ref} className="relative space-y-8">
      <span aria-hidden="true" className="absolute bottom-3 left-[13px] top-3 w-[3px] rounded-full bg-line" />
      <motion.span aria-hidden="true" className="absolute bottom-3 left-[13px] top-3 w-[3px] origin-top rounded-full bg-brand" style={{ scaleY: reduce ? 1 : fill }} />
      {items.map((r) => {
        const I = [GraduationCap, BookOpen, School][items.indexOf(r)];
        return (
          <li key={r.t} className="relative grid grid-cols-[28px_1fr] gap-x-5 sm:grid-cols-[28px_9rem_1fr]">
            <span className="relative z-10 mt-0.5 grid h-7 w-7 place-items-center rounded-full bg-brand text-onbrand ring-4 ring-surface">
              <I size={15} strokeWidth={2.4} aria-hidden="true" />
            </span>
            <p className="col-start-2 text-sm font-semibold text-muted sm:pt-1">
              <span className="whitespace-nowrap">{r.p}</span>
              {r.done && <span className="mt-1 block w-fit rounded-full bg-oksoft px-2 py-0.5 text-xs text-ok">{t.graduated}</span>}
            </p>
            <div className="col-start-2 mt-1 sm:col-start-3 sm:mt-0">
              <h3 className="text-lg font-bold leading-snug sm:text-xl">{r.t}</h3>
              <p className="text-sm font-semibold text-muted">{r.o}</p>
              <p className="mt-2 max-w-xl text-muted">{r.d}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* Profile card: the cover is a PixelBlast — dithered pixel clouds in the theme's brand colour (follows light/dark) */
function ProfileCard({ t }) {
  return (
    <div className="card overflow-hidden p-3">
      <PixelBlast className="h-36 rounded-xl bg-brandsoft sm:h-44" /* color="#00694d" — hex দিলে থিমের বদলে ওই রং */ />
      <div className="px-4 pb-4 sm:px-5">
        <img src={photo} width={128} height={128} alt={`${t.name} — ${t.pill}`} decoding="async"
          className="relative z-10 -mt-14 h-28 w-28 rounded-full border-4 border-surface object-cover object-top shadow-xl ring-2 ring-brand sm:-mt-16 sm:h-32 sm:w-32" />
        <h2 className="mt-4 text-2xl font-bold leading-snug">{t.name}</h2>
        <p className="mt-1 font-semibold text-brand">{t.role}</p>
        <p className="mt-0.5 text-sm text-muted">{t.place}</p>
        <a href="https://hsakib.vercel.app/" target="_blank" rel="noopener noreferrer"
          className="btn-primary mt-5 !rounded-full">
          <Globe size={18} aria-hidden="true" />{t.portfolio}
        </a>
      </div>
    </div>
  );
}

/* Project showcase: the screenshot turns like a page, details and links sit underneath */
function Showcase({ t }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const P = t.projects;
  const p = P[i];
  const go = (n) => { setDir(n > i || (i === P.length - 1 && n === 0) ? 1 : -1); setI((n + P.length) % P.length); };
  return (
    <Reveal y={24} className="mt-8">
      <Spotlight className="card p-3 sm:p-4">
        <div className="relative mx-auto w-full lg:max-w-2xl" style={{ perspective: 1200 }}>
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line bg-sunken" style={{ boxShadow: `0 20px 50px -24px rgb(${p.c} / .55)` }}>
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.img key={p.img} src={`/dev/${p.img}-hd.webp`} alt={`${p.t} ${t.pro.shot}`} loading="lazy" decoding="async" custom={dir}
                variants={{
                  in: (d) => (reduce ? { opacity: 0 } : { opacity: 0, rotateY: d * 40, x: d * 40, scale: 0.96 }),
                  show: { opacity: 1, rotateY: 0, x: 0, scale: 1 },
                  out: (d) => (reduce ? { opacity: 0 } : { opacity: 0, rotateY: d * -40, x: d * -40, scale: 0.96 }),
                }}
                initial="in" animate="show" exit="out" transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 h-full w-full object-cover object-top" />
            </AnimatePresence>
          </div>
          <button type="button" onClick={() => go(i - 1)} aria-label={t.pro.prev}
            className="absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface/90 shadow-md backdrop-blur transition hover:bg-surface active:scale-95">
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => go(i + 1)} aria-label={t.pro.next}
            className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface/90 shadow-md backdrop-blur transition hover:bg-surface active:scale-95">
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label={t.pro.pick}>
          {P.map((x, n) => (
            <button key={x.t} type="button" role="tab" aria-selected={n === i} aria-label={x.t} onClick={() => go(n)}
              className={`h-2.5 rounded-full transition-all ${n === i ? 'w-7 bg-brand' : 'w-2.5 bg-line hover:bg-muted'}`} />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.article key={p.t} aria-live="polite"
            initial={reduce ? false : { opacity: 0, y: 8, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, filter: 'blur(8px)' }} transition={{ duration: 0.25 }}
            className="grid gap-5 p-3 pt-6 sm:p-5 sm:pt-7 md:grid-cols-[1.1fr_1fr] md:gap-10">
            <div>
              <p className="text-sm font-semibold text-muted"><span className="tabular-nums">{t.num(i + 1)} / {t.num(P.length)}</span> · {p.k}</p>
              <h3 className="mt-1 text-2xl font-bold sm:text-3xl">{p.t}</h3>
              <p className="mt-3 max-w-xl leading-[1.8] text-muted">{p.d}</p>
              <ul className="mt-3 space-y-1.5 text-[15px] leading-[1.7]">
                {p.pts.map((x) => (
                  <li key={x} className="flex gap-2"><span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-brand/60" />{x}</li>
                ))}
              </ul>
            </div>
            <div className="md:self-end">
              <div className="flex flex-wrap gap-2">
                {p.tags.map((x) => (
                  <span key={x} className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold" style={{ background: `rgb(${p.c} / .16)` }}>{x}</span>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
                <a className="inline-flex min-h-[2.5rem] items-center gap-1.5 underline decoration-ink/30 underline-offset-4 transition hover:text-brand hover:decoration-brand" href={p.u} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={16} aria-hidden="true" />{t.pro.live}
                </a>
                <a className="inline-flex min-h-[2.5rem] items-center gap-1.5 underline decoration-ink/30 underline-offset-4 transition hover:text-brand hover:decoration-brand" href={p.gh} target="_blank" rel="noopener noreferrer">
                  <Github size={16} />{t.pro.src}
                </a>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </Spotlight>
    </Reveal>
  );
}

export default function Developer() {
  const { theme, toggle } = useTheme();
  const install = useInstall();
  const t = DEV;

  useEffect(() => {
    const prev = document.title;
    document.title = 'Developer — Mohammad Hafizur Rahman Sakib';
    window.scrollTo({ top: 0 });
    return () => { document.title = prev; };
  }, []);

  return (
    <>
      <Header theme={theme} onToggleTheme={toggle} install={install} />
      <main id="main" lang="en" className="mx-auto w-full max-w-5xl overflow-x-clip px-4 pb-10 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        <header className="mb-10 sm:mb-14">
          <p className={pill}>{t.pill}</p>
          <h1 className="text-3xl font-bold leading-[1.3] min-[400px]:text-4xl sm:text-5xl">
            <BlurText text={t.name} />
            <span className="text-brand">।</span>
          </h1>
          <Reveal y={16} delay={0.25}>
            <p className="mt-3 min-h-[3.2rem] max-w-xl text-lg text-muted sm:min-h-0 sm:text-xl">
              <BackspaceText before={t.before} words={t.words} caretClassName="text-brand" />
            </p>
          </Reveal>
        </header>

        <div className="grid items-stretch gap-6 lg:grid-cols-[22rem_1fr] lg:gap-10">
          <Reveal y={20}><ProfileCard t={t} /></Reveal>
          <Reveal y={20} delay={0.08} className="flex items-center">
            <HighlightText text={t.bio} marks={t.marks} className="text-lg leading-[1.95] text-ink/85 sm:text-xl" />
          </Reveal>
        </div>

        <section className="mt-20" aria-labelledby="edu-h">
          <Reveal y={16}>
            <p className={pill}>{t.edu.pill}</p>
            <h2 id="edu-h" className="text-3xl font-bold leading-tight sm:text-4xl">{t.edu.h}</h2>
          </Reveal>
          <Reveal y={16}><div className="card mt-6 p-5 sm:p-8"><Path items={t.eduItems} t={t} /></div></Reveal>
        </section>

        <section className="mt-20" aria-labelledby="pro-h">
          <Reveal y={16}>
            <p className={pill}>{t.pro.pill}</p>
            <h2 id="pro-h" className="text-3xl font-bold leading-tight sm:text-4xl">{t.pro.h}</h2>
            <p className="mt-2 text-muted">{t.pro.sub}</p>
          </Reveal>
          <Showcase t={t} />
        </section>

        <section className="mt-20" aria-labelledby="touch-h">
          <Reveal y={16}>
            <div className="card p-6 text-center sm:p-10">
              <p className={pill}>{t.touch.pill}</p>
              <h2 id="touch-h" className="text-3xl font-bold leading-tight sm:text-4xl">{t.touch.h}</h2>
              <p className="mx-auto mt-3 max-w-md text-muted">{t.touch.p}</p>
              <ul className="mt-6 flex flex-wrap justify-center gap-2.5" aria-label={t.touch.links}>
                {LINKS.map(([id, href, , hover], n) => {
                  const I = ICONS[n];
                  return (
                  <li key={id}>
                    <a href={href} target="_blank" rel="noopener noreferrer" className={`${btn} ${hover}`}>
                      <I size={18} aria-hidden="true" />{t.labels[id]}
                    </a>
                  </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
