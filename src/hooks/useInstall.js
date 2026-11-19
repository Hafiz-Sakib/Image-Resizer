import { useCallback, useEffect, useState } from 'react';

// ইনস্টল হয়ে গেছে কি না মনে রাখার ফ্ল্যাগ — ব্রাউজার ট্যাবে খুললেও যেন বোতাম না দেখায়
const FLAG = 'bdir.installed';
const readFlag = () => {
  try { return localStorage.getItem(FLAG) === '1'; } catch { return false; }
};
const writeFlag = (on) => {
  try { on ? localStorage.setItem(FLAG, '1') : localStorage.removeItem(FLAG); } catch { /* প্রাইভেট মোডে সংরক্ষণ নাও চলতে পারে */ }
};

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
 * ইনস্টল অবস্থা:
 *  installed  — অ্যাপ হিসেবে চলছে, অথবা এই ডিভাইসে আগেই ইনস্টল করা আছে
 *  headerMode — হেডারের বোতাম: 'prompt' (সরাসরি ইনস্টল) | 'ios' (শেয়ার মেনু থেকে) | 'manual' (ব্রাউজার মেনু থেকে) | null (ইনস্টল করা থাকলে লুকানো)
 *  mode       — হোমের ইনস্টল কার্ড: শুধু মোবাইলে বা সরাসরি প্রম্পট পাওয়া গেলে
 */
export default function useInstall() {
  // beforeinstallprompt এলে বুঝতে হবে অ্যাপ ইনস্টল করা নেই (আনইনস্টল করলে ফ্ল্যাগ নিজে মুছে যায়)
  const [installed, setInstalled] = useState(() => isStandalone() || (readFlag() && !window.__bdirInstallPrompt));
  const [hasPrompt, setHasPrompt] = useState(() => Boolean(window.__bdirInstallPrompt));
  const [env] = useState(detect);

  useEffect(() => {
    const markInstalled = () => {
      setInstalled(true);
      writeFlag(true);
    };

    if (isStandalone()) writeFlag(true);

    const ready = () => {
      setHasPrompt(true);
      if (!isStandalone()) {
        setInstalled(false);
        writeFlag(false);
      }
    };
    const done = () => {
      markInstalled();
      setHasPrompt(false);
      window.__bdirInstallPrompt = null;
    };
    window.addEventListener('bdir-install-ready', ready);
    window.addEventListener('appinstalled', done);

    // অ্যাপ হিসেবে খুললে (display-mode বদলালে) সাথে সাথে ধরা হয়
    const mq = window.matchMedia?.('(display-mode: standalone)');
    const onMode = (e) => e.matches && markInstalled();
    mq?.addEventListener?.('change', onMode);

    // Chrome/Edge: ব্রাউজার ট্যাবে থেকেও জানা যায় এই সাইটের অ্যাপ ইনস্টল করা আছে কি না
    let alive = true;
    navigator.getInstalledRelatedApps?.()
      .then((apps) => alive && apps.some((a) => a.platform === 'webapp') && markInstalled())
      .catch(() => {});

    return () => {
      alive = false;
      window.removeEventListener('bdir-install-ready', ready);
      window.removeEventListener('appinstalled', done);
      mq?.removeEventListener?.('change', onMode);
    };
  }, []);

  const install = useCallback(async () => {
    const ev = window.__bdirInstallPrompt;
    if (!ev) return 'unavailable';
    ev.prompt();
    const { outcome } = await ev.userChoice;
    window.__bdirInstallPrompt = null;
    setHasPrompt(false);
    if (outcome === 'accepted') {
      setInstalled(true);
      writeFlag(true);
    }
    return outcome;
  }, []);

  let mode = null;
  let headerMode = null;
  if (!installed) {
    headerMode = hasPrompt ? 'prompt' : env.ios ? 'ios' : 'manual';
    if (hasPrompt) mode = 'prompt';
    else if (env.ios) mode = 'ios';
    else if (env.mobile) mode = 'manual';
  }
  return { mode, headerMode, installed, install, ios: env.ios, mobile: env.mobile };
}
