import { useId, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, MotionConfig, motion, useInView, useReducedMotion } from 'framer-motion';
import { Home, Image as ImageIcon, PenLine, Bookmark, Link2, Code } from 'lucide-react';
import { PATHS, navigate, usePath } from '../utils/router.js';

/*
  মোবাইলের নিচের ট্যাব বার (BRSP প্রজেক্টের বটম ট্যাব বারের মতোই):
  ডক করা গোল বার, সব ট্যাবে লেবেল, একটি ব্র্যান্ড-রঙের ইন্ডিকেটর ট্যাবগুলোর মাঝে গ্লাইড করে,
  ট্যাপে আইকন বাউন্স করে ও রিপল ছড়ায়, লোডে ট্যাবগুলো একে একে ভেসে ওঠে।
  রঙ অ্যাপের নিজের টোকেন (brand / onbrand / surface / muted / ink) — দিন-রাত দুই থিমেই মানানসই।
*/
const ITEMS = [
  { id: 'home', label: 'হোম', icon: Home, to: PATHS.home, match: [PATHS.home, PATHS.why, PATHS.how] },
  { id: 'photo', label: 'ছবি', icon: ImageIcon, to: PATHS.photo, match: [PATHS.photo] },
  { id: 'signature', label: 'স্বাক্ষর', icon: PenLine, to: PATHS.signature, match: [PATHS.signature] },
  { id: 'presets', label: 'প্রিসেট', icon: Bookmark, to: PATHS.presets, match: [PATHS.presets] },
  { id: 'links', label: 'লিংক', icon: Link2, to: PATHS.importantLinks, match: [PATHS.importantLinks] },
  { id: 'developer', label: 'ডেভেলপার', icon: Code, to: PATHS.developer, match: [PATHS.developer] },
];

const GLIDE = [0.22, 1, 0.36, 1];
const SPRING = { type: 'spring', stiffness: 500, damping: 34 };
const SLIDE = { type: 'spring', stiffness: 210, damping: 27, mass: 1 }; // ইন্ডিকেটরের নরম গ্লাইড

export default function TabBar() {
  const path = usePath();
  const still = !!useReducedMotion();
  const uid = useId();
  const root = useRef(null);
  const seen = useInView(root, { once: true, amount: 0.4 });
  const shown = seen || still;
  const [taps, setTaps] = useState({});

  const onKeyDown = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const links = Array.from(root.current?.querySelectorAll('[data-tab]') ?? []);
    const at = links.indexOf(document.activeElement);
    if (at < 0) return;
    e.preventDefault();
    links[(at + (e.key === 'ArrowRight' ? 1 : links.length - 1)) % links.length]?.focus();
  };

  const tab = (it, i) => {
    const on = it.match.includes(path);
    const Icon = it.icon;
    const ripple = taps[it.id] ?? 0;
    return (
      <motion.a
        key={it.id}
        href={it.to}
        data-tab=""
        aria-label={it.label}
        aria-current={on ? 'page' : undefined}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
          e.preventDefault();
          setTaps((t) => ({ ...t, [it.id]: (t[it.id] ?? 0) + 1 }));
          navigate(it.to);
        }}
        initial={still ? false : { opacity: 0, y: 14 }}
        animate={shown ? { opacity: 1, y: 0 } : undefined}
        whileTap={still ? undefined : { scale: 0.92 }}
        transition={{ ...SPRING, opacity: { duration: 0.4, delay: still ? 0 : 0.12 + i * 0.05 }, y: { ...SPRING, delay: still ? 0 : 0.12 + i * 0.05 } }}
        className="group relative flex h-[50px] min-w-0 flex-1 cursor-pointer select-none flex-col items-center justify-center gap-1 rounded-2xl outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-brand"
      >
        <span className="relative grid h-[30px] w-full max-w-[3.5rem] place-items-center">
          {on && <motion.span layoutId={`${uid}-indicator`} transition={still ? { duration: 0 } : SLIDE} className="absolute inset-0 rounded-full bg-brand shadow-[0_6px_16px_-6px_rgb(var(--brand)/0.55)]" />}
          {!on && <span aria-hidden="true" className="absolute inset-0 rounded-full bg-brand/[0.08] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />}
          <AnimatePresence>
            {!still && ripple > 0 && (
              <motion.span key={ripple} aria-hidden="true" initial={{ scale: 0.4, opacity: 0.4 }} animate={{ scale: 2, opacity: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: GLIDE }} className="absolute size-9 rounded-full bg-brand/20" />
            )}
          </AnimatePresence>
          <span className={`relative grid transition-colors duration-300 ${on ? 'text-onbrand' : 'text-muted group-hover:text-ink'}`}>
            <motion.span key={ripple} className="grid" initial={ripple > 0 && !still ? { scale: 0.7, rotate: -14 } : false} animate={{ scale: on ? 1.05 : 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 520, damping: 12 }}>
              <Icon className="size-[22px]" strokeWidth={on ? 2.25 : 2} aria-hidden="true" />
            </motion.span>
          </span>
        </span>
        <motion.span
          animate={still ? undefined : { y: on ? 0 : 1, opacity: on ? 1 : 0.62 }}
          transition={{ duration: 0.3, ease: GLIDE }}
          className={`relative w-full truncate px-0 text-center text-[10px] font-semibold leading-none tracking-tight transition-colors duration-300 min-[360px]:text-[10.5px] min-[400px]:px-0.5 min-[400px]:text-[11.5px] ${on ? 'text-ink' : 'text-muted group-hover:text-ink'}`}
        >
          {it.label}
        </motion.span>
      </motion.a>
    );
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-2 min-[380px]:px-3 lg:hidden" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}>
        <motion.nav
          ref={root}
          aria-label="নিচের মেনু"
          onKeyDown={onKeyDown}
          initial={still ? false : { opacity: 0, y: 28, filter: 'blur(6px)' }}
          animate={shown ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined}
          transition={{ duration: 0.6, ease: GLIDE }}
          className="pointer-events-auto relative w-[420px] max-w-full rounded-[28px] bg-surface/90 p-1 shadow-[0_1px_2px_rgb(var(--shadow)/0.06),0_16px_40px_-16px_rgb(var(--shadow)/0.35)] ring-1 ring-brand/10 backdrop-blur-xl min-[380px]:p-1.5"
        >
          <LayoutGroup id={uid}>
            <div className="flex items-stretch justify-between gap-0 min-[380px]:gap-0.5">{ITEMS.map(tab)}</div>
          </LayoutGroup>
        </motion.nav>
      </div>
    </MotionConfig>
  );
}
