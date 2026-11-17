import { useRef } from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import { Alert, Spinner } from './ui.jsx';
import { FileDrop } from './file-drop.jsx';
import { ACCEPT, MAX_FILE_BYTES } from '../utils/imageValidation.js';
import { formatBytes, formatNumber } from '../utils/format.js';

const FORMAT_NAME = { 'image/jpeg': 'JPEG', 'image/png': 'PNG', 'image/webp': 'WebP' };

export default function ImageUploader({ upload }) {
  const { url, info, loading, error, notice, select, remove, dismissError } = upload;
  const inputRef = useRef(null);
  const openPicker = () => inputRef.current?.click();

  // ফাইল পড়ার সময় আসল অগ্রগতি দেখায়, তারপর যাচাই ও লোড করে
  const uploadFile = async (file, progress) => {
    await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onprogress = (e) => e.lengthComputable && progress((e.loaded / e.total) * 85);
      r.onerror = () => reject(new Error('ফাইল পড়া যায়নি।'));
      r.onload = () => { progress(90); resolve(); };
      r.readAsArrayBuffer(file);
    });
    const ok = await select([file]);
    if (!ok) throw Object.assign(new Error('rejected'), { silent: true }); // কারণ নিচের বার্তায় দেখানো হবে
    progress(100);
  };

  return (
    <div className="space-y-3">
      <input ref={inputRef} type="file" accept={ACCEPT} className="sr-only" tabIndex={-1} aria-label="ছবি পরিবর্তন করুন" onChange={(e) => { select(e.target.files); e.target.value = ''; }} />
      {!info ? (
        <FileDrop maxSize={MAX_FILE_BYTES} upload={uploadFile} />
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
