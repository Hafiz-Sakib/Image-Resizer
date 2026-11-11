import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Home as HomeIcon, Link2 } from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import useTheme from '../hooks/useTheme.js';
import useInstall from '../hooks/useInstall.js';
import { PATHS, navigate } from '../utils/router.js';

export default function NotFound() {
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
        currentPath={PATHS.notFound}
      />
      <main id="main" className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4 py-12 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="w-full text-center">
          <p className="text-7xl font-extrabold leading-none text-brand sm:text-8xl" aria-hidden="true">
            ৪০৪
          </p>
          <h1 className="mt-4 text-2xl font-bold sm:text-3xl">পেজটি খুঁজে পাওয়া যায়নি</h1>
          <p className="mt-2 leading-relaxed text-muted">
            আপনি যে ঠিকানাটি খুঁজছেন সেটি হয়তো সরানো হয়েছে বা ঠিকানায় ভুল আছে। নিচের লিংক থেকে এগিয়ে যান।
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => navigate(PATHS.home)} className="btn-primary px-6">
              <HomeIcon size={18} aria-hidden="true" /> হোমে ফিরে যান
            </button>
            <button type="button" onClick={() => navigate(PATHS.importantLinks)} className="btn-ghost px-6">
              <Link2 size={18} aria-hidden="true" /> গুরুত্বপূর্ণ লিংক
            </button>
          </div>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="mt-4 inline-flex min-h-[2.75rem] items-center gap-2 text-sm text-muted hover:text-brand"
          >
            <ArrowLeft size={16} aria-hidden="true" /> আগের পেজে যান
          </button>
        </motion.div>
      </main>
      <Footer onTool={(mode) => home('workspace', mode)} onGoto={(id) => home(id)} onPage={navigate} />
    </>
  );
}
