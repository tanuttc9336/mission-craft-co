import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cases } from '@/data/cases';
import { SeoHead, breadcrumbSchema, serviceSchema } from '@/lib/seo';
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
   DRONE — Aerial services landing page
   Editorial DNA matching /golf
   ────────────────────────────────────────────── */

const DRONE_HERO_VIDEO_ID = '2n2Iy_UJtN0'; // Audi x Everwave Cleanup — aerial documentary

const STATS = [
  { no: '200+', label: 'Flights on record' },
  { no: '06', label: 'Years in the air' },
  { no: '4K', label: 'RAW cinema standard' },
  { no: '08', label: 'Industries flown' },
];

const PILLARS = [
  {
    no: '01',
    label: 'Perspective',
    headline: 'The angle you can\'t get any other way.',
    body:
      'A drone earns its place when it reveals something the ground shot can\'t — scale, context, the geometry of a space. Never flourish. Always a decision.',
  },
  {
    no: '02',
    label: 'Motion',
    headline: 'Movement that belongs to the story.',
    body:
      'Most drone reels are the pilot\'s showreel in disguise. We fly the move the edit needs — slower when it has to breathe, sharper when it has to cut. Restraint is a feature, not a limitation.',
  },
  {
    no: '03',
    label: 'Integration',
    headline: 'Ground and air, cut as one eye.',
    body:
      'We\'re not a drone vendor parachuting in for a single shot. We direct air and ground together — same colour, same rhythm, same story. The seam disappears.',
  },
];

const VERTICALS = [
  {
    no: '01',
    label: 'Real estate',
    headline: 'Reveals that sell before the buyer walks in.',
    body:
      'Developments, residences, launch events. The aerial is the first impression — and the first impression is the sale.',
  },
  {
    no: '02',
    label: 'Events',
    headline: 'Scale, crowd, atmosphere — from above.',
    body:
      'Concerts, festivals, activations. A wide aerial turns a good event into a bigger one on camera — and gives sponsors a frame they can\'t get from the stage.',
  },
  {
    no: '03',
    label: 'Golf',
    headline: 'Course flyovers that read like a mental map.',
    body:
      'Hole reveals, range overviews, tournament coverage. When the camera knows the course, the shot knows what to show.',
  },
];

// Hand-picked drone-relevant case IDs from the archive
const DRONE_CASE_IDS = [
  'audi-cleanup-mission',
  'sonle-residences',
  'rajadamnern-world-series',
  'audi-events',
  'hins-cup-golf',
  'audi-launch-films',
];

export default function Drone() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: pageP } = useScroll({
    target: pageRef,
    offset: ['start start', 'end end'],
  });

  const allDroneCases = DRONE_CASE_IDS
    .map((id) => cases.find((c) => c.id === id))
    .filter(Boolean) as typeof cases;
  const featuredCase = allDroneCases[0];
  const droneCases = allDroneCases.slice(1);

  return (
    <>
      <SeoHead
        title="Drone cinematography · Real estate, hospitality, sport · Undercat"
        description="Licensed drone cinematography for real estate, hospitality, automotive, and sport — by the same team that directs the hero film. Bangkok-based, Thailand-wide."
        path="/drone"
        jsonLd={[
          serviceSchema({
            id: 'drone',
            name: 'Drone cinematography',
            description: 'Licensed aerial cinematography for real estate, hospitality, automotive, and sport in Thailand. Hero film direction, not stock flyovers.',
            serviceType: 'Aerial cinematography',
            url: '/drone',
          }),
          breadcrumbSchema([
            ['Home', '/'],
            ['Industries', '/drone'],
            ['Drone', '/drone'],
          ]),
        ]}
      />
      <BlurCursor />
      <ScrollProgress progress={pageP} />

      <motion.div ref={pageRef} className="relative bg-ink text-bone min-h-screen">
        <PageTopBar progress={pageP} />

        {/* ══════════════════════════════════════════
            HERO — Video background
            ══════════════════════════════════════════ */}
        <section className="relative h-screen min-h-[720px] overflow-hidden">
          <div className="absolute inset-0 bg-ink">
            <iframe
              title="Undercat — Drone specialty"
              src={`https://www.youtube.com/embed/${DRONE_HERO_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${DRONE_HERO_VIDEO_ID}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1`}
              allow="autoplay; encrypted-media; picture-in-picture"
              frameBorder={0}
              className="absolute top-1/2 left-1/2 pointer-events-none"
              style={{
                width: '177.78vh',
                height: '56.25vw',
                minWidth: '100%',
                minHeight: '100%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/30 to-ink pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/45 via-transparent to-ink/10 pointer-events-none" />

          <div className="absolute inset-0 flex flex-col">
            <div className="flex-1" />
            <div className="px-6 md:px-20 pb-16 md:pb-20">
              <div className="max-w-[1600px] mx-auto w-full">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
                  className="flex items-center gap-3 mb-8 md:mb-10"
                >
                  <span className="inline-block h-[1px] w-10 bg-oxblood/80" />
                  <MetaLabel variant="ghost">Specialty / 02 — Drone</MetaLabel>
                </motion.div>

                <DisplayHeadline
                  size="hero"
                  lines={[
                    "Drone isn't a trick shot.",
                    <span key="l2" className="italic text-bone/80">
                      It's a language —
                    </span>,
                    <span key="l3" className="italic text-bone/80">
                      and we speak it fluently.
                    </span>,
                  ]}
                />

                <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-16 items-end">
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}
                    className="font-serif text-bone/85 leading-[1.45] max-w-[640px]"
                    style={{ fontSize: 'clamp(17px, 1.35vw, 22px)' }}
                  >
                    Altitude, motion, the line a camera draws through air. We treat drone the same way we treat any other lens — as a decision, not a flourish. The shot earns its place or it doesn't fly.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.65 }}
                    className="font-mono text-[10px] tracking-[0.24em] uppercase text-bone/60"
                  >
                    Bangkok · Licensed
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: EASE, delay: 1.2 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 6, 0], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-3"
            >
              <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-bone/60">
                Scroll
              </span>
              <span className="inline-block w-[1px] h-6 bg-bone/40" />
            </motion.div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════
            01b — STATS STRIP
            ══════════════════════════════════════════ */}
        <section className="relative px-6 md:px-20 py-16 md:py-24 border-t border-bone/15 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-bone/[0.02] via-transparent to-transparent pointer-events-none" />
          <div className="relative max-w-[1600px] mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.9, ease: EASE }}
              className="flex items-center gap-3 mb-12 md:mb-16"
            >
              <span className="inline-block h-[1px] w-8 bg-oxblood/70" />
              <MetaLabel variant="ghost">On the record</MetaLabel>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-15%' }}
                  transition={{ duration: 0.9, ease: EASE, delay: i * 0.08 }}
                  className="border-l border-bone/15 pl-6 md:pl-8"
                >
                  <div
                    className="font-serif text-bone leading-[0.9] tracking-[-0.02em] tabular-nums"
                    style={{ fontSize: 'clamp(48px, 5.6vw, 88px)' }}
                  >
                    {s.no}
                  </div>
                  <div className="mt-4 font-mono text-[10px] tracking-[0.24em] uppercase text-bone/55">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            02 — MANIFESTO
            ══════════════════════════════════════════ */}
        <section className="relative px-6 md:px-20 py-24 md:py-36 border-t border-bone/15">
          <div className="max-w-[1600px] mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr] gap-10 lg:gap-14 xl:gap-20 items-start">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 0.9, ease: EASE }}
                className="lg:sticky lg:top-28"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-block h-[1px] w-8 bg-oxblood/70" />
                  <MetaLabel variant="ghost">02 / Why drone</MetaLabel>
                </div>
              </motion.div>

              <div className="max-w-[860px]">
                <motion.h2
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-15%' }}
                  transition={{ duration: 1, ease: EASE }}
                  className="font-serif text-bone leading-[1.06] tracking-[-0.01em]"
                  style={{ fontSize: 'clamp(36px, 4.8vw, 72px)' }}
                >
                  Most drone shots are a trick.
                  <br />
                  <span className="italic text-bone/70">Ours are a decision.</span>
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-15%' }}
                  transition={{ duration: 1, ease: EASE, delay: 0.1 }}
                  className="mt-12 md:mt-16 space-y-7 font-serif text-bone/78 leading-[1.6] max-w-[680px]"
                  style={{ fontSize: 'clamp(17px, 1.3vw, 21px)' }}
                >
                  <p>
                    Somewhere along the way, drone became shorthand for "b-roll filler" — a gimmick to wedge into an edit and call it elevated. That's not what we do.
                  </p>
                  <p>
                    A shot from above only earns its place when it says something the ground shot can't. A move only works when it belongs to the story, not to the pilot's showreel. We plan every flight around that question.
                  </p>
                  <p className="text-bone/90">
                    Drone as a trick, or drone as craft — we only fly to one standard.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            02b — FULL-BLEED IMAGE BREAK + pull quote
            ══════════════════════════════════════════ */}
        <section className="relative border-t border-bone/15 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1.8, ease: EASE }}
            className="relative aspect-[21/9] md:aspect-[21/8] bg-ink"
          >
            <img
              src={`https://i.ytimg.com/vi/${DRONE_HERO_VIDEO_ID}/maxresdefault.jpg`}
              alt="Aerial — on the record"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  `https://i.ytimg.com/vi/${DRONE_HERO_VIDEO_ID}/hqdefault.jpg`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-ink/30 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/40 via-transparent to-ink/20 pointer-events-none" />

            <div className="absolute inset-0 flex items-end">
              <div className="w-full px-6 md:px-20 pb-10 md:pb-16">
                <div className="max-w-[1600px] mx-auto w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-15%' }}
                    transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
                    className="max-w-[780px]"
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <span className="inline-block h-[1px] w-8 bg-bone/60" />
                      <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-bone/70">
                        Field note
                      </span>
                    </div>
                    <p
                      className="font-serif italic text-bone leading-[1.18] tracking-[-0.005em]"
                      style={{ fontSize: 'clamp(22px, 2.4vw, 38px)' }}
                    >
                      "The ground shot shows the thing. The air shot shows the why."
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════
            03 — WHAT WE BRING (3 PILLARS)
            ══════════════════════════════════════════ */}
        <section className="relative px-6 md:px-20 py-24 md:py-36 border-t border-bone/15">
          <div className="max-w-[1600px] mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr] gap-10 lg:gap-14 xl:gap-20 items-start">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 0.9, ease: EASE }}
                className="lg:sticky lg:top-28"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-block h-[1px] w-8 bg-oxblood/70" />
                  <MetaLabel variant="ghost">03 / What we bring</MetaLabel>
                </div>
                <p
                  className="mt-4 font-serif italic text-bone/55 leading-[1.4] max-w-[240px]"
                  style={{ fontSize: 'clamp(14px, 1vw, 16px)' }}
                >
                  Three things the shot earns before it ever leaves the ground.
                </p>
              </motion.div>

              <div className="space-y-16 md:space-y-24">
                {PILLARS.map((p, i) => (
                  <motion.div
                    key={p.no}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-12%' }}
                    transition={{ duration: 1, ease: EASE, delay: i * 0.08 }}
                    className="group border-t border-bone/15 pt-8 md:pt-10"
                  >
                    <div className="flex items-baseline gap-4 mb-6">
                      <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-oxblood/90 tabular-nums">
                        {p.no}
                      </span>
                      <MetaLabel variant="ghost">{p.label}</MetaLabel>
                    </div>
                    <h3
                      className="font-serif text-bone leading-[1.12] tracking-[-0.005em] max-w-[780px]"
                      style={{ fontSize: 'clamp(24px, 2.6vw, 38px)' }}
                    >
                      {p.headline}
                    </h3>
                    <p
                      className="mt-5 font-serif text-bone/70 leading-[1.6] max-w-[640px]"
                      style={{ fontSize: 'clamp(15px, 1.15vw, 18px)' }}
                    >
                      {p.body}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            04 — WHERE WE FLY (Verticals)
            ══════════════════════════════════════════ */}
        <section className="relative px-6 md:px-20 py-24 md:py-36 border-t border-bone/15">
          <div className="max-w-[1600px] mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr] gap-10 lg:gap-14 xl:gap-20 items-start mb-14 md:mb-20">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-block h-[1px] w-8 bg-oxblood/70" />
                  <MetaLabel variant="ghost">04 / Where we fly</MetaLabel>
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 1, ease: EASE, delay: 0.05 }}
                className="font-serif text-bone leading-[1.06] tracking-[-0.01em]"
                style={{ fontSize: 'clamp(34px, 4.4vw, 64px)' }}
              >
                Three places the aerial actually matters.
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {VERTICALS.map((v, i) => (
                <motion.div
                  key={v.no}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.9, ease: EASE, delay: i * 0.08 }}
                  className="relative border border-bone/15 p-8 md:p-10 hover:border-bone/40 transition-colors duration-500"
                >
                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-oxblood/90 tabular-nums">
                      {v.no}
                    </span>
                    <MetaLabel variant="ghost">{v.label}</MetaLabel>
                  </div>
                  <h3
                    className="font-serif text-bone leading-[1.18] tracking-[-0.005em]"
                    style={{ fontSize: 'clamp(20px, 1.9vw, 28px)' }}
                  >
                    {v.headline}
                  </h3>
                  <p
                    className="mt-5 font-serif text-bone/70 leading-[1.6]"
                    style={{ fontSize: 'clamp(14px, 1.05vw, 17px)' }}
                  >
                    {v.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            05 — ON RECORD (Drone cases)
            ══════════════════════════════════════════ */}
        <section className="relative px-6 md:px-20 py-24 md:py-36 border-t border-bone/15">
          <div className="max-w-[1600px] mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr] gap-10 lg:gap-14 xl:gap-20 items-end mb-16 md:mb-20">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-block h-[1px] w-8 bg-oxblood/70" />
                  <MetaLabel variant="ghost">05 / On record</MetaLabel>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 1, ease: EASE, delay: 0.05 }}
                className="flex items-end justify-between gap-6 flex-wrap"
              >
                <h2
                  className="font-serif text-bone leading-[1.06] tracking-[-0.01em]"
                  style={{ fontSize: 'clamp(34px, 4.4vw, 64px)' }}
                >
                  The work, from above.
                </h2>
                <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-bone/55">
                  <span className="text-bone tabular-nums">
                    {String(allDroneCases.length).padStart(2, '0')}
                  </span>
                  <span className="ml-1.5">selected files</span>
                </div>
              </motion.div>
            </div>

            {featuredCase && <FeaturedDroneCase caseItem={featuredCase} />}

            <div className="mt-20 md:mt-28 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-14 md:gap-y-20">
              {droneCases.map((c, i) => (
                <DroneCaseTile key={c.id} caseItem={c} index={i} total={allDroneCases.length} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.9, ease: EASE }}
              className="mt-20 md:mt-24 flex items-center gap-4"
            >
              <span className="h-[1px] w-16 bg-bone/20" />
              <Link
                to="/work"
                className="group inline-flex items-center gap-3 font-mono text-[10px] tracking-[0.24em] uppercase text-bone/65 hover:text-bone transition-colors duration-500"
              >
                <span>See all work</span>
                <ArrowRight
                  size={12}
                  strokeWidth={1.5}
                  className="group-hover:translate-x-1 transition-transform duration-500 ease-out"
                />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            06 — THE PASS (CTA)
            ══════════════════════════════════════════ */}
        <section className="relative px-6 md:px-20 py-28 md:py-40 border-t border-bone/15 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-oxblood/[0.04] via-transparent to-transparent pointer-events-none" />
          <div className="relative max-w-[1600px] mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr] gap-10 lg:gap-14 xl:gap-20 items-start">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-block h-[1px] w-8 bg-oxblood/70" />
                  <MetaLabel variant="ghost">06 / The pass</MetaLabel>
                </div>
              </motion.div>

              <div className="max-w-[860px]">
                <motion.h2
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-15%' }}
                  transition={{ duration: 1, ease: EASE }}
                  className="font-serif text-bone leading-[1.06] tracking-[-0.01em]"
                  style={{ fontSize: 'clamp(34px, 4.6vw, 68px)' }}
                >
                  Got a shot that needs
                  <br />
                  <span className="italic text-bone/75">altitude?</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-15%' }}
                  transition={{ duration: 1, ease: EASE, delay: 0.1 }}
                  className="mt-8 font-serif text-bone/75 leading-[1.55] max-w-[640px]"
                  style={{ fontSize: 'clamp(17px, 1.3vw, 21px)' }}
                >
                  Brief us — we'll plan the flight around the story, not the other way around. Drone as a standalone package, or integrated into the full production. Every project starts with a conversation.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-15%' }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
                  className="mt-12 flex flex-wrap items-center gap-5"
                >
                  <Link
                    to="/briefing-room"
                    className="group inline-flex items-center gap-4 px-7 py-[18px] border border-bone bg-bone text-ink hover:bg-oxblood hover:border-oxblood hover:text-bone transition-all duration-500"
                  >
                    <span className="font-mono text-[10px] tracking-[0.24em] uppercase">
                      Start a brief
                    </span>
                    <ArrowRight
                      size={14}
                      strokeWidth={1.5}
                      className="group-hover:translate-x-1 transition-transform duration-500 ease-out"
                    />
                  </Link>
                  <Link
                    to="/work"
                    className="group inline-flex items-center gap-3 font-mono text-[10px] tracking-[0.24em] uppercase text-bone/65 hover:text-bone transition-colors duration-500"
                  >
                    <span>Or see all the work</span>
                    <ArrowRight
                      size={12}
                      strokeWidth={1.5}
                      className="group-hover:translate-x-1 transition-transform duration-500 ease-out"
                    />
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <PageFooter />
      </motion.div>
    </>
  );
}

/* ──────────────────────────────────────────────
   FeaturedDroneCase — large spotlight tile
   ────────────────────────────────────────────── */

function FeaturedDroneCase({
  caseItem: c,
}: {
  caseItem: typeof cases[number];
}) {
  const thumbHD = c.thumbnail?.replace('hqdefault', 'maxresdefault') || c.thumbnail;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 1, ease: EASE }}
      className="group"
    >
      <Link to={`/work/${c.id}`} className="block">
        <div
          className="relative aspect-[16/9] overflow-hidden border border-bone/15 group-hover:border-bone/45 transition-colors duration-500"
          style={{ background: c.gradient }}
        >
          {thumbHD && (
            <img
              src={thumbHD}
              alt={c.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.035]"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = c.thumbnail;
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/5 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />

          <div className="absolute top-5 left-5 md:top-7 md:left-7">
            <div className="flex items-center gap-3">
              <span className="inline-block h-[1px] w-8 bg-oxblood" />
              <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-bone">
                Featured
              </span>
            </div>
          </div>

          <div className="absolute top-5 right-5 md:top-7 md:right-7 text-bone opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-[600ms] ease-out">
            <ArrowRight size={18} strokeWidth={1.4} />
          </div>

          <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-oxblood group-hover:w-full transition-all duration-[900ms] ease-out" />
        </div>

        <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 md:gap-14">
          <div>
            <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.24em] uppercase text-bone/55 mb-3">
              <span>{c.industry}</span>
              <span className="inline-block w-1 h-1 rounded-full bg-bone/30" />
              <span>{c.goal}</span>
              <span className="inline-block w-1 h-1 rounded-full bg-bone/30" />
              <span>{c.scale ?? 'Production'}</span>
            </div>
            <h3
              className="font-serif text-bone leading-[1.08] tracking-[-0.008em] group-hover:text-bone/90 transition-colors duration-500"
              style={{ fontSize: 'clamp(26px, 2.6vw, 40px)' }}
            >
              {c.title}
            </h3>
          </div>
          <div>
            <p
              className="font-serif text-bone/75 leading-[1.6]"
              style={{ fontSize: 'clamp(15px, 1.1vw, 18px)' }}
            >
              {c.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {c.outputs.slice(0, 3).map((o) => (
                <span
                  key={o}
                  className="font-mono text-[9px] tracking-[0.2em] uppercase text-bone/55 border border-bone/20 px-2.5 py-[6px]"
                >
                  {o}
                </span>
              ))}
              {c.styleDNA.slice(0, 2).map((s) => (
                <span
                  key={s}
                  className="font-mono text-[9px] tracking-[0.2em] uppercase text-bone/55 border border-bone/20 px-2.5 py-[6px]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   DroneCaseTile — compact case tile
   ────────────────────────────────────────────── */

function DroneCaseTile({
  caseItem: c,
  index,
  total,
}: {
  caseItem: typeof cases[number];
  index: number;
  total: number;
}) {
  const thumbHD = c.thumbnail?.replace('hqdefault', 'maxresdefault') || c.thumbnail;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.9, ease: EASE, delay: Math.min(index, 4) * 0.08 }}
      className="group/tile"
    >
      <Link to={`/work/${c.id}`} className="block group">
        <div
          className="aspect-[4/3] relative overflow-hidden border border-bone/15 group-hover:border-bone/45 transition-colors duration-500"
          style={{ background: c.gradient }}
        >
          {thumbHD && (
            <img
              src={thumbHD}
              alt={c.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.045]"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = c.thumbnail;
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-75 group-hover:opacity-55 transition-opacity duration-700" />

          <div className="absolute top-3 left-4 font-mono text-[9px] tracking-[0.24em] uppercase text-bone/80 tabular-nums">
            {String(index + 2).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>

          <div className="absolute top-3 right-4 text-bone/90 opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out">
            <ArrowRight size={14} strokeWidth={1.4} />
          </div>

          <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-oxblood group-hover:w-full transition-all duration-700 ease-out" />
        </div>

        <div className="mt-4 flex items-center gap-2 font-mono text-[9px] tracking-[0.24em] uppercase text-bone/50">
          <span>{c.industry}</span>
          <span className="inline-block w-1 h-1 rounded-full bg-bone/30" />
          <span>{c.goal}</span>
        </div>

        <h3
          className="mt-2 font-serif text-bone leading-[1.18] tracking-[-0.005em] group-hover:text-bone/90 transition-colors duration-500"
          style={{ fontSize: 'clamp(18px, 1.5vw, 24px)' }}
        >
          {c.title}
        </h3>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {c.outputs[0] && (
            <span className="font-mono text-[8.5px] tracking-[0.2em] uppercase text-bone/55 border border-bone/15 px-2 py-[5px]">
              {c.outputs[0]}
            </span>
          )}
          {c.styleDNA.slice(0, 2).map((s) => (
            <span
              key={s}
              className="font-mono text-[8.5px] tracking-[0.2em] uppercase text-bone/55 border border-bone/15 px-2 py-[5px]"
            >
              {s}
            </span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}
