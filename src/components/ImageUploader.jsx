import { useRef, useState } from 'react';
import { ImagePlus, RefreshCw, Trash2, UploadCloud } from 'lucide-react';
import { Alert, Spinner, cx } from './ui.jsx';
import { ACCEPT } from '../utils/imageValidation.js';
import { formatBytes, formatNumber } from '../utils/format.js';

const FORMAT_NAME = { 'image/jpeg': 'JPEG', 'image/png': 'PNG', 'image/webp': 'WebP' };

export default function ImageUploader({ upload }) {
  const { url, info, loading, error, notice, select, remove, dismissError } = upload;
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const openPicker = () => inputRef.current?.click();
  const onFiles = (files) => select(files);

  const input = (
    <input
      ref={inputRef}
      type="file"
      accept={ACCEPT}
      className="sr-only"
      tabIndex={-1}
      aria-label="ছবি নির্বাচন করুন"
      data-testid="file-input"
      onChange={(e) => {
        onFiles(e.target.files);
        e.target.value = ''; // একই ফাইল আবার বাছলেও যেন কাজ করে
      }}
    />
  );

  return (
    <div className="space-y-3">
      {input}

      {!info ? (
        <div
          role="button"
          tabIndex={0}
          aria-label="ছবি আপলোড করুন — ক্লিক করুন বা ছবি টেনে এনে ছাড়ুন"
          onClick={openPicker}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openPicker();
            }
          }}
          onDragEnter={(e) => (e.preventDefault(), setDragging(true))}
          onDragOver={(e) => (e.preventDefault(), setDragging(true))}
          onDragLeave={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            onFiles(e.dataTransfer.files);
          }}
          className={cx(
            'relative flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-5 py-10 text-center transition',
            dragging ? 'border-brand bg-brandsoft' : 'border-line bg-sunken/50 hover:border-brand/60 hover:bg-brandsoft/60',
          )}
        >
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand text-onbrand shadow-card">
            {loading ? <Spinner size={30} /> : <UploadCloud size={30} aria-hidden="true" />}
          </span>
          <div>
            <p className="text-xl font-semibold">{loading ? 'ছবি লোড হচ্ছে…' : 'আপনার ছবি আপলোড করুন'}</p>
            <p className="mt-1 text-sm text-muted">
              এখানে ছবি ড্র্যাগ করে আনুন অথবা ক্লিক করে আপনার ডিভাইস থেকে ছবি নির্বাচন করুন।
            </p>
          </div>
          <span className="btn-primary mt-1 pointer-events-none">
            <ImagePlus size={18} aria-hidden="true" /> ছবি নির্বাচন করুন
          </span>
          <p className="text-xs text-muted">সমর্থিত ফরম্যাট: JPG, PNG, WEBP</p>
        </div>
      ) : (
        <div className="relative flex items-center gap-3 rounded-2xl border border-line bg-sunken/50 p-3">
          <img
            src={url}
            alt="আপলোড করা ছবির ছোট প্রিভিউ"
            className="h-20 w-20 shrink-0 rounded-xl border border-line bg-surface object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold" title={info.name}>
              {info.name}
            </p>
            <p className="text-sm text-muted">
              {formatNumber(info.width)} × {formatNumber(info.height)} px · {formatBytes(info.size)} ·{' '}
              {FORMAT_NAME[info.type]}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" onClick={openPicker} className="btn-ghost min-h-[2.5rem] px-3 text-sm">
                <RefreshCw size={16} aria-hidden="true" /> ছবি পরিবর্তন
              </button>
              <button type="button" onClick={remove} className="btn-danger min-h-[2.5rem] px-3 text-sm">
                <Trash2 size={16} aria-hidden="true" /> মুছে ফেলুন
              </button>
            </div>
          </div>
          {loading && (
            <div className="absolute inset-0 grid place-items-center rounded-2xl bg-surface/80 backdrop-blur-sm">
              <span className="flex items-center gap-2 font-medium">
                <Spinner /> ছবি লোড হচ্ছে…
              </span>
            </div>
          )}
        </div>
      )}

      {info && info.size > 8 * 1024 * 1024 && (
        <Alert tone="info">এটি একটি বড় ছবি, তাই প্রসেস হতে একটু বেশি সময় লাগতে পারে।</Alert>
      )}
      {notice && <Alert tone="info">{notice}</Alert>}
      {error && (
        <Alert tone="err" title="ছবি নেওয়া যায়নি">
          {error}{' '}
          <button type="button" onClick={dismissError} className="font-semibold underline">
            বন্ধ করুন
          </button>
        </Alert>
      )}
    </div>
  );
}
