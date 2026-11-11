import { useRef } from 'react';
import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { MAX_ZOOM, getCropRect, moveRect, rectToCrop, resizeRectFromCorner } from '../utils/imageCrop.js';

const CORNERS = {
  nw: 'left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize',
  ne: 'right-0 top-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize',
  sw: 'left-0 bottom-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize',
  se: 'right-0 bottom-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize',
};
const CORNER_LABEL = {
  nw: 'উপরের বাম কোণ',
  ne: 'উপরের ডান কোণ',
  sw: 'নিচের বাম কোণ',
  se: 'নিচের ডান কোণ',
};

/**
 * ইন্টারঅ্যাকটিভ ক্রপ এডিটর: আয়তক্ষেত্র টেনে সরানো, কোণ ধরে বড়/ছোট করা, জুম স্লাইডার ও কিবোর্ড সমর্থন।
 * আয়তক্ষেত্রের অনুপাত সবসময় আউটপুটের অনুপাতের সমান।
 */
export default function CropEditor({ src, srcW, srcH, aspect, crop, onChange, onReset }) {
  const wrapRef = useRef(null);
  const drag = useRef(null);

  const rect = getCropRect(srcW, srcH, aspect, crop);
  const pct = {
    left: `${(rect.x / srcW) * 100}%`,
    top: `${(rect.y / srcH) * 100}%`,
    width: `${(rect.w / srcW) * 100}%`,
    height: `${(rect.h / srcH) * 100}%`,
  };

  // পর্দার পিক্সেল → মূল ছবির পিক্সেল
  const toSrc = (e) => {
    const b = wrapRef.current.getBoundingClientRect();
    return { x: ((e.clientX - b.left) / b.width) * srcW, y: ((e.clientY - b.top) / b.height) * srcH };
  };
  const commit = (r) => onChange(rectToCrop(srcW, srcH, aspect, r));

  const startMove = (e) => {
    if (e.target !== e.currentTarget && e.target.dataset.handle) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { type: 'move', start: toSrc(e), rect };
  };
  const startResize = (corner) => (e) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { type: 'resize', corner, rect };
  };
  const onMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const p = toSrc(e);
    if (d.type === 'move') {
      commit(moveRect(d.rect, p.x - d.start.x, p.y - d.start.y, srcW, srcH));
    } else {
      commit(resizeRectFromCorner(d.rect, d.corner, p, srcW, srcH, aspect));
    }
  };
  const end = () => (drag.current = null);

  const setZoom = (z) => onChange({ ...crop, ...rectToCrop(srcW, srcH, aspect, rect), zoom: Math.min(MAX_ZOOM, Math.max(1, z)) });

  const onKey = (e) => {
    const step = Math.max(srcW, srcH) * 0.01 * (e.shiftKey ? 5 : 1);
    const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (moves[e.key]) {
      e.preventDefault();
      commit(moveRect(rect, moves[e.key][0], moves[e.key][1], srcW, srcH));
    } else if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      setZoom(crop.zoom * 1.1);
    } else if (e.key === '-') {
      e.preventDefault();
      setZoom(crop.zoom / 1.1);
    }
  };

  return (
    <div className="space-y-3">
      <div
        ref={wrapRef}
        className="relative mx-auto w-fit max-w-full touch-none select-none overflow-hidden rounded-xl border border-line bg-sunken"
      >
        <img
          src={src}
          alt="ক্রপ করার জন্য মূল ছবি"
          draggable="false"
          className="pointer-events-none block h-auto max-h-[26rem] w-auto max-w-full"
        />
        <div
          role="group"
          tabIndex={0}
          aria-label="ক্রপ এলাকা। তীর চিহ্নের কী দিয়ে সরান, প্লাস ও মাইনাস কী দিয়ে জুম করুন।"
          onKeyDown={onKey}
          onPointerDown={startMove}
          onPointerMove={onMove}
          onPointerUp={end}
          onPointerCancel={end}
          data-testid="crop-rect"
          className="absolute cursor-move border-2 border-white outline-offset-2"
          style={{ ...pct, boxShadow: '0 0 0 9999px rgba(0,0,0,.58)' }}
        >
          {/* তৃতীয়াংশের গাইড লাইন */}
          <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3" aria-hidden="true">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className="border border-white/25" />
            ))}
          </div>
          {Object.entries(CORNERS).map(([c, cls]) => (
            <span
              key={c}
              data-handle="1"
              role="presentation"
              title={`${CORNER_LABEL[c]} ধরে টেনে ক্রপ এলাকা বদলান`}
              onPointerDown={startResize(c)}
              onPointerMove={onMove}
              onPointerUp={end}
              onPointerCancel={end}
              className={`absolute grid h-8 w-8 place-items-center ${cls}`}
            >
              <span className="h-4 w-4 rounded-sm border-2 border-brand bg-white shadow" />
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setZoom(crop.zoom / 1.25)} className="btn-ghost h-11 w-11 px-0" aria-label="জুম আউট">
          <ZoomOut size={18} aria-hidden="true" />
        </button>
        <div className="min-w-[8rem] flex-1">
          <label htmlFor="crop-zoom" className="sr-only">
            ক্রপ জুম
          </label>
          <input
            id="crop-zoom"
            type="range"
            min="100"
            max={MAX_ZOOM * 100}
            step="5"
            value={Math.round(crop.zoom * 100)}
            onChange={(e) => setZoom(Number(e.target.value) / 100)}
            className="h-2 w-full cursor-pointer accent-[rgb(var(--brand))]"
            aria-valuetext={`জুম ${Math.round(crop.zoom * 100)} শতাংশ`}
          />
        </div>
        <button type="button" onClick={() => setZoom(crop.zoom * 1.25)} className="btn-ghost h-11 w-11 px-0" aria-label="জুম ইন">
          <ZoomIn size={18} aria-hidden="true" />
        </button>
        <button type="button" onClick={onReset} className="btn-ghost px-4 text-sm">
          <RotateCcw size={16} aria-hidden="true" /> রিসেট
        </button>
      </div>
      <p className="text-xs text-muted">সাদা বক্সটি টেনে সরান; কোণ ধরে টানলে এলাকা বড়-ছোট হবে। বক্সের ভেতরের অংশটিই চূড়ান্ত ছবিতে থাকবে।</p>
    </div>
  );
}
