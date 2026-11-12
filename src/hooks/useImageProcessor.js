import { useEffect, useMemo, useRef, useState } from 'react';
import useDebounce from './useDebounce.js';
import { kbToBytes } from '../utils/imageExport.js';
import { MESSAGES } from '../data/messages.js';

const IDLE = { status: 'idle', result: null, url: null, error: null };

function buildOptions(s, info, maxKB, hasErrors) {
  if (!info || hasErrors) return null;
  return {
    outW: s.width,
    outH: s.height,
    fit: s.fit,
    crop: s.crop,
    format: 'jpeg', // সব সময় JPG
    maxBytes: maxKB ? kbToBytes(maxKB) : null,
    minBytes: s.minKB ? Math.ceil(Number(s.minKB) * 1024) : null,
    quality: s.quality / 100,
    bg: s.bg,
    enhance: s.mode === 'signature' && s.enhanceOn ? { strength: s.enhanceStrength } : null,
  };
}

/** সেটিংস বদলালে (ডিবাউন্স করে) ইঞ্জিনে প্রসেস চালায় এবং প্রিভিউয়ের Object URL সামলায় */
export default function useImageProcessor({ engine, info, settings, maxKB, hasErrors }) {
  const [state, setState] = useState(IDLE);
  const urlRef = useRef(null);
  const reqRef = useRef(0);

  const key = useMemo(
    () => JSON.stringify(buildOptions(settings, info, maxKB, hasErrors)),
    [settings, info, maxKB, hasErrors],
  );
  const debouncedKey = useDebounce(key, 250);

  const setUrl = (url) => {
    const old = urlRef.current;
    urlRef.current = url;
    if (old) setTimeout(() => URL.revokeObjectURL(old), 800);
  };

  useEffect(() => () => urlRef.current && URL.revokeObjectURL(urlRef.current), []);

  useEffect(() => {
    const opts = JSON.parse(debouncedKey);
    const id = ++reqRef.current;
    if (!opts) {
      setUrl(null);
      setState(IDLE);
      return;
    }
    setState((s) => ({ ...s, status: 'processing', error: null }));
    engine
      .process(opts)
      .then((res) => {
        if (id !== reqRef.current || res.skipped) return;
        const url = URL.createObjectURL(res.blob);
        setUrl(url);
        setState({ status: 'done', result: res, url, error: null });
      })
      .catch((err) => {
        if (id !== reqRef.current || err.code === 'TERMINATED') return;
        setState((s) => ({ ...s, status: 'error', error: MESSAGES[err.code] || MESSAGES.PROCESS_FAILED }));
      });
  }, [engine, debouncedKey]);

  // ইনপুট বদলেছে কিন্তু ডিবাউন্স শেষ হয়নি = এখনও কাজ চলছে
  const busy = state.status === 'processing' || (key !== debouncedKey && key !== 'null');
  return { ...state, busy };
}
