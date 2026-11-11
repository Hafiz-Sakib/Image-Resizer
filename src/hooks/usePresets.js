import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_PRESETS } from '../data/presets.js';
import { MIN_DIM, MAX_DIM } from '../utils/imageResize.js';

// শুধু প্রিসেটের কনফিগারেশন সংরক্ষিত হয় — কোনো ছবি বা ছবির ডেটা নয়
const KEY = 'bdir.presets.v1';

const FORMATS = ['jpeg', 'png'];
const FITS = ['crop', 'fit'];

function sanitize(p) {
  if (!p || typeof p !== 'object') return null;
  const width = Number(p.width);
  const height = Number(p.height);
  const name = typeof p.name === 'string' ? p.name.trim().slice(0, 40) : '';
  if (!name || !(width >= MIN_DIM && width <= MAX_DIM) || !(height >= MIN_DIM && height <= MAX_DIM)) return null;
  const maxKB = p.maxKB == null || p.maxKB === '' ? null : Number(p.maxKB);
  if (maxKB != null && !(maxKB >= 1 && maxKB <= 20000)) return null;
  const minKB = p.minKB == null || p.minKB === '' ? null : Number(p.minKB);
  if (minKB != null && !(minKB >= 1 && minKB <= 20000)) return null;
  return {
    id: typeof p.id === 'string' && p.id ? p.id : newId(),
    name,
    kind: p.kind === 'signature' ? 'signature' : 'photo',
    width: Math.round(width),
    height: Math.round(height),
    maxKB,
    minKB,
    format: FORMATS.includes(p.format) ? p.format : 'jpeg',
    fit: FITS.includes(p.fit) ? p.fit : p.kind === 'signature' ? 'fit' : 'crop',
    builtIn: Boolean(p.builtIn),
  };
}

function newId() {
  return `u_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PRESETS;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return DEFAULT_PRESETS;
    return arr.map(sanitize).filter(Boolean);
  } catch {
    return DEFAULT_PRESETS;
  }
}

export default function usePresets() {
  const [list, setList] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch {
      /* সংরক্ষণ সম্ভব না হলেও অ্যাপ চলবে */
    }
  }, [list]);

  const add = useCallback((data) => {
    const p = sanitize({ ...data, id: newId(), builtIn: false });
    if (p) setList((l) => [...l, p]);
    return p;
  }, []);

  const update = useCallback((id, data) => {
    setList((l) =>
      l.map((p) => (p.id === id ? sanitize({ ...p, ...data, id, builtIn: p.builtIn }) || p : p)),
    );
  }, []);

  const remove = useCallback((id) => setList((l) => l.filter((p) => p.id !== id)), []);
  const reset = useCallback(() => setList(DEFAULT_PRESETS), []);

  return { list, add, update, remove, reset };
}
