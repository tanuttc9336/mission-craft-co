/**
 * Undercat FAQ — answers to the questions a prospect actually
 * has before they reach out. Each pair is written to be:
 *   1. Self-contained — answer makes sense without context (AEO
 *      engines extract them out of context)
 *   2. Concrete — every claim is verifiable, no adjective fluff
 *   3. Brand-voice — verbs over adjectives, no "starting at" prices
 *
 * Used by:
 *   - <FAQSection /> for visual rendering
 *   - faqSchema() in @/lib/seo for FAQPage JSON-LD
 *
 * Add or edit answers here, not in the component or schema —
 * source-of-truth lives in this file so Q&As stay consistent
 * across UI, structured data, and any future surface (Notion
 * answer base, internal sales briefing, LINE auto-reply, etc.).
 */

import type { FAQ } from '@/lib/seo';

export const undercatFAQ: FAQ[] = [
  {
    question: 'What kind of brands does Undercat work with?',
    answer:
      'Independent brands and growing companies that treat image as a business decision, not decoration. Past clients include Audi Thailand, Greenline Golf, Ducati, FC Bayern Bangkok, Lexus, and Sonle Residences.',
  },
  {
    question: 'How is Undercat different from a typical production house?',
    answer:
      'We own every link — direction, production, post — so the brief and the final cut don\'t drift through three vendors. The same people who write the brief sit on set and grade the final.',
  },
  {
    question: 'How does an engagement with Undercat start?',
    answer:
      'With a conversation. Send a brief through the Briefing Room or write to us directly — usually one reply from the founder, same day.',
  },
  {
    question: 'What does Undercat actually deliver?',
    answer:
      'Brand films, social content, creative direction, and licensed drone cinematography. One team from concept to final cut, not a relay race between agencies.',
  },
  {
    question: 'Is Undercat right for small brands or only big names?',
    answer:
      'Small brands that take their image seriously, yes. We work with founders who want to look like they belong in the same room as the big names — and have the work to back it up.',
  },
  {
    question: 'Where is Undercat based and what\'s the project radius?',
    answer:
      'Bangkok, Thailand. Most work happens in Thailand and Southeast Asia. Outside the region is possible — depends on the project.',
  },
  {
    question: 'How long does a project take from kickoff to delivery?',
    answer:
      'A brand film runs 3-8 weeks depending on scope. A social retainer is ongoing. A single shoot turns around in 1-3 weeks.',
  },
  {
    question: 'What does "production with taste" actually mean?',
    answer:
      'Production that matches the brief. Not over-polished when restraint is the point. Not under-finished when the brand needs to feel premium. Decisions made on purpose, not by default.',
  },
];
