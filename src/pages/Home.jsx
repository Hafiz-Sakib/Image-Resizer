import { useCallback, useEffect, useRef } from 'react';
import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import Workspace from '../components/Workspace.jsx';
import PresetsSection from '../components/PresetsSection.jsx';
import { WhyUs, HowItWorks } from '../components/InfoSections.jsx';
import { Marquee, ScrollProgress, CursorGlow } from '../components/motion/kit.jsx';
import Footer from '../components/Footer.jsx';
import useTheme from '../hooks/useTheme.js';
import usePresets from '../hooks/usePresets.js';
import useSettings from '../hooks/useSettings.js';
import useInstall from '../hooks/useInstall.js';
import { PATHS, SECTIONS, isHomePath, currentPath, navigate, setUrl } from '../utils/router.js';

function scrollToId(id, smooth = true) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce || !smooth ? 'auto' : 'smooth', block: 'start' });
}

// পেজে সেকশনগুলো যে ক্রমে আছে — স্ক্রল করলে কোনটি সামনে, তা এখান থেকে বোঝা যায়
const ORDER = ['workspace', 'presets', 'how', 'why'];

const USES = ['বিসিএস', 'ব্যাংক নিয়োগ', 'টেলিটক আবেদন', 'সরকারি চাকরি', 'শিক্ষক নিয়োগ', 'পাসপোর্ট ছবি', 'ছবি ৩০০×৩০০', 'স্বাক্ষর ৩০০×৮০', 'কাস্টম মাপ', 'KB কমপ্রেস'];

export default function Home() {
  const { theme, toggle } = useTheme();
  const presets = usePresets();
  const ws = useSettings(presets.list);
  const install = useInstall();
  const { setMode, applyPreset } = ws.actions;

  const mode = ws.settings.mode;
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const lockUntil = useRef(0); // স্ক্রলিং চলার সময় URL যেন এলোমেলো না বদলায়

  /** URL-এর পথ অনুযায়ী সেকশনে যাওয়া (ছবি/স্বাক্ষর ট্যাবও ঠিক করে) */
  const applyPath = useCallback(
    (path, smooth = true) => {
      lockUntil.current = Date.now() + 1200;
      const sec = SECTIONS[path];
      if (!sec) {
        window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
        return;
      }
      if (sec.tool) setMode(sec.tool);
      scrollToId(sec.id, smooth);
    },
    [setMode],
  );

  // প্রথমবার খোলা, Back/Forward বা মেনুর ক্লিক — সবই এখানে এসে সেকশনে স্ক্রল করে
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('tool'); // পুরনো PWA শর্টকাট (?tool=signature)
    if (t === 'photo' || t === 'signature') window.history.replaceState({}, '', `/${t}`);
    const first = currentPath();
    if (first !== PATHS.home) lockUntil.current = Date.now() + 1500; // সরাসরি /signature ইত্যাদিতে ঢুকলে আগে সেখানে যাই
    if (first !== PATHS.home) setTimeout(() => applyPath(currentPath(), false), 150);
    const on = () => {
      const p = currentPath();
      if (isHomePath(p)) applyPath(p);
    };
    window.addEventListener('popstate', on);
    window.addEventListener('bdir-nav', on);
    return () => {
      window.removeEventListener('popstate', on);
      window.removeEventListener('bdir-nav', on);
    };
  }, [applyPath]);

  // স্ক্রল করলে কোন সেকশনে আছেন, URL নিজে থেকে সেটাই দেখায় (/photo, /presets, /how ...)
  const track = useCallback(() => {
    if (Date.now() < lockUntil.current) return;
    if (!isHomePath(currentPath())) return;
    const line = window.innerHeight * 0.4;
    let active = null;
    for (const id of ORDER) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= line) active = id;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) active = 'why';
    setUrl(active === null ? PATHS.home : active === 'workspace' ? `/${modeRef.current}` : `/${active}`);
  }, []);

  useEffect(() => {
    let raf = 0;
    let tail = 0;
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; track(); });
      clearTimeout(tail);
      tail = setTimeout(track, 180); // স্ক্রল থামার পর শেষবার মিলিয়ে নেওয়া
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
      clearTimeout(tail);
    };
  }, [track]);

  // ওয়ার্কস্পেসের ছবি/স্বাক্ষর ট্যাব বদলালে URL-ও বদলায়
  useEffect(() => {
    track();
  }, [mode, track]);

  const applyAndScroll = useCallback(
    (p) => {
      applyPreset(p);
      navigate(p.kind === 'signature' ? PATHS.signature : PATHS.photo);
    },
    [applyPreset],
  );

  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-brand px-4 py-2 text-onbrand focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        মূল অংশে যান
      </a>
      <ScrollProgress />
      <CursorGlow />
      <Header theme={theme} onToggleTheme={toggle} install={install} />
      <main id="main">
        <Hero install={install} onStart={() => navigate(PATHS.photo)} />
        <Marquee items={USES} className="pb-8" />
        <Workspace ws={ws} presets={presets} />
        <PresetsSection presets={presets} onApply={applyAndScroll} />
        <HowItWorks />
        <WhyUs />
      </main>
      <Footer />
    </>
  );
}
