import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FAQ as ITEMS } from '../data/faq.js';
import { SectionHeading } from './ui.jsx';

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="scroll-mt-20 py-14 sm:py-20" aria-labelledby="faq-title">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading eyebrow="প্রশ্নোত্তর" title={<span id="faq-title">সাধারণ জিজ্ঞাসা (FAQ)</span>} desc="আপনার মনে যে প্রশ্নগুলো আসতে পারে, তার উত্তর এখানে।" />
        <div className="space-y-3">
          {ITEMS.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={it.q} className="card overflow-hidden">
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex min-h-[3.5rem] w-full items-center justify-between gap-4 px-5 py-3 text-left text-base font-semibold sm:text-lg"
                  >
                    <span>{it.q}</span>
                    <ChevronDown size={20} className={`shrink-0 text-brand transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-a-${i}`}
                      role="region"
                      aria-labelledby={`faq-q-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 leading-relaxed text-muted">{it.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
