import { useCallback, useEffect, useState } from 'react';

const isStandalone = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true);

function detect() {
  const ua = navigator.userAgent || '';
  const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const mobile = ios || /Android|Mobile/i.test(ua);
  return { ios, mobile };
}

/**
 * ইনস্টল অবস্থা: mode = 'prompt' (সরাসরি ইনস্টল) | 'ios' (শেয়ার মেনু থেকে) | 'manual' (ব্রাউজার মেনু থেকে) | null
 */
export default function useInstall() {
  const [installed, setInstalled] = useState(isStandalone);
  const [hasPrompt, setHasPrompt] = useState(() => Boolean(window.__bdirInstallPrompt));
  const [env] = useState(detect);

  useEffect(() => {
    const ready = () => setHasPrompt(true);
    const done = () => {
      setInstalled(true);
      setHasPrompt(false);
      window.__bdirInstallPrompt = null;
    };
    window.addEventListener('bdir-install-ready', ready);
    window.addEventListener('appinstalled', done);
    return () => {
      window.removeEventListener('bdir-install-ready', ready);
      window.removeEventListener('appinstalled', done);
    };
  }, []);

  const install = useCallback(async () => {
    const ev = window.__bdirInstallPrompt;
    if (!ev) return 'unavailable';
    ev.prompt();
    const { outcome } = await ev.userChoice;
    window.__bdirInstallPrompt = null;
    setHasPrompt(false);
    return outcome;
  }, []);

  let mode = null;
  if (!installed) {
    if (hasPrompt) mode = 'prompt';
    else if (env.ios) mode = 'ios';
    else if (env.mobile) mode = 'manual';
  }
  return { mode, install, ios: env.ios };
}
