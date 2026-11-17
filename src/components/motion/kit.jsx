/*
  Motion kit: small animated building blocks in the style of motion-brew.com
  (blur text, magnetic button, tilt card, spotlight card, marquee, scroll progress, count-up, reveal).
  Plain JSX + framer-motion + Tailwind v3, themed with this app's CSS variables.
*/
import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

/** শব্দগুলো ঝাপসা থেকে স্পষ্ট হয়ে উঠে আসে */
export function BlurText({ text, className = '', wordClass = '', delay = 0, as: Tag = 'span' }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className={`inline-block whitespace-pre ${wordClass}`}
          initial={reduce ? false : { opacity: 0, y: 16, filter: 'blur(10px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.7, delay: delay + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
        >
          {w + ' '}
        </motion.span>
      ))}
    </Tag>
  );
}

/** কার্সরের দিকে ঝুঁকে পড়ে */
export function Magnetic({ children, strength = 0.28, className = '' }) {
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16 });
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  };
  const leave = () => { x.set(0); y.set(0); };
  return (
    <motion.div style={{ x, y }} onMouseMove={move} onMouseLeave={leave} className={`inline-block ${className}`}>
      {children}
    </motion.div>
  );
}

/** কার্সরের দিকে 3D হেলে যায়, উপরে আলোর ঝলক পড়ে */
export function TiltCard({ children, className = '', max = 7 }) {
  const rx = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glare = useTransform([gx, gy], ([a, b]) => `radial-gradient(circle at ${a}% ${b}%, rgb(255 255 255 / .35), transparent 55%)`);
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2); rx.set((0.5 - py) * max * 2);
    gx.set(100 - px * 100); gy.set(100 - py * 100);
  };
  const leave = () => { rx.set(0); ry.set(0); };
  return (
    <motion.div onMouseMove={move} onMouseLeave={leave} style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }} className={`relative ${className}`}>
      {children}
      <motion.div aria-hidden="true" style={{ background: glare }} className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity [div:hover>&]:opacity-100" />
    </motion.div>
  );
}

/** কার্সরের পিছু নেয় এমন নরম আলো (কার্ডের ভেতরে) */
export function Spotlight({ children, className = '', inner = '', as: Tag = 'div', ...rest }) {
  const x = useMotionValue(-300);
  const y = useMotionValue(-300);
  const bg = useTransform([x, y], ([a, b]) => `radial-gradient(300px circle at ${a}px ${b}px, rgb(var(--brand) / .13), transparent 70%)`);
  const move = (e) => { const r = e.currentTarget.getBoundingClientRect(); x.set(e.clientX - r.left); y.set(e.clientY - r.top); };
  return (
    <Tag onMouseMove={move} className={`relative overflow-hidden ${className}`} {...rest}>
      <motion.span aria-hidden="true" style={{ background: bg }} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [*:hover>&]:opacity-100" />
      <div className={`relative ${inner}`}>{children}</div>
    </Tag>
  );
}

/** স্ক্রল করলে উপরে ভরাট হওয়া সরু রেখা */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });
  if (reduce) return null;
  return <motion.div aria-hidden="true" style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-brand via-emerald-400 to-accent" />;
}

/** অবিরাম চলা ট্যাগের সারি; হোভারে থামে */
export function Marquee({ items, className = '', speed = 40 }) {
  const reduce = useReducedMotion();
  const row = (hidden) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-3 pr-3">
      {items.map((t) => (
        <li key={t} className="whitespace-nowrap rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-medium text-muted">{t}</li>
      ))}
    </ul>
  );
  return (
    <div className={`group overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] ${className}`}>
      <div className="flex w-max group-hover:[animation-play-state:paused]" style={reduce ? undefined : { animation: `marquee ${speed}s linear infinite` }}>
        {row(false)}
        {!reduce && row(true)}
      </div>
    </div>
  );
}

/** স্ক্রলে দেখা গেলে সংখ্যা গুনে ওঠে */
export function CountUp({ to, className = '', format = (n) => n.toLocaleString('bn-BD') }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return undefined;
    const c = animate(0, to, { duration: 1.4, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref} className={`tabular-nums ${className}`}>{format(n)}</span>;
}

/** প্রথমবার দেখা গেলে ভেসে এসে বসে */
export function Reveal({ children, className = '', delay = 0, y = 28, as = 'div' }) {
  const reduce = useReducedMotion();
  const M = motion[as] || motion.div;
  if (reduce) { const T = as; return <T className={className}>{children}</T>; }
  return (
    <M className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -8% 0px' }} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </M>
  );
}
