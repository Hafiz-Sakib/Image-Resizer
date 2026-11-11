import { Spinner, cx } from './ui.jsx';

/** একটি ছবি-কার্ড: শিরোনাম, প্রিভিউ ও তথ্যের তালিকা */
export default function ImagePreview({ title, tone = 'default', src, alt, specs, checker, busy, naturalWidth, placeholder }) {
  return (
    <article className={cx('card overflow-hidden', tone === 'brand' && 'border-brand/40 ring-1 ring-brand/20')}>
      <header className={cx('flex items-center justify-between px-4 py-2.5 text-sm font-semibold', tone === 'brand' ? 'bg-brandsoft text-brand' : 'bg-sunken')}>
        <h4>{title}</h4>
        {busy && (
          <span className="flex items-center gap-1.5 text-xs font-medium">
            <Spinner size={14} /> প্রসেস হচ্ছে…
          </span>
        )}
      </header>

      <div className={cx('relative grid min-h-[11rem] place-items-center p-3', checker && 'checker')}>
        {src ? (
          <img
            src={src}
            alt={alt}
            draggable="false"
            style={naturalWidth ? { maxWidth: `min(100%, ${Math.max(naturalWidth, 220)}px)` } : undefined}
            className={cx('block h-auto max-h-[18rem] w-auto max-w-full rounded-md shadow-sm transition-opacity', busy && 'opacity-60')}
          />
        ) : (
          <div className="relative h-32 w-full max-w-[14rem] overflow-hidden rounded-xl bg-sunken text-center text-sm text-muted">
            <span className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-surface/70 to-transparent" />
            <span className="grid h-full place-items-center">{placeholder}</span>
          </div>
        )}
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line p-4 text-sm">
        {specs.map(([k, v, testid]) => (
          <div key={k} className="min-w-0">
            <dt className="text-xs text-muted">{k}</dt>
            <dd className="truncate font-semibold" data-testid={testid}>
              {v}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
