import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Mail } from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import useTheme from '../hooks/useTheme.js';
import useInstall from '../hooks/useInstall.js';
import photo from '../assets/developer.jpg';

// লুসিডে ব্র্যান্ড আইকন নেই, তাই নিজস্ব SVG পাথ
const PATH = {
  github: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22',
  linkedin: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 110 4 2 2 0 010-4z',
  instagram: 'M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zM16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01',
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
const Instagram = brand(PATH.instagram);

// ডেভেলপার পরিচিতি — সম্পূর্ণ বাংলায়
const NAME = 'মোহাম্মদ হাফিজুর রহমান সাকিব';
const EMAIL = 'hafizsakib5@gmail.com';
const MAIL_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`;

// hover-এ প্রতিটির নিজের রং: পোর্টফোলিও = অ্যাপের সবুজ, বাকিগুলো নিজ নিজ ব্র্যান্ডের রং
const LINKS = [
  ['পোর্টফোলিও', 'https://hsakib.vercel.app/', Globe, 'hover:border-brand hover:bg-brand hover:text-onbrand'],
  ['ইমেইল', MAIL_URL, Mail, 'hover:border-[#EA4335] hover:bg-[#EA4335] hover:text-white'],
  ['লিংকডইন', 'https://linkedin.com/in/hafizsakib', Linkedin, 'hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white'],
  ['গিটহাব', 'https://github.com/Hafiz-Sakib', Github, 'hover:border-[#24292f] hover:bg-[#24292f] hover:text-white dark:hover:border-[#3d444d] dark:hover:bg-[#2d333b]'],
  ['ইনস্টাগ্রাম', 'https://www.instagram.com/___sakib.404/', Instagram, 'hover:border-[#DD2A7B] hover:bg-[linear-gradient(45deg,#F58529,#DD2A7B,#8134AF)] hover:text-white'],
];

const BIO =
  'আসসালামু আলাইকুম, আমি সাকিব। কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং নিয়ে পড়ছি; ওয়েব ডেভেলপমেন্ট, এআই ও মেশিন লার্নিং নিয়ে কাজ করতে ভালোবাসি। নতুন কিছু শেখা আর বাস্তব সমস্যার সমাধান করাই আমার পছন্দ।';

const pill =
  'inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-full font-semibold transition';

export default function Developer() {
  const { theme, toggle } = useTheme();
  const install = useInstall();

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
        install={install}
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
            {LINKS.map(([label, href, I, hover]) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${pill} border border-line bg-surface px-4 text-sm hover:-translate-y-0.5 hover:shadow-md ${hover}`}
                >
                  <I size={18} aria-hidden="true" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </motion.article>
      </main>
      <Footer />
    </>
  );
}
