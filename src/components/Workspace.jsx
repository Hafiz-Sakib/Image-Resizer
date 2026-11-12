import { useEffect } from 'react';
import { Crop, FileType2, Image as ImageIcon, PenLine, Ruler, Scaling, Sparkles, Weight } from 'lucide-react';
import { SectionHeading, Panel, cx } from './ui.jsx';
import ImageUploader from './ImageUploader.jsx';
import PresetSelector from './PresetSelector.jsx';
import DimensionControls from './DimensionControls.jsx';
import CompressionControls from './CompressionControls.jsx';
import FormatSelector from './FormatSelector.jsx';
import SignatureEnhance from './SignatureEnhance.jsx';
import CropEditor from './CropEditor.jsx';
import ImagePreview from './ImagePreview.jsx';
import ResultStatus from './ResultStatus.jsx';
import DownloadButton from './DownloadButton.jsx';
import PrivacyNotice from './PrivacyNotice.jsx';
import useImageUpload from '../hooks/useImageUpload.js';
import useImageProcessor from '../hooks/useImageProcessor.js';
import { formatBytes, formatNumber } from '../utils/format.js';

const FORMAT_NAME = { jpeg: 'JPEG', png: 'PNG', webp: 'WebP' };
const SRC_FORMAT = { 'image/jpeg': 'JPEG', 'image/png': 'PNG', 'image/webp': 'WebP' };

function ModeTabs({ mode, onChange }) {
  const tabs = [
    { id: 'photo', label: 'ছবি রিসাইজ', icon: ImageIcon },
    { id: 'signature', label: 'স্বাক্ষর রিসাইজ', icon: PenLine },
  ];
  return (
    <div role="tablist" aria-label="কাজের ধরন" className="mx-auto mb-8 flex w-full max-w-md gap-1 rounded-2xl border border-line bg-sunken p-1">
      {tabs.map(({ id, label, icon: I }) => (
        <button
          key={id}
          role="tab"
          type="button"
          aria-selected={mode === id}
          onClick={() => onChange(id)}
          className={cx(
            'flex min-h-[2.75rem] flex-1 items-center justify-center gap-2 rounded-xl px-3 font-semibold transition',
            mode === id ? 'bg-surface text-brand shadow-card' : 'text-muted hover:text-ink',
          )}
        >
          <I size={18} aria-hidden="true" /> {label}
        </button>
      ))}
    </div>
  );
}

export default function Workspace({ ws, presets }) {
  const { settings: s, actions: a, errors, maxKB, compression, ratio } = ws;
  const upload = useImageUpload();
  const { info, url } = upload;
  const hasErrors = Object.keys(errors).length > 0;
  const proc = useImageProcessor({ engine: upload.engine, info, settings: s, maxKB, hasErrors });

  // ছবি লোড/মোছা হলে সেটিংসকে জানানো
  useEffect(() => {
    if (info) a.onImageLoaded(info);
    else a.onImageRemoved();
  }, [info, a]);

  // ক্লিপবোর্ড থেকে পেস্ট (Ctrl+V) করেও ছবি নেওয়া যায়
  useEffect(() => {
    const onPaste = (e) => {
      const files = Array.from(e.clipboardData?.files || []).filter((f) => f.type.startsWith('image/'));
      if (files.length) upload.select(files);
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [upload.select]);

  const outW = Number(s.width);
  const outH = Number(s.height);
  const showCrop = info && s.fit === 'crop' && !errors.width && !errors.height;
  const result = proc.result;

  return (
    <section id="workspace" className="scroll-mt-20 border-y border-line bg-sunken/40 py-12 sm:py-16" aria-labelledby="ws-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="ওয়ার্কস্পেস"
          title={<span id="ws-title">আপনার ছবি প্রস্তুত করুন</span>}
          desc="ছবি আপলোড করুন, আবেদনের বিজ্ঞপ্তি অনুযায়ী মাপ ও KB দিন — প্রস্তুত ছবি সঙ্গে সঙ্গে দেখতে পাবেন।"
        />
        <ModeTabs mode={s.mode} onChange={a.setMode} />

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* ===== বাম প্যানেল: সেটিংস ===== */}
          <div className="min-w-0 space-y-3 sm:space-y-5">
            <Panel step="১" title="ছবি আপলোড" hint={s.mode === 'signature' ? 'স্বাক্ষরের ছবি বা স্ক্যান নির্বাচন করুন' : 'রঙিন ছবি দিন — কিছু পোর্টালে সাদা-কালো ছবি গ্রহণ করা হয় না'}>
              <ImageUploader upload={upload} />
            </Panel>

            <Panel step="২" title="প্রিসেট" hint="দ্রুত শুরু করতে একটি প্রিসেট বেছে নিন">
              <PresetSelector presets={presets} settings={s} actions={a} maxKB={maxKB} />
            </Panel>

            <Panel step="৩" title="মাপ (Pixel)" hint="আবেদনে চাওয়া প্রস্থ ও উচ্চতা লিখুন">
              <DimensionControls settings={s} actions={a} errors={errors} />
            </Panel>

            <Panel step="৪" title="ফাইল সাইজ (KB)" hint="সর্বোচ্চ কত KB-এর মধ্যে চাই">
              <CompressionControls settings={s} actions={a} compression={compression} errors={errors} />
            </Panel>

            <Panel step="৫" title="ফরম্যাট" hint="ডাউনলোড সব সময় JPG">
              <FormatSelector settings={s} actions={a} info={info} />
            </Panel>

            {s.mode === 'signature' && (
              <Panel icon={Sparkles} title="স্বাক্ষর পরিষ্কার করা" hint="ঐচ্ছিক — ছবি থেকে তোলা স্বাক্ষরের জন্য">
                <SignatureEnhance settings={s} actions={a} />
              </Panel>
            )}
          </div>

          {/* ===== ডান প্যানেল: প্রিভিউ (ডেস্কটপে স্ক্রল করলেও চোখের সামনে থাকে) ===== */}
          <div className="min-w-0 space-y-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:self-start lg:pb-2">
            {!info ? (
              <div className="card grid place-items-center gap-3 px-6 py-16 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brandsoft text-brand">
                  <Scaling size={30} aria-hidden="true" />
                </span>
                <h3 className="text-xl font-semibold">এখনও কোনো ছবি নেই</h3>
                <p className="max-w-sm text-muted">
                  বাম পাশ থেকে একটি ছবি আপলোড করলে মূল ছবি ও প্রস্তুত ছবির তুলনামূলক প্রিভিউ এখানে দেখা যাবে। ছবি পেস্ট (Ctrl + V) করেও দিতে পারেন।
                </p>
                <PrivacyNotice />
              </div>
            ) : (
              <>
                {showCrop && (
                  <Panel icon={Crop} title="ক্রপ এলাকা নির্ধারণ" hint="ছবির কোন অংশ থাকবে তা নিজে ঠিক করুন">
                    <CropEditor
                      src={url}
                      srcW={info.width}
                      srcH={info.height}
                      aspect={outW / outH}
                      crop={s.crop}
                      onChange={a.setCrop}
                      onReset={a.resetCrop}
                    />
                  </Panel>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <ImagePreview
                    title="মূল ছবি"
                    src={url}
                    alt="আপনার আপলোড করা মূল ছবি"
                    checker={info.hasAlpha}
                    specs={[
                      ['মাপ', `${formatNumber(info.width)} × ${formatNumber(info.height)} px`, 'orig-dims'],
                      ['ফাইল সাইজ', formatBytes(info.size), 'orig-size'],
                      ['ফরম্যাট', SRC_FORMAT[info.type], 'orig-format'],
                      ['স্বচ্ছতা', info.hasAlpha ? 'আছে' : 'নেই'],
                    ]}
                  />
                  <ImagePreview
                    title="প্রস্তুতকৃত ছবি"
                    tone="brand"
                    src={proc.url}
                    alt="প্রস্তুতকৃত ছবির প্রিভিউ"
                                        busy={proc.busy}
                    naturalWidth={result?.width}
                    placeholder="প্রস্তুত হচ্ছে…"
                    specs={[
                      ['মাপ', result ? `${result.width} × ${result.height} px` : '—', 'out-dims'],
                      ['ফাইল সাইজ', result ? formatBytes(result.size) : '—', 'out-size'],
                      ['ফরম্যাট', FORMAT_NAME[s.format], 'out-format'],
                      [
                        'কোয়ালিটি',
                        result?.quality != null ? `${Math.round(result.quality * 100)}%` : s.format === 'png' ? 'ক্ষতিহীন' : '—',
                        'out-quality',
                      ],
                    ]}
                  />
                </div>

                <div data-testid="result-status">
                  <ResultStatus processor={proc} settings={s} maxKB={maxKB} hasErrors={hasErrors} onSwitchFormat={a.setFormat} />
                </div>

                <DownloadButton processor={proc} settings={s} />
                <PrivacyNotice />
              </>
            )}
          </div>
        </div>
      </div>

      {/* মোবাইলে নিচে স্থির ডাউনলোড বার */}
      {info && result && (
        <div
          className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 px-4 py-3 shadow-pop backdrop-blur lg:hidden"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          <div className="mx-auto flex max-w-md items-center gap-3">
            <div className="min-w-0 flex-1 text-sm leading-tight">
              <p className={cx('font-semibold', result.met ? 'text-ok' : 'text-warn')}>{formatBytes(result.size)}</p>
              <p className="truncate text-xs text-muted">
                {result.width}×{result.height} · {FORMAT_NAME[s.format]}
              </p>
            </div>
            <DownloadButton processor={proc} settings={s} compact />
          </div>
        </div>
      )}
      {info && result && <div className="h-16 lg:hidden" aria-hidden="true" />}
    </section>
  );
}
