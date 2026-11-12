import { useState } from 'react';
import { Pencil, Plus, RotateCcw, Trash2, Wand2, X, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Alert, NumberField, SectionHeading, ChipGroup, cx } from './ui.jsx';
import { KIND_LABEL } from '../data/presets.js';
import { MAX_DIM, MIN_DIM } from '../utils/imageResize.js';
import { MAX_KB, MIN_KB } from '../utils/imageValidation.js';

const EMPTY = { name: '', kind: 'photo', width: '', height: '', maxKB: '', minKB: '', format: 'jpeg', fit: 'crop' };

function PresetForm({ initial, onSave, onCancel }) {
  const [f, setF] = useState(initial);
  const set = (k) => (v) => setF((x) => ({ ...x, [k]: v }));
  const e = {};
  if (!f.name.trim()) e.name = 'প্রিসেটের একটি নাম দিন।';
  if (f.width === '' || f.width < MIN_DIM || f.width > MAX_DIM) e.width = `${MIN_DIM}–${MAX_DIM} px লিখুন।`;
  if (f.height === '' || f.height < MIN_DIM || f.height > MAX_DIM) e.height = `${MIN_DIM}–${MAX_DIM} px লিখুন।`;
  if (f.maxKB !== '' && (f.maxKB < MIN_KB || f.maxKB > MAX_KB)) e.maxKB = `${MIN_KB}–${MAX_KB} KB লিখুন।`;
  if (f.minKB !== '' && (f.minKB < MIN_KB || f.minKB > MAX_KB || (f.maxKB !== '' && f.minKB > f.maxKB))) e.minKB = 'সঠিক সর্বনিম্ন KB লিখুন (সর্বোচ্চের চেয়ে বেশি নয়)।';
  const invalid = Object.keys(e).length > 0;
  const [touched, setTouched] = useState(false);

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        setTouched(true);
        if (!invalid) onSave({ ...f, name: f.name.trim(), maxKB: f.maxKB === '' ? null : f.maxKB, minKB: f.minKB === '' ? null : f.minKB, fit: f.kind === 'signature' ? 'fit' : 'crop' });
      }}
      className="card space-y-4 border-brand/40 p-5"
      aria-label="প্রিসেট ফর্ম"
    >
      <div>
        <label htmlFor="pf-name" className="mb-1.5 block text-sm font-medium">
          প্রিসেটের নাম
        </label>
        <input
          id="pf-name"
          className="input"
          maxLength={40}
          value={f.name}
          onChange={(ev) => set('name')(ev.target.value)}
          placeholder="যেমন: বিসিএস আবেদনের ছবি"
          aria-invalid={touched && e.name ? 'true' : undefined}
        />
        {touched && e.name && <p role="alert" className="mt-1 text-sm text-err">{e.name}</p>}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <NumberField id="pf-w" label="প্রস্থ" suffix="px" value={f.width} onChange={set('width')} error={touched && e.width} />
        <NumberField id="pf-h" label="উচ্চতা" suffix="px" value={f.height} onChange={set('height')} error={touched && e.height} />
        <NumberField
          id="pf-min"
          label="সর্বনিম্ন সাইজ (ঐচ্ছিক)"
          suffix="KB"
          value={f.minKB}
          onChange={set('minKB')}
          error={touched && e.minKB}
        />
        <NumberField
          id="pf-kb"
          label="সর্বোচ্চ সাইজ (ঐচ্ছিক)"
          suffix="KB"
          value={f.maxKB}
          onChange={set('maxKB')}
          error={touched && e.maxKB}
          hint="খালি রাখলে সীমা থাকবে না"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ChipGroup
          legend="ধরন"
          name="pf-kind"
          value={f.kind}
          onChange={set('kind')}
          options={[
            { value: 'photo', label: 'ছবি' },
            { value: 'signature', label: 'স্বাক্ষর' },
          ]}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="submit" className="btn-primary px-5">
          <Check size={18} aria-hidden="true" /> সংরক্ষণ করুন
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost px-5">
          <X size={18} aria-hidden="true" /> বাতিল
        </button>
      </div>
    </form>
  );
}

export default function PresetsSection({ presets, onApply }) {
  const [editing, setEditing] = useState(null); // null | 'new' | id
  const [confirmId, setConfirmId] = useState(null);

  const editingPreset = editing && editing !== 'new' ? presets.list.find((p) => p.id === editing) : null;

  return (
    <section id="presets" className="scroll-mt-20 py-14 sm:py-20" aria-labelledby="presets-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="প্রিসেট"
          title={<span id="presets-title">রেডি-মেইড প্রিসেট</span>}
          desc="সাধারণ মাপের কয়েকটি উদাহরণ প্রিসেট দেওয়া আছে। নিজের প্রয়োজনমতো সম্পাদনা করুন বা নতুন প্রিসেট বানিয়ে রাখুন — এগুলো আপনার ব্রাউজারেই সংরক্ষিত থাকবে।"
        />

        <Alert tone="info" className="mx-auto mb-8 max-w-3xl" title="গুরুত্বপূর্ণ">
          এগুলো সাধারণ উদাহরণ, সব সরকারি বা বেসরকারি আবেদনের বাধ্যতামূলক মাপ নয়। প্রতিটি বিজ্ঞপ্তির মাপ ও ফাইল সাইজ আলাদা হতে পারে — তাই আবেদনের বিজ্ঞপ্তি দেখে সঠিক মাপ ও KB নিজে লিখে নিন।
        </Alert>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {presets.list.map((p, i) => (
            <motion.li
              key={p.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: Math.min(i, 5) * 0.05 }}
              className="card flex flex-col gap-3 p-4"
              data-testid="preset-card"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-semibold" title={p.name}>
                    {p.name}
                  </h3>
                  <p className="text-xs text-muted">{KIND_LABEL[p.kind]}</p>
                </div>
                {p.builtIn && <span className="rounded-full bg-brandsoft px-2 py-0.5 text-[0.7rem] font-medium text-brand">উদাহরণ</span>}
              </div>
              <p className="text-2xl font-bold text-brand">
                {p.width} × {p.height}
                <span className="ml-1 text-sm font-medium text-muted">px</span>
              </p>
              <p className="text-sm text-muted">
                {p.minKB ? `${p.minKB}–` : ''}{p.maxKB ? `${p.maxKB} KB` : 'সাইজ সীমা নেই'} · {{ jpeg: 'JPEG', png: 'PNG', webp: 'WebP' }[p.format] || 'JPEG'}
              </p>
              <div className="mt-auto flex flex-wrap gap-2 pt-1">
                <button type="button" onClick={() => onApply(p)} className="btn-primary min-h-[2.5rem] flex-1 px-3 text-sm">
                  <Wand2 size={16} aria-hidden="true" /> ব্যবহার করুন
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(p.id)}
                  className="btn-ghost min-h-[2.5rem] w-11 px-0"
                  aria-label={`${p.name} প্রিসেট সম্পাদনা করুন`}
                >
                  <Pencil size={16} aria-hidden="true" />
                </button>
                {confirmId === p.id ? (
                  <button
                    type="button"
                    onClick={() => (presets.remove(p.id), setConfirmId(null))}
                    onBlur={() => setConfirmId(null)}
                    autoFocus
                    className="btn-danger min-h-[2.5rem] px-3 text-sm"
                  >
                    নিশ্চিত, মুছুন
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmId(p.id)}
                    className="btn-ghost min-h-[2.5rem] w-11 px-0 text-err"
                    aria-label={`${p.name} প্রিসেট মুছে ফেলুন`}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                )}
              </div>
            </motion.li>
          ))}
          {presets.list.length === 0 && (
            <li className="card col-span-full p-8 text-center text-muted">কোনো প্রিসেট নেই। নিচে নতুন প্রিসেট যোগ করুন বা ডিফল্ট প্রিসেট ফিরিয়ে আনুন।</li>
          )}
        </ul>

        <div className="mx-auto mt-8 max-w-3xl space-y-4">
          {editing ? (
            <PresetForm
              key={editing}
              initial={editingPreset ? { ...editingPreset, maxKB: editingPreset.maxKB ?? '', minKB: editingPreset.minKB ?? '' } : EMPTY}
              onCancel={() => setEditing(null)}
              onSave={(data) => {
                if (editingPreset) presets.update(editingPreset.id, data);
                else presets.add(data);
                setEditing(null);
              }}
            />
          ) : (
            <div className={cx('flex flex-wrap justify-center gap-3')}>
              <button type="button" onClick={() => setEditing('new')} className="btn-primary px-6">
                <Plus size={18} aria-hidden="true" /> নতুন প্রিসেট তৈরি করুন
              </button>
              <button type="button" onClick={presets.reset} className="btn-ghost px-6">
                <RotateCcw size={18} aria-hidden="true" /> ডিফল্ট প্রিসেট ফিরিয়ে আনুন
              </button>
            </div>
          )}
          <p className="text-center text-xs text-muted">শুধু প্রিসেটের সেটিংস আপনার ব্রাউজারে সংরক্ষিত হয়। কোনো ছবি কখনোই সংরক্ষণ করা হয় না।</p>
        </div>
      </div>
    </section>
  );
}
