import { useMemo, useRef, useState } from 'react';
import { DEFAULT_PRESETS, SIZE_OPTIONS } from '../data/presets.js';
import { DEFAULT_CROP } from '../utils/imageCrop.js';
import { ratioStateFromDims, ratioValue } from '../utils/imageResize.js';
import { validateSettings } from '../utils/imageValidation.js';
import useImageCompression from './useImageCompression.js';

function sizeStateFromKB(kb) {
  if (!kb) return { sizeKey: 'none', customKB: '' };
  if (SIZE_OPTIONS.includes(kb)) return { sizeKey: String(kb), customKB: '' };
  return { sizeKey: 'custom', customKB: kb };
}

function fromPreset(s, p) {
  return {
    ...s,
    mode: p.kind === 'signature' ? 'signature' : 'photo',
    width: p.width,
    height: p.height,
    lock: true,
    ...ratioStateFromDims(p.width, p.height),
    fit: p.fit,
    ...sizeStateFromKB(p.maxKB),
    minKB: p.minKB ?? '',
    format: p.format,
    crop: DEFAULT_CROP,
    activePresetId: p.id,
  };
}

const roundDim = (n) => Math.max(1, Math.round(n));

/** ওয়ার্কস্পেসের সব সেটিংস ও সেগুলো বদলানোর অ্যাকশন */
export default function useSettings(presetList) {
  const presetsRef = useRef(presetList);
  presetsRef.current = presetList;

  const [settings, setSettings] = useState(() =>
    fromPreset(
      {
        mode: 'photo',
        quality: 92,
        minKB: '',
        bg: '#ffffff',
        enhanceOn: false,
        enhanceStrength: 60,
        srcW: null,
        srcH: null,
        customRW: 1,
        customRH: 1,
      },
      DEFAULT_PRESETS[0],
    ),
  );

  const actions = useMemo(() => {
    const set = (fn) => setSettings(fn);
    const patch = (p) => set((s) => ({ ...s, ...p }));

    return {
      patch,

      setWidth: (v) =>
        set((s) => {
          const next = { ...s, width: v, activePresetId: null };
          if (v === '') return next;
          if (s.lock) {
            const r = ratioValue(s);
            if (r) next.height = roundDim(v / r);
          } else if (s.height !== '') {
            Object.assign(next, ratioStateFromDims(v, s.height));
          }
          return next;
        }),

      setHeight: (v) =>
        set((s) => {
          const next = { ...s, height: v, activePresetId: null };
          if (v === '') return next;
          if (s.lock) {
            const r = ratioValue(s);
            if (r) next.width = roundDim(v * r);
          } else if (s.width !== '') {
            Object.assign(next, ratioStateFromDims(s.width, v));
          }
          return next;
        }),

      toggleLock: () =>
        set((s) => {
          if (s.lock) return { ...s, lock: false };
          const next = { ...s, lock: true };
          if (s.width !== '' && s.height !== '') Object.assign(next, ratioStateFromDims(s.width, s.height));
          return next;
        }),

      setRatio: (key) =>
        set((s) => {
          const next = { ...s, ratioKey: key, lock: true, activePresetId: null };
          const r = ratioValue(next);
          if (!r) return next;
          if (s.width !== '') next.height = roundDim(s.width / r);
          else if (s.height !== '') next.width = roundDim(s.height * r);
          return next;
        }),

      setCustomRatio: (rw, rh) =>
        set((s) => {
          const next = { ...s, ratioKey: 'custom', customRW: rw, customRH: rh, lock: true, activePresetId: null };
          const r = ratioValue(next);
          if (r && s.width !== '') next.height = roundDim(s.width / r);
          return next;
        }),

      setFit: (fit) => patch({ fit }),
      setSize: (sizeKey) => patch({ sizeKey }),
      setCustomKB: (customKB) => patch({ sizeKey: 'custom', customKB }),
      setMinKB: (minKB) => patch({ minKB }),
      setQuality: (quality) => patch({ quality }),
      setFormat: (format) => patch({ format }),
      setCrop: (crop) => patch({ crop }),
      resetCrop: () => patch({ crop: DEFAULT_CROP }),
      setEnhance: (p) => patch(p),

      /** ছবি/স্বাক্ষর ট্যাব বদলালে ওই ধরনের প্রথম প্রিসেট প্রয়োগ হয় */
      setMode: (mode) =>
        set((s) => {
          if (s.mode === mode) return s;
          const p = presetsRef.current.find((x) => x.kind === mode);
          return p ? { ...fromPreset(s, p), mode } : { ...s, mode };
        }),

      applyPreset: (p) => set((s) => fromPreset(s, p)),
      clearPreset: () => patch({ activePresetId: null }),

      onImageLoaded: (info) =>
        set((s) => {
          const next = { ...s, srcW: info.width, srcH: info.height, crop: DEFAULT_CROP };
          if (s.ratioKey === 'original' && s.lock && s.width !== '') {
            next.height = roundDim(s.width / (info.width / info.height));
          }
          return next;
        }),

      onImageRemoved: () =>
        set((s) => {
          if (s.srcW == null) return s;
          const next = { ...s, srcW: null, srcH: null, crop: DEFAULT_CROP };
          if (s.ratioKey === 'original' && s.width !== '' && s.height !== '') {
            Object.assign(next, ratioStateFromDims(s.width, s.height));
          }
          return next;
        }),
    };
  }, []);

  const compression = useImageCompression(settings);
  const errors = useMemo(() => validateSettings(settings), [settings]);
  const ratio = useMemo(() => ratioValue(settings), [settings]);

  return { settings, actions, errors, ratio, compression, maxKB: compression.maxKB };
}
