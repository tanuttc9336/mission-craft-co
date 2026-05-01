/**
 * FAQSection — AEO-optimized Q&A block.
 *
 * Renders Undercat's FAQ as a clean, accessible accordion with
 * matching FAQPage JSON-LD emitted via Helmet at the page level
 * (use faqSchema() in @/lib/seo). The visual treatment stays in
 * Undercat aesthetic — bone on ink, hairline dividers, sharp
 * details, no rounded chips.
 *
 * Drop into any page that wants to surface answers AI engines
 * can quote. Pair with `faqSchema(undercatFAQ)` passed through
 * SeoHead's `jsonLd` prop.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { FAQ } from '@/lib/seo';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface FAQSectionProps {
  faqs: FAQ[];
  /** Section eyebrow label (uppercase). Defaults to "FAQ". */
  eyebrow?: string;
  /** Section headline. */
  headline?: string;
  /** Optional description under the headline. */
  description?: string;
}

export default function FAQSection({
  faqs,
  eyebrow = '— FAQ',
  headline = 'Questions before you write the brief',
  description = 'Quick answers to what comes up most. If your question isn\'t here, the Briefing Room is the next stop.',
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      aria-labelledby="faq-heading"
      className="relative px-6 md:px-20 py-24 md:py-32 border-t border-bone/10"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Top label */}
        <div className="mb-10 flex items-center gap-4">
          <span className="text-[10px] tracking-[0.28em] uppercase text-bone/45 font-mono">
            {eyebrow}
          </span>
          <span className="h-[1px] w-12 bg-bone/20" />
        </div>

        <div className="grid md:grid-cols-12 gap-10 items-start">
          {/* Headline column */}
          <header className="md:col-span-5">
            <h2
              id="faq-heading"
              className="font-serif text-bone leading-[0.96] tracking-[-0.025em]"
              style={{ fontSize: 'clamp(28px, 3.6vw, 56px)' }}
            >
              {headline}
            </h2>
            {description && (
              <p
                className="mt-6 text-bone/65 leading-[1.7] tracking-wide max-w-md"
                style={{ fontSize: 'clamp(14px, 1.05vw, 16px)' }}
              >
                {description}
              </p>
            )}
          </header>

          {/* Accordion column */}
          <div className="md:col-span-7 md:col-start-6 border-t border-bone/10">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={faq.question} className="border-b border-bone/10">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className="w-full text-left py-6 flex items-start gap-6 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-oxblood/70 focus-visible:outline-offset-4"
                  >
                    <span className="text-[10px] tracking-[0.24em] uppercase text-bone/35 font-mono tabular-nums shrink-0 pt-1">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className="flex-1 text-bone/95 leading-[1.4] tracking-tight"
                      style={{ fontSize: 'clamp(16px, 1.3vw, 22px)' }}
                    >
                      {faq.question}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="text-bone/55 group-hover:text-bone shrink-0 mt-1"
                      aria-hidden
                    >
                      <Plus size={18} strokeWidth={1.2} />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p
                          className="pb-6 pl-12 pr-10 text-bone/70 leading-[1.75] tracking-wide"
                          style={{ fontSize: 'clamp(14px, 1.05vw, 16px)' }}
                        >
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
