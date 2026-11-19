import { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SWITCH_MS } from '../hooks/useTheme.js';

/* দিন/রাতের সুইচ: নব স্লাইড করে, সূর্যের রশ্মি গুটিয়ে চাঁদ হয়, তারা জ্বলে ওঠে। পুরো পেজ বদলায় এই বোতাম থেকে ছড়ানো বৃত্তে। */
/* নব, আইকন, মেঘ, তারা — সব পেজের বৃত্তের মতো একই ধীর কার্ভে চলে, পুরোটা একটাই গতি মনে হয় */
const GLIDE = { duration: (SWITCH_MS / 1000) * 0.85, ease: [0.5, 0.05, 0.25, 1] };
const SPRING = GLIDE;
const RAYS = [0, 45, 90, 135, 180, 225, 270, 315];
const STARS = [[9, 8, 1.4], [18, 21, 1], [12, 23, 1.1], [26, 11, 0.9]];

function Glyph({ dark, still }) {
  const id = useId().replace(/:/g, '');
  const t = still ? { duration: 0 } : GLIDE;
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <mask id={`m${id}`}>
        <rect width="24" height="24" fill="#fff" />
        <motion.circle r="7" fill="#000" initial={false} animate={{ cx: dark ? 15.5 : 32, cy: dark ? 8.5 : -6 }} transition={t} />
      </mask>
      <motion.circle cx="12" cy="12" fill="currentColor" mask={`url(#m${id})`} initial={false} animate={{ r: dark ? 8.5 : 5 }} transition={t} />
      <motion.g stroke="currentColor" strokeWidth="2" strokeLinecap="round" initial={false} animate={{ rotate: dark ? 80 : 0, scale: dark ? 0.2 : 1, opacity: dark ? 0 : 1 }} transition={t} style={{ originX: '12px', originY: '12px' }}>
        {RAYS.map((a) => <line key={a} x1="12" y1="2.2" x2="12" y2="4.4" transform={`rotate(${a} 12 12)`} />)}
      </motion.g>
    </svg>
  );
}

export default function ThemeToggle({ theme, onToggle }) {
  const dark = theme === 'dark';
  const still = !!useReducedMotion();
  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="ডার্ক মোড"
      title={dark ? 'লাইট মোড অন করুন' : 'ডার্ক মোড অন করুন'}
      onClick={(e) => onToggle(e.currentTarget)}
      whileTap={still ? undefined : { scale: 0.94 }}
      className={`relative h-9 w-[4.1rem] shrink-0 cursor-pointer overflow-hidden rounded-full border border-line shadow-card transition-colors duration-1000 ${dark ? 'bg-[#0b1a16]' : 'bg-[#d9efe5]'}`}
    >
      {STARS.map(([x, y, r], i) => (
        <motion.span key={i} aria-hidden="true" className="absolute rounded-full bg-white" style={{ left: x, top: y, width: r * 2, height: r * 2 }}
          initial={false} animate={{ opacity: dark ? [0.4, 1, 0.4] : 0, scale: dark ? 1 : 0.2 }}
          transition={dark && !still ? { opacity: { duration: 2.4 + i * 0.5, repeat: Infinity }, scale: { duration: 0.6, delay: 0.5 + i * 0.08 } } : { duration: 0.2 }} />
      ))}
      <motion.span aria-hidden="true" className="absolute bottom-1.5 right-2.5 h-2 w-5 rounded-full bg-white/85" initial={false} animate={{ opacity: dark ? 0 : 1, x: dark ? 10 : 0 }} transition={SPRING} />
      <motion.span aria-hidden="true" className="absolute bottom-3.5 right-5 h-1.5 w-3 rounded-full bg-white/75" initial={false} animate={{ opacity: dark ? 0 : 1, x: dark ? 14 : 0 }} transition={SPRING} />
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{ x: dark ? 31 : 3 }}
        transition={still ? { duration: 0 } : SPRING}
        className={`absolute left-0 top-[3px] grid h-[28px] w-[28px] place-items-center rounded-full shadow-[0_2px_8px_rgba(0,0,0,.3)] transition-colors duration-1000 ${dark ? 'bg-[#16352b] text-[#d7f5e8]' : 'bg-white text-amber-500'}`}
      >
        <Glyph dark={dark} still={still} />
      </motion.span>
    </motion.button>
  );
}
