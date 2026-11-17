/*
  OrbitCard — a card where chips orbit a centre mark (motion-brew style).

  <OrbitCard count={24816} label="creators" cta="Join the community" href="/join" speed={4} joinEvery={5.2} />

  - count/label: big headline; the number rolls up whenever someone "joins" (see incrementOnJoin).
  - speed: orbit speed multiplier (1 = calm). Hover slows it, drag to spin (it keeps momentum).
  - joinEvery: seconds between new chips popping onto the outer ring (oldest one leaves past maxItems).
  - items: [{ icon: LucideIcon, color }] or [{ src }] chips to cycle through. href or onCta handles the button.
  Positions are written straight to the DOM in one rAF loop, so React only re-renders when a chip joins.
*/
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Image as ImageIcon, PenLine, Scaling, ShieldCheck, Smartphone, Weight, WifiOff, Zap } from 'lucide-react';

const DEFAULT_ITEMS = [
  { icon: ImageIcon, color: '#00694D' }, { icon: PenLine, color: '#C8283A' }, { icon: Weight, color: '#2563EB' },
  { icon: ShieldCheck, color: '#0E9F6E' }, { icon: WifiOff, color: '#7C3AED' }, { icon: Smartphone, color: '#D97706' }, { icon: Zap, color: '#DB2777' },
];
const RINGS = [0.2, 0.34, 0.49]; // radius as a share of card width
const SLOW = 0.25;
const easeOutBack = (x) => 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2);
const TAU = Math.PI * 2;

function Rolling({ value }) {
  const [n, setN] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const c = animate(prev.current, value, { duration: 0.9, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) });
    prev.current = value;
    return () => c.stop();
  }, [value]);
  return <span className="tabular-nums">{n.toLocaleString('bn-BD')}</span>;
}

export function OrbitCard({
  count = 0, label = '', description = '', cta = '', href, onCta, speed = 1, joinEvery = 5, maxItems = 9,
  items = DEFAULT_ITEMS, incrementOnJoin = true, className = '',
}) {
  const reduce = useReducedMotion();
  const stage = useRef(null);
  const nodes = useRef(new Map());
  const [num, setNum] = useState(count);
  const seq = useRef(0);
  const mk = useCallback((i, born = 0) => {
    const ring = i % RINGS.length;
    return { id: ++seq.current, ring, phase: (i * 2.399) % TAU, dir: ring === 1 ? -1 : 1, spec: items[i % items.length], born, dying: 0 };
  }, [items]);
  const [list, setList] = useState(() => Array.from({ length: Math.min(6, maxItems) }, (_, i) => mk(i)));
  const listRef = useRef(list);
  listRef.current = list;

  useEffect(() => setNum(count), [count]);

  // a new chip joins every `joinEvery` seconds
  useEffect(() => {
    if (reduce || !joinEvery) return undefined;
    let i = 6;
    const t = setInterval(() => {
      const now = performance.now() / 1000;
      setList((l) => {
        let next = [...l, mk(i++, now)];
        const alive = next.filter((x) => !x.dying);
        if (alive.length > maxItems) next = next.map((x) => (x.id === alive[0].id ? { ...x, dying: now } : x));
        return next;
      });
      if (incrementOnJoin) setNum((n) => n + 1);
      setTimeout(() => setList((l) => l.filter((x) => !x.dying || performance.now() / 1000 - x.dying < 0.45)), 600);
    }, joinEvery * 1000);
    return () => clearInterval(t);
  }, [joinEvery, maxItems, mk, reduce, incrementOnJoin]);

  // one rAF loop writes every chip position; hover slows, drag spins with momentum
  const ctl = useRef({ hover: false, drag: false, lastX: 0, vel: 0, spin: 0, mul: 1 });
  useEffect(() => {
    const el = stage.current;
    if (!el) return undefined;
    let raf = 0, last = performance.now() / 1000, t = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const now = performance.now() / 1000;
      const dt = Math.min(0.05, now - last); last = now;
      const c = ctl.current;
      const target = reduce ? 0 : c.hover || c.drag ? SLOW : 1;
      c.mul += (target - c.mul) * Math.min(1, dt * 5);
      if (!c.drag) c.vel *= Math.pow(0.04, dt);
      t += dt * speed * 0.12 * c.mul;
      c.spin += c.vel * dt;
      const w = el.clientWidth, cx = w / 2, cy = el.clientHeight * 0.52;
      for (const it of listRef.current) {
        const node = nodes.current.get(it.id);
        if (!node) continue;
        const r = RINGS[it.ring] * w;
        const a = it.phase + it.dir * t * (1 + (2 - it.ring) * 0.35) * TAU * 0.5 + c.spin * it.dir;
        const born = it.born ? Math.min(1, (now - it.born) / 0.6) : 1;
        const die = it.dying ? Math.max(0, 1 - (now - it.dying) / 0.4) : 1;
        const s = (it.born ? easeOutBack(born) : 1) * die;
        node.style.transform = `translate(${cx + Math.cos(a) * r}px, ${cy + Math.sin(a) * r}px) translate(-50%,-50%) scale(${Math.max(0, s)})`;
        node.style.opacity = String(Math.min(1, born * 1.5) * die);
      }
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [speed, reduce]);

  const down = (e) => { const c = ctl.current; c.drag = true; c.lastX = e.clientX; c.vel = 0; e.currentTarget.setPointerCapture?.(e.pointerId); };
  const move = (e) => { const c = ctl.current; if (!c.drag) return; const dx = e.clientX - c.lastX; c.lastX = e.clientX; c.spin += dx * 0.008; c.vel = dx * 0.5; };
  const up = () => { ctl.current.drag = false; };

  const Cta = href ? 'a' : 'button';
  return (
    <div className={`card relative overflow-hidden ${className}`}>
      <div className="relative z-10 p-6 pb-0 sm:p-7 sm:pb-0">
        <h3 className="text-3xl font-bold leading-tight sm:text-4xl"><Rolling value={num} /> {label}</h3>
        {description && <p className="mt-2 max-w-sm text-muted">{description}</p>}
        {cta && (
          <Cta {...(href ? { href } : { type: 'button' })} onClick={onCta} className="btn-ghost mt-4 min-h-[2.5rem] px-4 text-sm">
            {cta} <ArrowRight size={16} aria-hidden="true" />
          </Cta>
        )}
      </div>

      <div
        ref={stage}
        onPointerEnter={() => { ctl.current.hover = true; }}
        onPointerLeave={() => { ctl.current.hover = false; }}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
        role="img" aria-label={`${label} ঘুরছে — টেনে ঘোরাতে পারেন`}
        className="relative mt-2 h-[22rem] cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing sm:h-[24rem]"
      >
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full">
          {RINGS.map((r, i) => <circle key={i} cx="50%" cy="52%" r={`${r * 100}%`} fill="none" stroke="rgb(var(--line))" strokeWidth="1.2" />)}
        </svg>
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[52%] grid h-[5.5rem] w-[5.5rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-sunken">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-ink text-paper shadow-pop"><Scaling size={26} /></span>
        </div>
        {list.map((it) => {
          const S = it.spec;
          return (
            <span key={it.id} ref={(n) => (n ? nodes.current.set(it.id, n) : nodes.current.delete(it.id))} className="absolute left-0 top-0 will-change-transform" style={{ transform: 'translate(-9999px,-9999px)' }}>
              {S.src ? (
                <img src={S.src} alt="" draggable="false" className="h-10 w-10 rounded-full border-2 border-surface object-cover shadow-card" />
              ) : (
                <span className="grid h-9 w-9 place-items-center rounded-full text-white shadow-card" style={{ background: S.color }}><S.icon size={17} aria-hidden="true" /></span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default OrbitCard;
