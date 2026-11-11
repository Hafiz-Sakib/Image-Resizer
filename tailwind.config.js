/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Hind Siliguri"', '"Noto Sans Bengali"', 'Kalpurush', '"Siyam Rupali"', 'Vrinda', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: token('paper'),
        surface: token('surface'),
        sunken: token('sunken'),
        ink: token('ink'),
        muted: token('muted'),
        line: token('line'),
        brand: token('brand'),
        onbrand: token('onbrand'),
        brandsoft: token('brandsoft'),
        accent: token('accent'),
        ok: token('ok'),
        oksoft: token('oksoft'),
        warn: token('warn'),
        warnsoft: token('warnsoft'),
        err: token('err'),
        errsoft: token('errsoft'),
      },
      boxShadow: {
        card: '0 1px 2px rgb(var(--shadow) / .06), 0 8px 24px -12px rgb(var(--shadow) / .18)',
        pop: '0 18px 50px -18px rgb(var(--shadow) / .35)',
      },
      keyframes: {
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: { shimmer: 'shimmer 1.4s infinite' },
    },
  },
  plugins: [],
};
