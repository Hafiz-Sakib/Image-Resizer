import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Mail } from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import useTheme from '../hooks/useTheme.js';
import useInstall from '../hooks/useInstall.js';
import { PATHS, navigate } from '../utils/router.js';
import photo from '../assets/developer.jpg';

// লুসিডে ব্র্যান্ড আইকন নেই, তাই নিজস্ব SVG পাথ
const PATH = {
  github: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22',
  linkedin: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 110 4 2 2 0 010-4z',
  facebook: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
};
const brand = (d) =>
  function BrandIcon({ size = 18 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={d} />
      </svg>
    );
  };
const Github = brand(PATH.github);
const Linkedin = brand(PATH.linkedin);
const Facebook = brand(PATH.facebook);

// ডেভেলপার পরিচিতি — সম্পূর্ণ বাংলায়
const NAME = 'মোহাম্মদ হাফিজুর রহমান সাকিব';
const EMAIL = 'hafizsakib5@gmail.com';
const MAIL_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`;

const LINKS = [
  ['পোর্টফোলিও', 'https://hafizsakib.vercel.app/', Globe],
  ['ইমেইল', MAIL_URL, Mail],
  ['লিংকডইন', 'https://linkedin.com/in/hafizsakib', Linkedin],
  ['গিটহাব', 'https://github.com/Hafiz-Sakib', Github],
  ['ফেসবুক', 'https://www.facebook.com/Sakib.1118/', Facebook],
];

const BIO =
  'আসসালামু আলাইকুম, আমি সাকিব। কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং নিয়ে পড়ছি; ওয়েব ডেভেলপমেন্ট, এআই ও মেশিন লার্নিং নিয়ে কাজ করতে ভালোবাসি। নতুন কিছু শেখা আর বাস্তব সমস্যার সমাধান করাই আমার পছন্দ।';

const pill =
  'inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-full font-semibold transition';

export default function Developer() {
  const { theme, toggle } = useTheme();
  const install = useInstall();
  const home = (scroll, tool) => navigate(PATHS.home, { scroll, tool });

  useEffect(() => {
    const prev = document.title;
    document.title = 'সরকারি চাকরি';
    window.scrollTo({ top: 0 });
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <>
      <Header
        theme={theme}
        onToggleTheme={toggle}
        onTool={(mode) => home('workspace', mode)}
        onGoto={(id) => home(id)}
        install={install}
        currentPath={PATHS.developer}
      />
      <main id="main" className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-4 py-12 sm:px-6">
        <motion.article initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="w-full text-center">
          <img
            src={photo}
            width={640}
            height={640}
            alt={`${NAME} — ডেভেলপার`}
            decoding="async"
            className="mx-auto h-36 w-36 rounded-full border-4 border-surface object-cover shadow-xl ring-2 ring-brand sm:h-40 sm:w-40"
          />
          <h1 className="mt-5 text-2xl font-bold sm:text-3xl">{NAME}</h1>
          <p className="mt-1 font-semibold text-brand">ফুল স্ট্যাক ডেভেলপার · Chattogram, বাংলাদেশ</p>
          <p className="mt-5 leading-[1.9] text-muted">{BIO}</p>

          <ul className="mt-7 flex flex-wrap justify-center gap-2">
            {LINKS.map(([label, href, I]) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${pill} border border-line bg-surface px-4 text-sm hover:border-brand hover:text-brand hover:shadow-md`}
                >
                  <I size={18} aria-hidden="true" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </motion.article>
      </main>
      <Footer onTool={(mode) => home('workspace', mode)} onGoto={(id) => home(id)} onPage={navigate} />
    </>
  );
}
