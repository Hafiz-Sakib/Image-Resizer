import { AnimatePresence, motion } from 'framer-motion';
import { Home, Image as ImageIcon, PenLine, Bookmark, Link2 } from 'lucide-react';
import { PATHS, navigate, usePath } from '../utils/router.js';

/*
  মোবাইলের নিচের ট্যাব বার (motion-brew "Tab bar"-এর ধাঁচে): সাদা গোল ক্যাপসুল,
  সক্রিয় ট্যাবের পেছনে নরম ধূসর পিল গড়িয়ে যায়, আইকনের পাশে লেবেল ফোটে, প্রতিটি ট্যাপে ছোট বাউন্স।
*/
const ITEMS = [
  { id: 'home', label: 'হোম', icon: Home, to: PATHS.home, match: [PATHS.home, PATHS.why, PATHS.how] },
  { id: 'photo', label: 'ছবি', icon: ImageIcon, to: PATHS.photo, match: [PATHS.photo] },
  { id: 'signature', label: 'স্বাক্ষর', icon: PenLine, to: PATHS.signature, match: [PATHS.signature] },
  { id: 'presets', label: 'প্রিসেট', icon: Bookmark, to: PATHS.presets, match: [PATHS.presets] },
  { id: 'links', label: 'লিংক', icon: Link2, to: PATHS.importantLinks, match: [PATHS.importantLinks] },
];

const spring = { type: 'spring', stiffness: 420, damping: 32 };

export default function TabBar() {
  const path = usePath();
  return (
    <nav
      aria-label="নিচের মেনু"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 lg:hidden"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <ul className="flex items-center gap-0.5 rounded-full border border-line bg-surface p-1.5 shadow-pop">
        {ITEMS.map((it) => {
          const active = it.match.includes(path);
          return (
            <li key={it.id}>
              <motion.a
                href={it.to}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
                  e.preventDefault();
                  navigate(it.to);
                }}
                aria-current={active ? 'page' : undefined}
                aria-label={it.label}
                whileTap={{ scale: 0.88 }}
                transition={spring}
                className={`relative flex h-11 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-semibold outline-none transition-colors ${active ? 'text-ink' : 'text-muted'}`}
              >
                {active && <motion.span layoutId="tabbar-pill" transition={spring} className="absolute inset-0 rounded-full bg-sunken" aria-hidden="true" />}
                <motion.span
                  key={active ? 'on' : 'off'}
                  initial={active ? { scale: 0.6, rotate: -12 } : false}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 14 }}
                  className="relative grid place-items-center"
                >
                  <it.icon size={22} strokeWidth={active ? 2.4 : 2} aria-hidden="true" className={active ? 'text-brand' : ''} />
                </motion.span>
                <AnimatePresence initial={false}>
                  {active && (
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 'auto', opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="relative overflow-hidden whitespace-nowrap leading-none"
                    >
                      {it.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
