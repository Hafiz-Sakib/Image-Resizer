import { useCallback, useEffect } from 'react';
import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import Workspace from '../components/Workspace.jsx';
import PresetsSection from '../components/PresetsSection.jsx';
import { WhyUs, PrivacySection } from '../components/InfoSections.jsx';
import Footer from '../components/Footer.jsx';
import useTheme from '../hooks/useTheme.js';
import usePresets from '../hooks/usePresets.js';
import useSettings from '../hooks/useSettings.js';
import useInstall from '../hooks/useInstall.js';
import { takePending } from '../utils/router.js';

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

export default function Home() {
  const { theme, toggle } = useTheme();
  const presets = usePresets();
  const ws = useSettings(presets.list);
  const install = useInstall();
  const { setMode, applyPreset } = ws.actions;

  const openTool = useCallback(
    (mode) => {
      setMode(mode);
      scrollToId('workspace');
    },
    [setMode],
  );

  // PWA শর্টকাট (?tool=signature) থেকে সরাসরি টুল খোলা
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('tool');
    if (t === 'photo' || t === 'signature') setTimeout(() => openTool(t), 300);
    // অন্য পেজ (যেমন ডেভেলপার) থেকে হোমের কোনো সেকশনে আসার অনুরোধ
    const p = takePending();
    if (p) setTimeout(() => (p.tool ? openTool(p.tool) : scrollToId(p.scroll)), 150);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyAndScroll = useCallback(
    (p) => {
      applyPreset(p);
      scrollToId('workspace');
    },
    [applyPreset],
  );

  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-brand px-4 py-2 text-onbrand focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        মূল কনটেন্টে যান
      </a>
      <Header theme={theme} onToggleTheme={toggle} onTool={openTool} onGoto={scrollToId} activeMode={ws.settings.mode} install={install} />
      <main id="main">
        <Hero install={install} onStart={() => openTool('photo')} />
        <Workspace ws={ws} presets={presets} />
        <PresetsSection presets={presets} onApply={applyAndScroll} />
        <WhyUs />
        <PrivacySection />
      </main>
      <Footer onTool={openTool} onGoto={scrollToId} />
    </>
  );
}
