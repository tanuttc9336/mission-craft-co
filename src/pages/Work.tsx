import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  motion,
  useScroll,
  useMotionValue,
  useTransform,
  animate,
  AnimatePresence,
  LayoutGroup,
} from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';
import { cases, industries, goals, allOutputs, allStyleDNA } from '@/data/cases';
import { trackEvent } from '@/utils/analytics';
import { SeoHead, breadcrumbSchema, workIndexSchema } from '@/lib/seo';
import {
  EASE,
  LineReveal,
  BlurCursor,
  ScrollProgress,
  MetaLabel,
  DisplayHeadline,
  PageTopBar,
  PageFooter,
} from '@/components/editorial';

/* ────────────────────────────────
   Config
   ──────────────────────────────── */

type FilterGroup = {
  label: string;
  key: string;
  filterBy: string;
  options: string[];
};

const filterGroups: FilterGroup[] = [
  { label: 'Goal', key: 'goal', filterBy: 'goal', options: goals },
  { label: 'Industry', key: 'industry', filterBy: 'industry', options: industries },
  { label: 'Output', key: 'output', filterBy: 'format', options: allOutputs },
  { label: 'Style DNA', key: 'style', filterBy: 'style', options: allStyleDNA },
];

type Filters = Record<string, string[]>;

/* ────────────────────────────────
   Matching logic
   ──────────────────────────────── */

function caseMatches(
  c: typeof cases[number],
  filters: Filters,
  skipGroup?: string
): boolean {
  for (const [group, values] of Object.entries(filters)) {
    if (!values.length) continue;
    if (group === skipGroup) continue;
    if (group === 'Goal' && !values.includes(c.goal)) return false;
    if (group === 'Industry' && !values.includes(c.industry)) return false;
    if (group === 'Output' && !values.some((v) => c.outputs.includes(v))) return false;
    if (group === 'Style DNA' && !values.some((v) => c.styleDNA.includes(v)))
      return false;
  }
  return true;
}

function countForOption(filters: Filters, group: string, opt: string): number {
  // facet count = cases matching all OTHER groups AND this specific value
  return cases.filter((c) => {
    if (!caseMatches(c, filters, group)) return false;
    if (group === 'Goal') return c.goal === opt;
    if (group === 'Industry') return c.industry === opt;
    if (group === 'Output') return c.outputs.includes(opt);
    if (group === 'Style DNA') return c.styleDNA.includes(opt);
    return false;
  }).length;
}

/* ────────────────────────────────
   Number morph — tabular-nums animated
   ──────────────────────────────── */

function NumberMorph({
  value,
  pad = 2,
  className = '',
}: {
  value: number;
  pad?: number;
  className?: string;
}) {
  const mv = useMotionValue(value);
  const display = useTransform(mv, (v) =>
    String(Math.round(v)).padStart(pad, '0')
  );
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.55, ease: EASE });
    return () => controls.stop();
  }, [value, mv]);
  return <motion.span className={`tabular-nums ${className}`}>{display}</motion.span>;
}

/* ────────────────────────────────
   Page
   ──────────────────────────────── */

export default function Work() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hasInteracted, setHasInteracted] = useState(false);
  const markInteracted = useCallback(() => setHasInteracted(true), []);

  // Derive filters from URL
  const filters: Filters = useMemo(() => {
    const out: Filters = {};
    for (const g of filterGroups) {
      const values = searchParams.getAll(g.key);
      if (values.length) out[g.label] = values;
    }
    return out;
  }, [searchParams]);

  const writeFilters = useCallback(
    (next: Filters) => {
      const params = new URLSearchParams();
      for (const g of filterGroups) {
        const values = next[g.label] ?? [];
        for (const v of values) params.append(g.key, v);
      }
      setSearchParams(params, { replace: true });
    },
    [setSearchParams]
  );

  useEffect(() => {
    trackEvent('page_view', { page: 'work' });
  }, []);

  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: pageP } = useScroll({ target: pageRef });

  const toggleFilter = (group: string, value: string) => {
    markInteracted();
    const current = filters[group] ?? [];
    const nextValues = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    trackEvent('case_filter', { group, value });
    writeFilters({ ...filters, [group]: nextValues });
  };

  const clearAll = () => writeFilters({});
  const clearGroup = (group: string) =>
    writeFilters({ ...filters, [group]: [] });

  const filtered = useMemo(
    () => cases.filter((c) => caseMatches(c, filters)),
    [filters]
  );

  const activeCount = Object.values(filters).reduce((n, arr) => n + arr.length, 0);
  const hintActive = !hasInteracted && activeCount === 0;

  return (
    <>
      <SeoHead
        title="Work — Brand films, social, direction · Undercat Creatives"
        description="An index, not a highlight reel. Filter Undercat's selected work by industry, goal, or output — each file opens to what shipped, how it was made, and the rest of the reel."
        path="/work"
        jsonLd={[
          workIndexSchema(cases),
          breadcrumbSchema([
            ['Home', '/'],
            ['Work', '/work'],
          ]),
        ]}
      />
      <BlurCursor />
      <ScrollProgress progress={pageP} />

      <motion.div ref={pageRef} className="relative bg-ink text-bone min-h-screen">
        <PageTopBar progress={pageP} />

        {/* ══════════════════════════════════════════
            HERO — full-bleed video
            ══════════════════════════════════════════ */}
        <section className="relative h-screen min-h-[720px] overflow-hidden">
          {/* Video background */}
          <div className="absolute inset-0 bg-ink">
            <iframe
              title="Undercat — The work, on record."
              src="https://www.youtube.com/embed/cSWjRHb03G4?autoplay=1&mute=1&loop=1&playlist=cSWjRHb03G4&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1"
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

          {/* Cinematic overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/25 to-ink pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/40 via-transparent to-ink/10 pointer-events-none" />

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col">
            <div className="flex-1" />
            <div className="px-6 md:px-20 pb-16 md:pb-20">
              <div className="max-w-[1600px] mx-auto w-full">
                <div className="mb-10 md:mb-12 flex items-center gap-4">
                  <LineReveal asView>
                    <MetaLabel>The work</MetaLabel>
                  </LineReveal>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{ duration: 0.9, ease: EASE }}
                    style={{ transformOrigin: 'left', display: 'inline-block' }}
                    className="h-[1px] w-16 bg-bone/45"
                  />
                  <LineReveal asView delay={0.1}>
                    <MetaLabel variant="ghost" className="tabular-nums text-bone/80">
                      {cases.length} files on record
                    </MetaLabel>
                  </LineReveal>
                </div>

                <div className="max-w-[1500px]">
                  <DisplayHeadline
                    size="hero"
                    startDelay={0.1}
                    stagger={0.16}
                    lines={[
                      'The work,',
                      <>on <span className="italic font-light text-bone/90">record.</span></>,
                    ]}
                  />
                </div>

                <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
                  <div className="md:col-span-7 lg:col-span-6">
                    <LineReveal asView delay={0.2}>
                      <p
                        className="text-bone/80 leading-[1.75] tracking-wide"
                        style={{ fontSize: 'clamp(15px, 1.1vw, 17px)' }}
                      >
                        An index, not a highlight reel. Filter by industry,
                        goal, or the shape of the ask — each file opens to what
                        shipped, how it was made, and the rest of the reel.
                      </p>
                    </LineReveal>
                  </div>
                  <div className="md:col-span-5 lg:col-span-6 md:text-right">
                    <LineReveal asView delay={0.3}>
                      <MetaLabel variant="ghost" className="text-bone/65">
                        Bangkok <span className="text-bone/25 mx-2">|</span>{' '}
                        2562—2569
                      </MetaLabel>
                    </LineReveal>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll hint — bottom center */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 1.2 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none"
          >
            <motion.div
              animate={{ y: [0, 6, 0], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-[9px] tracking-[0.32em] uppercase font-mono text-bone/60">
                Scroll
              </span>
              <span className="inline-block w-[1px] h-6 bg-bone/40" />
            </motion.div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════
            BODY — Sticky rail + grid
            ══════════════════════════════════════════ */}
        <section className="relative px-6 md:px-20 pt-14 md:pt-20 pb-24 md:pb-32 border-t border-bone/15">
          <div className="max-w-[1600px] mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr] gap-10 lg:gap-14 xl:gap-20 items-start">
              {/* ─── Sticky Filter Rail ─── */}
              <aside className="lg:sticky lg:top-28 lg:self-start">
                <FilterRail
                  filters={filters}
                  filteredCount={filtered.length}
                  totalCount={cases.length}
                  activeCount={activeCount}
                  hintActive={hintActive}
                  onInteract={markInteracted}
                  onToggle={toggleFilter}
                  onClearAll={clearAll}
                  onClearGroup={clearGroup}
                />
              </aside>

              {/* ─── Grid ─── */}
              <div className="min-w-0">
                {/* Whisper + dynamic micro-copy */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
                  className="mb-10 md:mb-12 pb-6 border-b border-bone/15"
                >
                  <div className="flex items-baseline justify-between gap-6 flex-wrap">
                    <div className="flex items-baseline gap-4 min-w-0">
                      <span className="inline-block h-[1px] w-10 bg-bone/40 flex-shrink-0 translate-y-[-4px]" />
                      <p
                        className="font-serif italic text-bone/80 leading-[1.35]"
                        style={{ fontSize: 'clamp(16px, 1.35vw, 21px)' }}
                      >
                        Use the filters to explore — or scroll the full list.
                      </p>
                    </div>
                    <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-bone/55 flex-shrink-0">
                      <NumberMorph value={filtered.length} className="text-bone" />
                      <span className="ml-1.5">
                        {filtered.length === 1 ? 'file' : 'files'} match
                      </span>
                    </div>
                  </div>
                  <AnimatePresence>
                    {activeCount > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pl-[56px] text-[10px] font-mono tracking-[0.18em] uppercase text-bone/45">
                          Filtered by{' '}
                          <span className="text-bone/75">
                            {Object.values(filters).flat().join(' · ')}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <LayoutGroup>
                  {filtered.length === 0 ? (
                    <EmptyState onClear={clearAll} />
                  ) : (
                    <motion.div
                      layout
                      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-14 md:gap-y-20"
                    >
                      <AnimatePresence mode="popLayout">
                        {filtered.map((c, i) => (
                          <CaseTile
                            key={c.id}
                            caseItem={c}
                            index={i}
                            totalCount={cases.length}
                          />
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </LayoutGroup>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CTA
            ══════════════════════════════════════════ */}
        <section className="relative px-6 md:px-20 py-24 md:py-36 border-t border-bone/15">
          <div className="max-w-[1600px] mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20 items-end">
              <div className="md:col-span-7">
                <div className="mb-8 flex items-center gap-4">
                  <LineReveal asView>
                    <MetaLabel>Not on this page?</MetaLabel>
                  </LineReveal>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: EASE }}
                    style={{ transformOrigin: 'left', display: 'inline-block' }}
                    className="h-[1px] w-12 bg-bone/25"
                  />
                </div>

                <DisplayHeadline
                  asView
                  size="section"
                  stagger={0.14}
                  lines={[
                    'That\u2019s where',
                    <>briefs <span className="italic font-light text-bone/85">start.</span></>,
                  ]}
                  className="mb-8"
                />

                <LineReveal asView delay={0.3}>
                  <p className="text-bone/65 leading-[1.75] max-w-lg text-sm tracking-wide">
                    Most of our work starts as a conversation first, a file later.
                    Send us the shape of what you need — we'll point the direction.
                  </p>
                </LineReveal>
              </div>

              <div className="md:col-span-5 flex md:justify-end">
                <Link
                  to="/briefing-room"
                  className="group inline-flex items-center gap-4 px-8 md:px-10 py-5 md:py-6 bg-oxblood text-bone border border-oxblood hover:bg-oxblood/85 transition-colors duration-400"
                >
                  <span className="text-[11px] tracking-[0.28em] uppercase font-mono">
                    Open the Briefing Room
                  </span>
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1.5 transition-transform duration-400"
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <PageFooter
          marker={<>End of index</>}
          meta={{
            left: (
              <>
                Bangkok <span className="text-bone/15 mx-2">|</span> Est. 2568
              </>
            ),
          }}
        />
      </motion.div>
    </>
  );
}

/* ────────────────────────────────
   Filter Rail — sticky, quiet editorial
   ──────────────────────────────── */

function FilterRail({
  filters,
  filteredCount,
  totalCount,
  activeCount,
  hintActive,
  onInteract,
  onToggle,
  onClearAll,
  onClearGroup,
}: {
  filters: Filters;
  filteredCount: number;
  totalCount: number;
  activeCount: number;
  hintActive: boolean;
  onInteract: () => void;
  onToggle: (group: string, value: string) => void;
  onClearAll: () => void;
  onClearGroup: (group: string) => void;
}) {
  return (
    <div className="relative">
      {/* Header — intro + live count */}
      <div className="mb-7 pb-6 border-b border-bone/15">
        <LineReveal asView>
          <div className="flex items-start gap-2.5">
            <h2
              className="font-serif text-bone leading-[1.08]"
              style={{ fontSize: 'clamp(22px, 1.7vw, 28px)' }}
            >
              Browse by filter.
            </h2>
            <AnimatePresence>
              {hintActive && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="relative inline-flex items-center justify-center w-2.5 h-2.5 mt-[10px]"
                  aria-hidden
                >
                  <motion.span
                    animate={{ scale: [1, 2.2, 2.2], opacity: [0.55, 0, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full bg-oxblood"
                  />
                  <motion.span
                    animate={{ opacity: [1, 0.6, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative inline-block w-1.5 h-1.5 rounded-full bg-oxblood"
                  />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </LineReveal>

        <LineReveal asView delay={0.08}>
          <p
            className="mt-1.5 font-serif italic text-bone/55 leading-[1.35]"
            style={{ fontSize: 'clamp(13px, 0.95vw, 15px)' }}
          >
            Pick what you're looking for.
          </p>
        </LineReveal>

        {/* Live count — hairline separated */}
        <div className="mt-5 pt-4 border-t border-bone/10 flex items-baseline justify-between gap-3">
          <div className="flex items-baseline gap-2 font-mono text-[10px] tracking-[0.24em] uppercase text-bone/55">
            <span>Showing</span>
            <NumberMorph value={filteredCount} className="text-bone" />
            <span className="text-bone/30">/</span>
            <span className="tabular-nums text-bone/35">
              {String(totalCount).padStart(2, '0')}
            </span>
          </div>
          <AnimatePresence>
            {activeCount > 0 && (
              <motion.button
                initial={{ opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 4 }}
                transition={{ duration: 0.3, ease: EASE }}
                onClick={onClearAll}
                className="group inline-flex items-baseline gap-1.5 text-[9px] tracking-[0.26em] uppercase font-mono text-bone/50 hover:text-oxblood transition-colors duration-300"
              >
                <span>Clear</span>
                <NumberMorph
                  value={activeCount}
                  className="text-bone/30 group-hover:text-oxblood/80 transition-colors"
                />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Filter groups — accordion */}
      <div className="divide-y divide-bone/10 border-b border-bone/10">
        {filterGroups.map((group, gi) => {
          const active = filters[group.label] ?? [];
          return (
            <FilterGroupAccordion
              key={group.label}
              group={group}
              active={active}
              filters={filters}
              nudge={gi === 0 && hintActive}
              onInteract={onInteract}
              onToggle={onToggle}
              onClearGroup={onClearGroup}
            />
          );
        })}
      </div>

      {/* Bottom mark */}
      <div className="mt-5 flex items-center gap-3">
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          style={{ transformOrigin: 'left', display: 'inline-block' }}
          className="h-[1px] w-6 bg-bone/25"
        />
        <MetaLabel variant="ghost">Combine any of them</MetaLabel>
      </div>
    </div>
  );
}

/* ────────────────────────────────
   Filter Group Accordion
   ──────────────────────────────── */

function FilterGroupAccordion({
  group,
  active,
  filters,
  nudge,
  onInteract,
  onToggle,
  onClearGroup,
}: {
  group: FilterGroup;
  active: string[];
  filters: Filters;
  nudge: boolean;
  onInteract: () => void;
  onToggle: (group: string, value: string) => void;
  onClearGroup: (group: string) => void;
}) {
  // Auto-open if this group has active filters on mount (URL-driven)
  const [open, setOpen] = useState(active.length > 0);
  const activeCount = active.length;

  return (
    <div className="py-[18px]">
      {/* Header — clickable row */}
      <button
        onClick={() => {
          onInteract();
          setOpen((o) => !o);
        }}
        className="group w-full flex items-center justify-between gap-3 text-left"
        aria-expanded={open}
      >
        <div className="flex items-baseline gap-3 min-w-0">
          <span className="font-mono text-[10px] tracking-[0.24em] uppercase">
            <span
              className={`transition-colors duration-300 ${
                open ? 'text-bone/50' : 'text-bone/30 group-hover:text-bone/55'
              }`}
            >
              Filter by
            </span>{' '}
            <span
              className={`transition-colors duration-300 ${
                open ? 'text-bone' : 'text-bone/70 group-hover:text-bone'
              }`}
            >
              {group.filterBy}
            </span>
          </span>
          <AnimatePresence>
            {activeCount > 0 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[8.5px] font-mono tabular-nums tracking-wider bg-oxblood text-bone"
              >
                {activeCount}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <motion.span
          animate={
            open
              ? { rotate: 45, x: 0 }
              : nudge
              ? { rotate: [0, -14, 6, -8, 0], x: [0, -2, 1, -1, 0] }
              : { rotate: 0, x: 0 }
          }
          transition={
            open
              ? { duration: 0.4, ease: EASE }
              : nudge
              ? {
                  duration: 1.1,
                  ease: EASE,
                  repeat: Infinity,
                  repeatDelay: 2.5,
                }
              : { duration: 0.4, ease: EASE }
          }
          className={`flex items-center justify-center w-4 h-4 transition-colors ${
            nudge && !open
              ? 'text-oxblood'
              : 'text-bone/45 group-hover:text-bone/80'
          }`}
          aria-hidden
        >
          <Plus size={12} strokeWidth={1.5} />
        </motion.span>
      </button>

      {/* Collapsed summary — show active filters inline when closed */}
      <AnimatePresence initial={false}>
        {!open && activeCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="mt-2.5 flex flex-wrap gap-1">
              {active.map((v) => (
                <span
                  key={v}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] tracking-[0.2em] uppercase font-mono border border-oxblood/50 text-bone/85 bg-oxblood/15"
                >
                  {v}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded — full chip grid */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pt-4 pb-1">
              <div className="flex flex-wrap gap-1.5">
                {group.options.map((opt) => {
                  const isActive = active.includes(opt);
                  const count = countForOption(filters, group.label, opt);
                  const disabled = !isActive && count === 0;
                  return (
                    <FilterChip
                      key={opt}
                      label={opt}
                      count={count}
                      active={isActive}
                      disabled={disabled}
                      onClick={() => onToggle(group.label, opt)}
                    />
                  );
                })}
              </div>
              {activeCount > 0 && (
                <button
                  onClick={() => onClearGroup(group.label)}
                  className="mt-3 text-[9px] font-mono tracking-[0.24em] uppercase text-bone/40 hover:text-oxblood transition-colors"
                >
                  Clear {group.filterBy}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ────────────────────────────────
   Filter Chip — with live count
   ──────────────────────────────── */

function FilterChip({
  label,
  count,
  active,
  disabled,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.96 }}
      transition={{ duration: 0.15, ease: EASE }}
      className={`group/chip relative inline-flex items-center gap-1.5 px-2.5 py-[7px] text-[9.5px] tracking-[0.2em] uppercase font-mono border transition-all duration-300 ${
        active
          ? 'border-oxblood bg-oxblood text-bone shadow-[0_0_0_1px_rgba(121,15,24,0.4)]'
          : disabled
          ? 'border-bone/10 text-bone/20 bg-transparent cursor-not-allowed'
          : 'border-bone/25 text-bone/75 bg-bone/[0.02] hover:border-bone/70 hover:text-bone hover:bg-bone/[0.08]'
      }`}
    >
      <span>{label}</span>
      {!disabled && (
        <span
          className={`tabular-nums text-[8px] ${
            active
              ? 'text-bone/70'
              : 'text-bone/30 group-hover/chip:text-bone/60'
          }`}
        >
          <NumberMorph value={count} />
        </span>
      )}
    </motion.button>
  );
}

/* ────────────────────────────────
   Empty State
   ──────────────────────────────── */

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="py-24 md:py-32 text-center border border-dashed border-bone/15">
      <LineReveal asView>
        <p
          className="font-serif text-bone/70 italic mb-5"
          style={{ fontSize: 'clamp(22px, 2.4vw, 36px)' }}
        >
          Nothing matches that filter.
        </p>
      </LineReveal>
      <LineReveal asView delay={0.1}>
        <p className="text-bone/55 text-sm max-w-md mx-auto leading-relaxed">
          Clear a filter to see more.
        </p>
      </LineReveal>
      <button
        onClick={onClear}
        className="mt-8 text-[10px] tracking-[0.28em] uppercase font-mono text-bone/80 hover:text-oxblood transition-colors border-b border-bone/30 hover:border-oxblood pb-1"
      >
        Clear all filters
      </button>
    </div>
  );
}

/* ────────────────────────────────
   CaseTile — editorial grid card (with layout motion)
   ──────────────────────────────── */

function CaseTile({
  caseItem: c,
  index,
  totalCount,
}: {
  caseItem: typeof cases[number];
  index: number;
  totalCount: number;
}) {
  const [hover, setHover] = useState(false);
  const thumb =
    c.thumbnail && c.thumbnail.includes('i.ytimg.com') && c.thumbnail.includes('hqdefault')
      ? c.thumbnail.replace('hqdefault', 'maxresdefault')
      : c.thumbnail;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.35, ease: EASE } }}
      transition={{
        layout: { duration: 0.7, ease: EASE },
        opacity: { duration: 0.65, delay: Math.min(index, 6) * 0.05, ease: EASE },
        y: { duration: 0.8, delay: Math.min(index, 6) * 0.05, ease: EASE },
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group/tile"
    >
      <Link to={`/work/${c.id}`} className="block group">
        {/* Thumbnail */}
        <motion.div
          animate={{ y: hover ? -4 : 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="aspect-[4/3] relative overflow-hidden border border-bone/15 group-hover:border-bone/45 transition-colors duration-500"
          style={{ background: c.gradient }}
        >
          {thumb && (
            <motion.img
              src={thumb}
              alt={c.title}
              loading="lazy"
              animate={{ scale: hover ? 1.045 : 1 }}
              transition={{ duration: 1.2, ease: EASE }}
              className="w-full h-full object-cover will-change-transform"
            />
          )}

          <motion.div
            animate={{ opacity: hover ? 0.55 : 0.22 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink"
          />

          {/* File number — top-left */}
          <div className="absolute top-3 left-4">
            <MetaLabel variant="quiet" className="tabular-nums text-bone/90">
              {String(index + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
            </MetaLabel>
          </div>

          {/* Hover arrow — top-right */}
          <motion.div
            animate={{
              opacity: hover ? 1 : 0,
              x: hover ? 0 : -6,
            }}
            transition={{ duration: 0.5, ease: EASE }}
            className="absolute top-3 right-4 text-bone/90"
            aria-hidden
          >
            <ArrowRight size={14} strokeWidth={1.4} />
          </motion.div>

          {/* Oxblood draw-in hairline */}
          <motion.div
            aria-hidden
            initial={false}
            animate={{ scaleX: hover ? 1 : 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ transformOrigin: hover ? 'left' : 'right' }}
            className="absolute bottom-0 left-0 right-0 h-[1px] bg-oxblood"
          />
        </motion.div>

        {/* Meta row — industry — goal */}
        <div className="mt-5 flex items-center gap-3">
          <MetaLabel variant="ghost" className="group-hover:text-bone/80 transition-colors duration-500">
            {c.industry}
          </MetaLabel>
          <motion.span
            aria-hidden
            initial={{ scaleX: 0.3 }}
            animate={{ scaleX: hover ? 1 : 0.3 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{ transformOrigin: 'left', display: 'inline-block' }}
            className="h-[1px] w-8 bg-bone/30"
          />
          <MetaLabel variant="ghost" className="group-hover:text-bone/80 transition-colors duration-500">
            {c.goal}
          </MetaLabel>
        </div>

        {/* Title */}
        <h3
          className="mt-2.5 font-serif text-bone/90 group-hover:text-bone leading-[1.18] transition-colors duration-500"
          style={{ fontSize: 'clamp(18px, 1.45vw, 24px)' }}
        >
          {c.title}
        </h3>

        {/* Tag pills — output + style DNA only (industry·goal already in meta row) */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {c.outputs[0] && (
            <span className="px-2.5 py-1 text-[9px] tracking-[0.22em] uppercase font-mono border border-bone/30 text-bone/70 group-hover:border-bone/55 group-hover:text-bone/90 transition-colors duration-500">
              {c.outputs[0]}
            </span>
          )}
          {c.styleDNA.slice(0, 2).map((s) => (
            <span
              key={s}
              className="px-2.5 py-1 text-[9px] tracking-[0.22em] uppercase font-mono border border-bone/15 text-bone/50 group-hover:border-bone/30 group-hover:text-bone/70 transition-colors duration-500"
            >
              {s}
            </span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}
