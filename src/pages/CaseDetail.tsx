import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cases } from '@/data/cases';
import { trackEvent } from '@/utils/analytics';
import { LivingGrain } from '@/components/effects';
import { SeoHead, breadcrumbSchema, creativeWorkSchema } from '@/lib/seo';
import {
  EASE,
  LineReveal,
  Chapter,
  BlurCursor,
  ScrollProgress,
  MetaLabel,
  DisplayHeadline,
  EditorialSection,
  PageTopBar,
  PageFooter,
} from '@/components/editorial';

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const c = cases.find((x) => x.id === id);

  useEffect(() => {
    trackEvent('page_view', { page: 'case_detail', caseId: id });
  }, [id]);

  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: pageP } = useScroll({ target: pageRef });

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroVideoY = useTransform(heroP, [0, 1], ['0%', '22%']);
  const heroContentY = useTransform(heroP, [0, 1], ['0%', '-10%']);
  const heroOpacity = useTransform(heroP, [0, 0.8], [1, 0]);

  if (!c) {
    return (
      <div className="min-h-screen bg-ink text-bone flex flex-col items-center justify-center gap-6 px-6">
        <MetaLabel variant="quiet">404 — Case not found</MetaLabel>
        <Link
          to="/work"
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-bone/70 hover:text-bone transition-colors"
        >
          <ArrowLeft size={14} /> Back to Work
        </Link>
      </div>
    );
  }

  const mainVideoId = c.videoIds?.[0];
  const allMeta = [
    c.industry,
    c.goal,
    ...(c.platforms ?? []),
    c.scale,
    c.audience,
  ].filter(Boolean) as string[];

  // Truncate description to ~155 chars for meta description.
  const metaDesc =
    c.description.length > 155
      ? c.description.slice(0, 152).trimEnd() + '…'
      : c.description;

  return (
    <>
      <SeoHead
        title={`${c.title} · Undercat Creatives`}
        description={metaDesc}
        path={`/work/${c.id}`}
        image={c.thumbnail}
        ogType="article"
        jsonLd={[
          creativeWorkSchema(c),
          breadcrumbSchema([
            ['Home', '/'],
            ['Work', '/work'],
            [c.title, `/work/${c.id}`],
          ]),
        ]}
      />
      <BlurCursor />
      <ScrollProgress progress={pageP} />

      <motion.div ref={pageRef} className="relative bg-ink text-bone">
        <PageTopBar progress={pageP} />

        {/* ══════════════════════════════════════════
            01 — CASE (Hero)
            ══════════════════════════════════════════ */}
        <section ref={heroRef} className="relative h-[118vh] overflow-hidden">
          {/* Video layer */}
          <motion.div
            style={{ y: heroVideoY }}
            className="absolute inset-0 -top-[10vh] -bottom-[10vh]"
          >
            {mainVideoId ? (
              <iframe
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(177.77vh+40px)] h-[calc(56.25vw+40px)] min-w-[calc(100%+40px)] min-h-[calc(100%+40px)] pointer-events-none"
                src={`https://www.youtube.com/embed/${mainVideoId}?autoplay=1&mute=1&loop=1&playlist=${mainVideoId}&controls=0&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`}
                allow="autoplay; encrypted-media"
                title={c.title}
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{ background: c.gradient }}
              >
                {c.thumbnail && (
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            )}

            {/* Scrims */}
            <div className="absolute inset-0 bg-ink/62" />
            <div className="absolute inset-0 bg-gradient-to-b from-ink/65 via-transparent to-ink" />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at center, transparent 35%, hsl(0 0% 4% / 0.6) 100%)',
              }}
            />
          </motion.div>

          {/* Grain */}
          <div className="absolute inset-0 mix-blend-overlay opacity-65 pointer-events-none">
            <LivingGrain />
          </div>
          <div className="absolute inset-0 mix-blend-soft-light opacity-40 pointer-events-none">
            <LivingGrain />
          </div>

          {/* Left vertical stamp */}
          <div className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-10 hidden md:block">
            <div
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              className="flex items-center gap-5 text-[10px] tracking-[0.34em] uppercase text-bone/55 font-mono"
            >
              <motion.span
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.1, ease: EASE }}
              >
                Case file
              </motion.span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1.3, ease: EASE }}
                style={{ display: 'inline-block', transformOrigin: 'left' }}
                className="h-[1px] w-10 bg-bone/35"
              />
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.5, ease: EASE }}
              >
                {c.title}
              </motion.span>
            </div>
          </div>

          {/* Content */}
          <motion.div
            style={{ y: heroContentY, opacity: heroOpacity }}
            className="sticky top-0 h-screen flex flex-col justify-between px-6 md:px-20 py-28 md:py-32"
          >
            {/* Top row — chapter + back link */}
            <div className="pt-6 flex items-center justify-between">
              <LineReveal delay={0.9}>
                <Chapter index="01" label="Case file" />
              </LineReveal>
              <LineReveal delay={0.9}>
                <Link
                  to="/work"
                  className="hidden md:inline-flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-bone/55 hover:text-bone/90 transition-colors duration-500 font-mono"
                >
                  <ArrowLeft size={12} /> Back to work
                </Link>
              </LineReveal>
            </div>

            {/* Center — title */}
            <div className="max-w-[1500px]">
              <DisplayHeadline
                size="hero"
                startDelay={0.2}
                stagger={0.16}
                lines={[c.title]}
              />
            </div>

            {/* Bottom — description + meta */}
            <div className="flex items-end justify-between gap-10">
              <div className="max-w-xl">
                <LineReveal delay={0.85}>
                  <p className="text-bone/70 text-sm tracking-wide leading-[1.75]">
                    {c.description}
                  </p>
                </LineReveal>
              </div>

              <div className="text-right pb-1 hidden md:block">
                <div className="flex items-center justify-end gap-2 mb-1.5">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-1 h-1 rounded-full bg-oxblood"
                  />
                  <LineReveal delay={1}>
                    <MetaLabel>Now playing</MetaLabel>
                  </LineReveal>
                </div>
                <LineReveal delay={1.1}>
                  <MetaLabel variant="loud">{c.industry} · {c.goal}</MetaLabel>
                </LineReveal>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════
            02 — OVERVIEW (meta strip)
            ══════════════════════════════════════════ */}
        <EditorialSection
          index="02"
          label="Overview"
          aside={
            <LineReveal asView>
              <MetaLabel variant="ghost">
                {allMeta.length} attributes <span className="text-bone/15 mx-2">|</span> Case no. {String(cases.findIndex(x => x.id === c.id) + 1).padStart(2, '0')}
              </MetaLabel>
            </LineReveal>
          }
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-10">
            <MetaField label="Industry" value={c.industry} />
            <MetaField label="Goal" value={c.goal} />
            <MetaField label="Scale" value={c.scale ?? '—'} />
            <MetaField label="Audience" value={c.audience ?? '—'} />
          </div>

          {c.outputs.length > 0 && (
            <TagRow label="Outputs" items={c.outputs} />
          )}

          {c.platforms && c.platforms.length > 0 && (
            <TagRow label="Platforms" items={c.platforms} variant="quiet" />
          )}

          {c.styleDNA.length > 0 && (
            <div className="mt-14 pt-10 border-t border-bone/10">
              <MetaLabel variant="ghost" className="block mb-5">
                Style DNA
              </MetaLabel>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {c.styleDNA.map((s, i) => (
                  <LineReveal asView key={s} delay={0.05 * i}>
                    <span
                      className="font-serif text-bone/85"
                      style={{ fontSize: 'clamp(20px, 2.2vw, 32px)' }}
                    >
                      {s}
                      {i < c.styleDNA.length - 1 && (
                        <span className="text-bone/20 mx-3">/</span>
                      )}
                    </span>
                  </LineReveal>
                ))}
              </div>
            </div>
          )}
        </EditorialSection>

        {/* ══════════════════════════════════════════
            03 — DELIVERABLES
            ══════════════════════════════════════════ */}
        <EditorialSection index="03" label="Deliverables">
          <div className="max-w-4xl">
            <DisplayHeadline
              asView
              size="section"
              stagger={0.12}
              lines={['What shipped.']}
              className="mb-14"
            />

            <ul className="space-y-0 border-t border-bone/10">
              {c.deliverables.map((d, i) => (
                <li
                  key={d}
                  className="border-b border-bone/10 py-5 md:py-7 flex items-baseline gap-6 md:gap-10 group"
                >
                  <LineReveal asView delay={0.05 * i}>
                    <MetaLabel variant="ghost" className="tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </MetaLabel>
                  </LineReveal>
                  <LineReveal asView delay={0.08 + 0.05 * i}>
                    <span
                      className="font-serif text-bone/90 group-hover:text-bone transition-colors duration-500"
                      style={{ fontSize: 'clamp(18px, 1.6vw, 24px)' }}
                    >
                      {d}
                    </span>
                  </LineReveal>
                </li>
              ))}
            </ul>
          </div>
        </EditorialSection>

        {/* ══════════════════════════════════════════
            04 — APPROACH
            ══════════════════════════════════════════ */}
        <EditorialSection index="04" label="Approach" numeralPosition="left-bottom" numeralDrift="down">
          <div className="max-w-4xl">
            <DisplayHeadline
              asView
              size="section"
              stagger={0.12}
              lines={['How we made it.']}
              className="mb-14"
            />

            <ol className="space-y-10 md:space-y-12">
              {c.approach.map((a, i) => (
                <li key={i} className="flex items-start gap-6 md:gap-10">
                  <LineReveal asView delay={0.05 * i}>
                    <MetaLabel variant="ghost" className="tabular-nums pt-2">
                      {String(i + 1).padStart(2, '0')}
                    </MetaLabel>
                  </LineReveal>
                  <LineReveal asView delay={0.08 + 0.05 * i}>
                    <p
                      className="text-bone/75 leading-[1.65] max-w-2xl"
                      style={{ fontSize: 'clamp(15px, 1.25vw, 20px)' }}
                    >
                      {a}
                    </p>
                  </LineReveal>
                </li>
              ))}
            </ol>
          </div>
        </EditorialSection>

        {/* ══════════════════════════════════════════
            05 — MORE FROM THIS PROJECT
            ══════════════════════════════════════════ */}
        {c.videoIds && c.videoIds.length > 1 && (
          <EditorialSection index="05" label="More from this project">
            <DisplayHeadline
              asView
              size="minor"
              lines={['The rest of the reel.']}
              className="mb-12"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              {c.videoIds.slice(1).map((vid, i) => (
                <motion.div
                  key={vid}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.9, delay: 0.08 * i, ease: EASE }}
                  className="aspect-video border border-bone/10 overflow-hidden relative group"
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${vid}?rel=0&modestbranding=1`}
                    title={`${c.title} — additional ${i + 1}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <div className="absolute bottom-3 left-4 pointer-events-none">
                    <MetaLabel variant="quiet" className="tabular-nums">
                      0{i + 2} / 0{c.videoIds!.length}
                    </MetaLabel>
                  </div>
                </motion.div>
              ))}
            </div>
          </EditorialSection>
        )}

        {/* ══════════════════════════════════════════
            06 — NEXT STEP
            ══════════════════════════════════════════ */}
        <EditorialSection index="06" label="Next step" numeralPosition="right-top">
          <div className="max-w-4xl">
            <DisplayHeadline
              asView
              size="section"
              stagger={0.14}
              lines={[
                'Start a brief',
                <>like <span className="italic font-light text-bone/85">this one.</span></>,
              ]}
              className="mb-10"
            />
            <LineReveal asView delay={0.3}>
              <p className="text-bone/65 leading-[1.75] max-w-xl mb-12 text-sm tracking-wide">
                If this is the shape of the work you want, the Briefing Room is where it begins.
                Ten minutes, structured questions, no sales pitch.
              </p>
            </LineReveal>

            <motion.button
              onClick={() => navigate('/briefing-room')}
              whileHover={{ x: 6 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="group inline-flex items-center gap-4 border-t border-b border-bone/20 py-5 pr-4 pl-0 hover:border-oxblood/60 transition-colors duration-500"
            >
              <MetaLabel variant="loud" className="text-bone group-hover:text-bone transition-colors">
                Open the Briefing Room
              </MetaLabel>
              <ArrowRight
                size={16}
                className="text-bone/60 group-hover:text-oxblood transition-colors duration-500"
              />
            </motion.button>
          </div>
        </EditorialSection>

        <PageFooter
          marker={
            <>
              06 <span className="text-bone/15 mx-2">|</span> — <span className="text-bone/15 mx-2">|</span> End of case
            </>
          }
          meta={{
            left: (
              <>
                Bangkok <span className="text-bone/15 mx-2">|</span> {c.industry}
              </>
            ),
          }}
        />
      </motion.div>
    </>
  );
}

/* ────────────────────────────────
   MetaField — label / value pair
   ──────────────────────────────── */
function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2">
      <MetaLabel variant="ghost">{label}</MetaLabel>
      <LineReveal asView>
        <span
          className="font-serif text-bone/90"
          style={{ fontSize: 'clamp(18px, 1.6vw, 26px)' }}
        >
          {value}
        </span>
      </LineReveal>
    </div>
  );
}

/* ────────────────────────────────
   TagRow — editorial hairline tag chips
   ──────────────────────────────── */
function TagRow({
  label,
  items,
  variant = 'default',
}: {
  label: string;
  items: string[];
  variant?: 'default' | 'quiet';
}) {
  const isQuiet = variant === 'quiet';
  return (
    <div className="mt-14 pt-10 border-t border-bone/10">
      <MetaLabel variant="ghost" className="block mb-5">
        {label}
      </MetaLabel>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <LineReveal asView key={item} delay={0.04 * i}>
            <span
              className={`inline-block px-4 py-2 text-[10px] tracking-[0.22em] uppercase font-mono border transition-colors duration-500 ${
                isQuiet
                  ? 'border-bone/10 text-bone/50 hover:border-bone/25 hover:text-bone/75'
                  : 'border-bone/20 text-bone/75 hover:border-oxblood/60 hover:text-bone'
              }`}
            >
              {item}
            </span>
          </LineReveal>
        ))}
      </div>
    </div>
  );
}
