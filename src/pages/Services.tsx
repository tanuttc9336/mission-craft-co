import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SeoHead, breadcrumbSchema, faqSchema, orgRef } from '@/lib/seo';
import { undercatFAQ } from '@/data/faq';
import FAQSection from '@/components/FAQSection';
import {
  EASE,
  BlurCursor,
  ScrollProgress,
  MetaLabel,
  DisplayHeadline,
  PageTopBar,
  PageFooter,
} from '@/components/editorial';

/* ──────────────────────────────────────────────
   SERVICES — The disciplines index
   Editorial DNA: bone / ink / oxblood
   ────────────────────────────────────────────── */

type Service = {
  no: string;
  label: string;
  headline: string;
  body: string;
  tags: string[];
  to?: string;
  status: 'live' | 'soon';
};

const SERVICES: Service[] = [
  {
    no: '01',
    label: 'Drone',
    headline: 'Aerial as a decision, not a flourish.',
    body:
      'We fly the move the edit needs — ground and air cut as one eye. Real estate, events, golf, brand films. A drone earns its place when it shows the why, not just the where.',
    tags: ['Real estate', 'Events', 'Golf', 'Brand films'],
    to: '/drone',
    status: 'live',
  },
  {
    no: '02',
    label: 'Video Production',
    headline: 'Full production, from blank page to final cut.',
    body:
      'Concept, script, shoot, edit, colour, sound. One team, one eye, one standard. The kind of film that earns the room it plays in.',
    tags: ['Brand films', 'Launch content', 'Documentary', 'Series'],
    status: 'soon',
  },
  {
    no: '03',
    label: 'Photography',
    headline: 'Stills with the same discipline as the film.',
    body:
      'Key art, campaign stills, editorial coverage. Shot on the same set as the film, by the same eye, so the grade and the type feel like one decision.',
    tags: ['Key art', 'Campaign', 'Editorial'],
    status: 'soon',
  },
  {
    no: '04',
    label: 'Creative Strategy',
    headline: 'The brief behind the brief.',
    body:
      'Before the camera, the question. We help brands find the angle worth shooting — the one that earns attention instead of buying it.',
    tags: ['Positioning', 'Content strategy', 'Narrative'],
    status: 'soon',
  },
];

export default function Services() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: pageP } = useScroll({
    target: pageRef,
    offset: ['start start', 'end end'],
  });

  return (
    <>
      <SeoHead
        title="Services — Brand films, social, direction, drone · Undercat"
        description="Brand films, social content, creative direction, and licensed drone cinematography. One team from brief to final cut, owning every link in the chain."
        path="/services"
        jsonLd={[
          {
            '@type': 'ItemList',
            '@id': 'https://www.undercatcreatives.com/services#itemlist',
            name: 'Undercat services',
            description: 'Brand films, social content, creative direction, and drone cinematography — provided by Undercat Creatives.',
            itemListElement: [
              { '@type': 'ListItem', position: 1, item: { '@type': 'Service', name: 'Brand films', provider: orgRef() } },
              { '@type': 'ListItem', position: 2, item: { '@type': 'Service', name: 'Social content', provider: orgRef() } },
              { '@type': 'ListItem', position: 3, item: { '@type': 'Service', name: 'Creative direction', provider: orgRef() } },
              { '@type': 'ListItem', position: 4, item: { '@type': 'Service', name: 'Drone cinematography', provider: orgRef() } },
            ],
          },
          breadcrumbSchema([
            ['Home', '/'],
            ['Services', '/services'],
          ]),
          faqSchema(undercatFAQ),
        ]}
      />
      <BlurCursor />
      <ScrollProgress progress={pageP} />

      <motion.div ref={pageRef} className="relative bg-ink text-bone min-h-screen">
        <PageTopBar progress={pageP} />

        {/* ══════════════════════════════════════════
            01  HERO
            ══════════════════════════════════════════ */}
        <section className="relative min-h-screen flex flex-col justify-end px-6 md:px-20 pb-20 md:pb-28 pt-32 overflow-hidden">
          {/* Ghosted numeral watermark */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.04 }}
            transition={{ duration: 2, ease: EASE, delay: 0.3 }}
            className="pointer-events-none absolute right-[-4vw] top-[8vh] font-serif italic text-bone select-none"
            style={{ fontSize: 'clamp(28rem, 60vw, 60rem)', lineHeight: 0.8 }}
          >
            S
          </motion.div>

          <div className="relative max-w-[1600px] mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
              className="mb-6"
            >
              <MetaLabel>The Disciplines / Undercat Services</MetaLabel>
            </motion.div>

            <DisplayHeadline
              size="hero"
              lines={[
                'Every service',
                <span key="l2" className="italic text-bone/80">is a discipline.</span>,
                <span key="l3" className="italic text-bone/60">Not a line on a menu.</span>,
              ]}
            />

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.9 }}
              className="mt-10 max-w-[680px] text-[15px] md:text-base leading-[1.75] text-bone/70 font-light"
            >
              Undercat doesn't sell packages. We run a small set of disciplines, each one
              deep enough to defend. Pick the one you need — or the combination that turns a
              brief into a film that earns the room it plays in.
            </motion.p>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            02  MANIFESTO
            ══════════════════════════════════════════ */}
        <section className="relative px-6 md:px-20 py-28 md:py-36 border-t border-bone/10">
          <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-4">
              <MetaLabel>02 — Position</MetaLabel>
            </div>
            <div className="md:col-span-8">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 0.9, ease: EASE }}
                className="font-serif italic text-[clamp(1.8rem,3.4vw,3rem)] leading-[1.2] tracking-[-0.01em]"
              >
                The shortlist is the product.
                <br />
                <span className="text-bone/60">
                  We'd rather do four things with an obsession than forty things with a brochure.
                </span>
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
                className="mt-10 max-w-[640px] text-[15px] leading-[1.75] text-bone/65 font-light"
              >
                Most studios grow by adding services. We grow by sharpening the ones we have.
                Every discipline below has been earned on real work, under real deadlines, for
                brands with real standards. If it's not on this list, we're not the right
                studio for it — and we'll say so.
              </motion.p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            03  THE DISCIPLINES — service cards
            ══════════════════════════════════════════ */}
        <section className="relative px-6 md:px-20 py-24 md:py-32 border-t border-bone/10">
          <div className="max-w-[1600px] mx-auto w-full">
            <div className="mb-16 md:mb-20">
              <MetaLabel>03 — On offer</MetaLabel>
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 0.9, ease: EASE }}
                className="mt-4 font-serif text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] tracking-[-0.02em] max-w-[900px]"
              >
                Four disciplines. <span className="italic text-bone/60">One standard.</span>
              </motion.h2>
            </div>

            <div className="flex flex-col">
              {SERVICES.map((service, i) => (
                <ServiceRow key={service.no} service={service} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            04  THE PASS — CTA
            ══════════════════════════════════════════ */}
        <section className="relative px-6 md:px-20 py-32 md:py-40 border-t border-bone/10">
          <div className="max-w-[1600px] mx-auto w-full">
            <MetaLabel>04 — The pass</MetaLabel>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.9, ease: EASE }}
              className="mt-6 font-serif text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.02em] max-w-[1100px]"
            >
              Know the discipline you need?
              <br />
              <span className="italic text-bone/60">Or want us to find it for you?</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
              className="mt-12 flex flex-wrap items-center gap-6"
            >
              <Link
                to="/briefing-room"
                className="group inline-flex items-center gap-3 border border-bone/30 hover:border-oxblood px-8 py-5 text-[11px] tracking-[0.28em] uppercase font-mono text-bone hover:text-oxblood transition-all duration-500"
              >
                Start a briefing
                <ArrowRight
                  size={14}
                  className="transition-transform duration-500 group-hover:translate-x-1"
                />
              </Link>
              <Link
                to="/work"
                className="text-[11px] tracking-[0.28em] uppercase font-mono text-bone/55 hover:text-bone transition-colors duration-500"
              >
                → See the work first
              </Link>
            </motion.div>
          </div>
        </section>

        {/* FAQ — surfaces answers to AI engines (FAQPage schema)
            and gives prospects a low-commitment path to context
            before they hit the Briefing Room. */}
        <FAQSection faqs={undercatFAQ} />

        <PageFooter />
      </motion.div>
    </>
  );
}

/* ──────────────────────────────────────────────
   ServiceRow — editorial list item
   ────────────────────────────────────────────── */
function ServiceRow({ service, index }: { service: Service; index: number }) {
  const isLive = service.status === 'live';
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.9, ease: EASE, delay: index * 0.08 }}
      className={`group relative grid grid-cols-12 gap-6 md:gap-10 py-10 md:py-14 border-t border-bone/10 ${
        isLive ? 'cursor-pointer' : ''
      }`}
    >
      {/* numeral */}
      <div className="col-span-2 md:col-span-1">
        <span className="font-mono text-[11px] tracking-[0.2em] text-bone/40 tabular-nums">
          {service.no}
        </span>
      </div>

      {/* label */}
      <div className="col-span-10 md:col-span-3">
        <div className="flex items-center gap-3">
          <h3
            className={`font-serif text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.05] tracking-[-0.01em] ${
              isLive
                ? 'text-bone group-hover:text-oxblood transition-colors duration-500'
                : 'text-bone/50'
            }`}
          >
            {service.label}
          </h3>
          {!isLive && (
            <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-bone/35 border border-bone/20 px-2 py-0.5">
              Soon
            </span>
          )}
        </div>
      </div>

      {/* headline + body */}
      <div className="col-span-12 md:col-span-6">
        <p
          className={`font-serif italic text-[clamp(1.1rem,1.6vw,1.4rem)] leading-[1.35] ${
            isLive ? 'text-bone/85' : 'text-bone/45'
          }`}
        >
          {service.headline}
        </p>
        <p
          className={`mt-5 text-[14px] leading-[1.75] font-light max-w-[560px] ${
            isLive ? 'text-bone/60' : 'text-bone/35'
          }`}
        >
          {service.body}
        </p>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
          {service.tags.map((tag) => (
            <span
              key={tag}
              className={`font-mono text-[9px] tracking-[0.22em] uppercase ${
                isLive ? 'text-bone/45' : 'text-bone/25'
              }`}
            >
              — {tag}
            </span>
          ))}
        </div>
      </div>

      {/* arrow */}
      <div className="col-span-12 md:col-span-2 md:flex md:justify-end md:items-start">
        {isLive ? (
          <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.24em] uppercase text-bone/55 group-hover:text-oxblood transition-colors duration-500">
            Enter
            <ArrowRight
              size={13}
              className="transition-transform duration-500 group-hover:translate-x-1"
            />
          </span>
        ) : (
          <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-bone/25">
            —
          </span>
        )}
      </div>
    </motion.div>
  );

  return isLive && service.to ? (
    <Link to={service.to} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}
