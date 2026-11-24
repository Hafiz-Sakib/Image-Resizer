import { motion, useMotionTemplate, useReducedMotion, useSpring } from 'framer-motion';

// Motion Brew "Tilt card" (BRSP প্রজেক্টের মতোই) — কার্সরের দিকে ৩D তে হেলে, একটু ওঠে।
// টাচে হেলে না (শুধু মাউস পয়েন্টারে)। max = সর্বোচ্চ ডিগ্রি। glare চাইলে কার্সরের উল্টো দিকে আলো সরে।
const SPRING = { stiffness: 220, damping: 20, mass: 0.6 };

export default function TiltCard({ max = 5, glare = false, className = '', children, ...rest }) {
  const still = useReducedMotion();
  const rx = useSpring(0, SPRING);
  const ry = useSpring(0, SPRING);
  const lift = useSpring(0, SPRING);
  const gx = useSpring(50, SPRING);
  const gy = useSpring(50, SPRING);
  const shine = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.22), transparent 55%)`;

  const move = (e) => {
    if (still || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
    gx.set(100 - px * 100);
    gy.set(100 - py * 100);
    lift.set(-4);
  };
  const leave = () => {
    rx.set(0);
    ry.set(0);
    lift.set(0);
    gx.set(50);
    gy.set(50);
  };

  return (
    <div style={{ perspective: 900 }} className="h-full">
      <motion.div
        onPointerMove={move}
        onPointerLeave={leave}
        style={{ rotateX: rx, rotateY: ry, y: lift, transformStyle: 'preserve-3d' }}
        className={`relative h-full ${className}`}
        {...rest}
      >
        {children}
        {glare && !still && <motion.span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] print:hidden" style={{ backgroundImage: shine }} />}
      </motion.div>
    </div>
  );
}
