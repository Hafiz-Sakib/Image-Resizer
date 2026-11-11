import { useCallback, useEffect, useRef, useState } from 'react';
import { createEngine } from '../utils/imageEngine.js';
import { validateFile } from '../utils/imageValidation.js';
import { MESSAGES } from '../data/messages.js';

const EMPTY = { url: null, info: null, loading: false, error: null, notice: null };

/** ছবি নির্বাচন, যাচাই, লোড ও মুছে ফেলা। প্রসেসিং ইঞ্জিনের মালিকও এই হুক */
export default function useImageUpload() {
  const [engine] = useState(createEngine);
  const [state, setState] = useState(EMPTY);
  const token = useRef(0);
  const urlRef = useRef(null);

  const swapUrl = (url) => {
    const old = urlRef.current;
    urlRef.current = url;
    if (old) setTimeout(() => URL.revokeObjectURL(old), 500);
  };

  const select = useCallback(
    async (fileList) => {
      const files = Array.from(fileList || []);
      if (!files.length) return;
      const file = files[0];
      const mine = ++token.current;
      const notice = files.length > 1 ? 'একাধিক ছবি নির্বাচন করা হয়েছে; শুধু প্রথম ছবিটি নেওয়া হয়েছে।' : null;
      setState((s) => ({ ...s, loading: true, error: null, notice: null }));

      const v = await validateFile(file);
      if (mine !== token.current) return;
      if (!v.ok) {
        setState((s) => ({ ...s, loading: false, error: v.error }));
        return;
      }
      try {
        const meta = await engine.load(file, v.type);
        if (mine !== token.current) return;
        const url = URL.createObjectURL(file);
        swapUrl(url);
        setState({
          url,
          loading: false,
          error: null,
          notice,
          info: { ...meta, size: file.size, type: v.type, name: file.name },
        });
      } catch (err) {
        if (err.code === 'TERMINATED' || mine !== token.current) return;
        setState((s) => ({ ...s, loading: false, error: MESSAGES[err.code] || MESSAGES.DECODE_FAILED }));
      }
    },
    [engine],
  );

  const remove = useCallback(() => {
    token.current++;
    engine.clear();
    swapUrl(null);
    setState(EMPTY);
  }, [engine]);

  const dismissError = useCallback(() => setState((s) => ({ ...s, error: null })), []);

  // কম্পোনেন্ট বন্ধ হলে Object URL ও ইঞ্জিনের মেমরি ছেড়ে দেওয়া
  useEffect(
    () => () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      engine.dispose();
    },
    [engine],
  );

  return { engine, ...state, select, remove, dismissError };
}
