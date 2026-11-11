import { useId } from 'react';
import { AlertTriangle, CheckCircle2, Info, Loader2, XCircle } from 'lucide-react';
import { parseIntInput } from '../utils/format.js';

export function cx(...a) {
  return a.filter(Boolean).join(' ');
}

/** ধাপ-নম্বরসহ কার্ড প্যানেল */
export function Panel({ step, title, icon: Icon, hint, children, className }) {
  return (
    <section className={cx('card p-4 sm:p-5', className)}>
      <header className="mb-4 flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brandsoft text-brand">
          {step ? <span className="text-base font-bold">{step}</span> : Icon && <Icon size={18} aria-hidden="true" />}
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold">{title}</h3>
          {hint && <p className="text-sm text-muted">{hint}</p>}
        </div>
      </header>
      {children}
    </section>
  );
}

export function Spinner({ size = 18, className }) {
  return <Loader2 size={size} className={cx('animate-spin', className)} aria-hidden="true" />;
}

const TONES = {
  ok: { box: 'bg-oksoft text-ok border-ok/30', Icon: CheckCircle2 },
  warn: { box: 'bg-warnsoft text-warn border-warn/30', Icon: AlertTriangle },
  err: { box: 'bg-errsoft text-err border-err/30', Icon: XCircle },
  info: { box: 'bg-brandsoft text-brand border-brand/25', Icon: Info },
};

/** বার্তা বক্স। live=true হলে স্ক্রিন-রিডার নতুন বার্তা পড়ে শোনায় */
export function Alert({ tone = 'info', title, children, live, className, action }) {
  const { box, Icon } = TONES[tone];
  return (
    <div
      role={tone === 'err' ? 'alert' : live ? 'status' : undefined}
      className={cx('flex gap-3 rounded-xl border p-3.5 text-sm', box, className)}
    >
      <Icon size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1 space-y-1">
        {title && <p className="font-semibold leading-snug">{title}</p>}
        {children && <div className="leading-relaxed [&_li]:ml-4 [&_li]:list-disc">{children}</div>}
        {action}
      </div>
    </div>
  );
}

/** সংখ্যার ইনপুট: বাংলা সংখ্যাও লেখা যায় */
export function NumberField({ label, value, onChange, suffix, error, hint, placeholder, id: idProp, disabled }) {
  const auto = useId();
  const id = idProp || auto;
  const errId = `${id}-err`;
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          disabled={disabled}
          placeholder={placeholder}
          value={value === '' || value == null ? '' : String(value)}
          onChange={(e) => onChange(parseIntInput(e.target.value))}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errId : undefined}
          className={cx('input text-lg font-medium', suffix && 'pr-14', error && 'border-err focus:border-err focus:ring-err/20')}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted">{suffix}</span>
        )}
      </div>
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && (
        <p id={errId} role="alert" className="mt-1 text-sm text-err">
          {error}
        </p>
      )}
    </div>
  );
}

/** ছোট বোতামের মতো রেডিও গ্রুপ (নেটিভ রেডিও — কিবোর্ডে তীর চিহ্নে চলে)
 *  প্রতি সারিতে ৩টি কলাম — মোবাইলেও কম জায়গায় বেশি অপশন */
export function ChipGroup({ legend, name, options, value, onChange, className, hideLegend }) {
  return (
    <fieldset className={cx('min-w-0', className)}>
      <legend className={cx('mb-2 text-sm font-medium', hideLegend && 'sr-only')}>{legend}</legend>
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
        {options.map((o) => (
          <label key={String(o.value)} className={cx('relative block min-w-0', o.disabled && 'cursor-not-allowed')}>
            <input
              type="radio"
              name={name}
              className="peer sr-only"
              checked={value === o.value}
              disabled={o.disabled}
              onChange={() => onChange(o.value)}
            />
            <span
              className="flex min-h-[2.5rem] w-full cursor-pointer select-none items-center justify-center break-words rounded-xl border border-line bg-surface px-1.5 py-1.5 text-center text-[0.8rem] font-medium leading-tight transition
                hover:bg-sunken sm:min-h-[2.75rem] sm:px-3 sm:text-sm peer-checked:border-brand peer-checked:bg-brand peer-checked:text-onbrand
                peer-focus-visible:ring-4 peer-focus-visible:ring-brand/30 peer-disabled:cursor-not-allowed peer-disabled:opacity-40"
            >
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** বিবরণসহ রেডিও কার্ড (ফিট মোড, ফরম্যাট ইত্যাদি) */
export function OptionCards({ legend, name, options, value, onChange, cols = 'grid-cols-2 sm:grid-cols-3' }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-medium">{legend}</legend>
      <div className={cx('grid gap-1.5 sm:gap-2.5', cols)}>
        {options.map((o) => (
          <label key={o.value} className="relative block h-full">
            <input
              type="radio"
              name={name}
              className="peer sr-only"
              checked={value === o.value}
              onChange={() => onChange(o.value)}
            />
            <span
              className="flex h-full cursor-pointer flex-col gap-1 rounded-xl border border-line bg-surface p-2.5 transition hover:bg-sunken sm:p-3.5
                peer-checked:border-brand peer-checked:bg-brandsoft peer-checked:ring-2 peer-checked:ring-brand
                peer-focus-visible:ring-4 peer-focus-visible:ring-brand/30"
            >
              <span className="flex items-center gap-2 text-[0.9rem] font-semibold leading-tight sm:text-base">
                {o.icon}
                {o.title}
              </span>
              <span className="text-[0.74rem] leading-snug text-muted sm:text-[0.82rem] sm:leading-relaxed">{o.desc}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Switch({ checked, onChange, label, description }) {
  const id = useId();
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        aria-labelledby={`${id}-l`}
        onClick={() => onChange(!checked)}
        className={cx(
          'relative mt-0.5 h-7 w-12 shrink-0 rounded-full border transition',
          checked ? 'border-brand bg-brand' : 'border-line bg-sunken',
        )}
      >
        <span
          className={cx(
            'absolute top-0.5 rounded-full bg-surface shadow transition-all',
            checked ? 'left-[1.45rem]' : 'left-0.5',
          )}
          style={{ height: '1.375rem', width: '1.375rem' }}
        />
      </button>
      <div className="min-w-0">
        <label id={`${id}-l`} htmlFor={id} className="cursor-pointer font-medium">
          {label}
        </label>
        {description && <p className="text-sm text-muted">{description}</p>}
      </div>
    </div>
  );
}

export function SectionHeading({ eyebrow, title, desc, center = true }) {
  return (
    <div className={cx('mb-10 max-w-3xl', center && 'mx-auto text-center')}>
      {eyebrow && (
        <p className="mb-2 inline-block rounded-full bg-brandsoft px-3 py-1 text-sm font-semibold text-brand">{eyebrow}</p>
      )}
      <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">{title}</h2>
      {desc && <p className="mt-3 text-base text-muted sm:text-lg">{desc}</p>}
    </div>
  );
}
