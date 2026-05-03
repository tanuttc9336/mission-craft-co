import { motion, useReducedMotion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { useChapterCursor } from '@/contexts/CursorContext';
import { Chapter } from '@/components/scroll/Chapter';
import { trackEvent } from '@/lib/analytics';
import { useDomOpacity, useDomOpacityKeyframes } from '@/lib/use-dom-opacity';

type FormatKind = 'wide' | 'vertical' | 'square';
type RouteDirection = 'left' | 'bottom' | 'right';
type AnimatedScalar = MotionValue<number> | number;

interface FormatConfig {
  id: string;
  ratio: string;
  kind: FormatKind;
  label: string;
  dimensions: string;
  sequence: string;
  purpose: string;
  railStop: string;
  accent: string;
  frameWidthClass: string;
  panelClass: string;
  safeAreaClass: string;
  route: RouteDirection;
  enterRange: [number, number];
  detailRange: [number, number];
}

const FORMATS: FormatConfig[] = [
  {
    id: 'wide',
    ratio: '16:9',
    kind: 'wide',
    label: 'chapter-05/deliver-multiformat-still.jpg [16:9]',
    dimensions: '1920 x 1080',
    sequence: '01',
    purpose: 'first touch',
    railStop: '18%',
    accent: '#d6a062',
    frameWidthClass: 'w-[94%] xl:w-full',
    panelClass: 'min-[760px]:col-span-2 xl:col-span-1',
    safeAreaClass: 'inset-x-[8%] inset-y-[13%]',
    route: 'left',
    enterRange: [0.12, 0.24],
    detailRange: [0.18, 0.30],
  },
  {
    id: 'vertical',
    ratio: '9:16',
    kind: 'vertical',
    label: 'chapter-05/deliver-multiformat-still.jpg [9:16]',
    dimensions: '1080 x 1920',
    sequence: '02',
    purpose: 'hold longer',
    railStop: '52%',
    accent: '#7ea2c6',
    frameWidthClass: 'w-[54%] min-[760px]:w-[46%] xl:w-[56%]',
    panelClass: '',
    safeAreaClass: 'inset-x-[12%] inset-y-[8%]',
    route: 'bottom',
    enterRange: [0.18, 0.30],
    detailRange: [0.24, 0.36],
  },
  {
    id: 'square',
    ratio: '1:1',
    kind: 'square',
    label: 'chapter-05/deliver-multiformat-still.jpg [1:1]',
    dimensions: '1080 x 1080',
    sequence: '03',
    purpose: 'next move',
    railStop: '84%',
    accent: '#98b56f',
    frameWidthClass: 'w-[76%] min-[760px]:w-[68%] xl:w-[78%]',
    panelClass: '',
    safeAreaClass: 'inset-[11%]',
    route: 'right',
    enterRange: [0.24, 0.36],
    detailRange: [0.30, 0.42],
  },
];

const RULER_POSITIONS = ['12%', '34%', '50%', '66%', '88%'];

function withAlpha(hex: string, alpha: string) {
  return `${hex}${alpha}`;
}

function Placeholder({ label, className }: { label: string; className?: string }) {
  return (
    <div className={`relative flex h-full w-full items-end bg-white/[0.04] p-2 ${className ?? ''}`}>
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '1.2rem 1.2rem, 1.2rem 1.2rem',
        }}
      />
      <span className="relative text-[8px] font-mono leading-none tracking-[0.14em] text-white/22 break-all md:text-[9px]">
        {label}
      </span>
    </div>
  );
}

function RegistrationCross({ className }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute h-4 w-4 ${className ?? ''}`}>
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/[0.14]" />
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/[0.14]" />
    </div>
  );
}

function CropCorners() {
  return (
    <div className="pointer-events-none absolute inset-3">
      <div className="absolute left-0 top-0 h-4 w-4 border-l border-t border-white/[0.18]" />
      <div className="absolute right-0 top-0 h-4 w-4 border-r border-t border-white/[0.18]" />
      <div className="absolute left-0 bottom-0 h-4 w-4 border-l border-b border-white/[0.18]" />
      <div className="absolute right-0 bottom-0 h-4 w-4 border-r border-b border-white/[0.18]" />
    </div>
  );
}

function getAspectClass(kind: FormatKind) {
  if (kind === 'vertical') return 'aspect-[9/16]';
  if (kind === 'square') return 'aspect-square';
  return 'aspect-video';
}

function DeliveryDock({
  config,
  frameX,
  frameY,
  frameScale,
  routeScale,
  guideScaleX,
  guideScaleY,
  detailScale,
}: {
  config: FormatConfig;
  frameX: AnimatedScalar;
  frameY: AnimatedScalar;
  frameScale: AnimatedScalar;
  routeScale: AnimatedScalar;
  guideScaleX: AnimatedScalar;
  guideScaleY: AnimatedScalar;
  detailScale: AnimatedScalar;
}) {
  const routeHorizontal = config.route !== 'bottom';
  const accent = config.accent;

  return (
    <div className={`relative h-full ${config.panelClass}`}>
      <div className="relative flex h-full flex-col border border-white/10 bg-black/[0.84] p-3 md:p-4">
        <RegistrationCross className="-left-2 -top-2" />
        <RegistrationCross className="-right-2 -bottom-2" />

        <div className="border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className="flex h-4 min-w-[1.85rem] items-center justify-center border px-1 text-[7px] font-mono tracking-[0.22em] md:text-[8px]"
                style={{
                  borderColor: withAlpha(accent, '5a'),
                  color: accent,
                  backgroundColor: withAlpha(accent, '12'),
                }}
              >
                {config.sequence}
              </div>
              <span className="text-[8px] font-mono tracking-[0.24em] text-white/72 md:text-[9px]">
                {config.ratio}
              </span>
              <div className="flex items-center gap-1">
                {[0, 1, 2].map((index) => (
                  <span
                    key={`${config.id}-pip-${index}`}
                    className="block h-1.5 w-1.5 border"
                    style={{
                      borderColor: index + 1 <= Number(config.sequence) ? withAlpha(accent, '8c') : 'rgba(255,255,255,0.14)',
                      backgroundColor: index + 1 === Number(config.sequence) ? withAlpha(accent, '88') : 'transparent',
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="h-px flex-1 bg-white/[0.08]" />
            <span className="text-[8px] font-mono tracking-[0.18em] text-white/26 md:text-[9px]">{config.dimensions}</span>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rotate-45" style={{ backgroundColor: accent }} />
            <span className="text-[8px] font-mono tracking-[0.18em] md:text-[9px]" style={{ color: withAlpha(accent, 'd8') }}>
              {config.purpose}
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
            <div className="flex items-center gap-1">
              <span className="block h-1 w-3" style={{ backgroundColor: withAlpha(accent, '38') }} />
              <span className="block h-1 w-1 border border-white/[0.14]" />
            </div>
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center overflow-hidden py-5 md:py-6">
          <div className="absolute inset-4 border border-dashed border-white/[0.06]" />
          <div className="absolute inset-x-4 top-4 h-px bg-white/[0.04]" />
          <div className="absolute inset-x-4 bottom-4 h-px bg-white/[0.04]" />
          <div className="absolute inset-y-4 left-4 w-px bg-white/[0.04]" />
          <div className="absolute inset-y-4 right-4 w-px bg-white/[0.04]" />

          {routeHorizontal ? (
            <>
              <motion.div
                style={{ scaleX: routeScale, backgroundColor: withAlpha(accent, 'aa') }}
                className={`absolute top-1/2 h-px w-[42%] -translate-y-1/2 bg-white/[0.14] ${
                  config.route === 'left' ? 'left-0 origin-left' : 'right-0 origin-right'
                }`}
              />
              <motion.div
                style={{ scale: routeScale, backgroundColor: accent }}
                className={`absolute top-1/2 h-2 w-2 -translate-y-1/2 ${
                  config.route === 'left' ? 'left-[42%] -translate-x-1/2' : 'right-[42%] translate-x-1/2'
                }`}
              />
            </>
          ) : (
            <>
              <motion.div
                style={{ scaleY: routeScale, backgroundColor: withAlpha(accent, 'aa') }}
                className="absolute bottom-0 left-1/2 h-[40%] w-px -translate-x-1/2 bg-white/[0.14] origin-bottom"
              />
              <motion.div
                style={{ scale: routeScale, backgroundColor: accent }}
                className="absolute bottom-[40%] left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2"
              />
            </>
          )}

          <div className={`${config.frameWidthClass} relative`}>
            <div
              className="absolute inset-[-0.75rem] border border-dashed"
              style={{ borderColor: withAlpha(accent, '2e') }}
            />

            <motion.div
              style={{ x: frameX, y: frameY, scale: frameScale }}
              className={`relative overflow-hidden border border-white/[0.16] bg-black ${getAspectClass(config.kind)}`}
            >
              <div className="absolute inset-[-12%] border border-white/[0.05]" />
              <div className="absolute inset-[6%] border border-white/[0.05]" />
              <Placeholder label={config.label} className="absolute inset-0 border-none" />

              <motion.div
                style={{ scaleX: guideScaleX, backgroundColor: withAlpha(accent, '66') }}
                className="absolute left-[10%] right-[10%] top-[10%] h-px origin-left"
              />
              <motion.div
                style={{ scaleY: guideScaleY, backgroundColor: withAlpha(accent, '66') }}
                className="absolute bottom-[10%] left-[10%] top-[10%] w-px origin-top bg-white/[0.12]"
              />

              {RULER_POSITIONS.map((position) => (
                <motion.div
                  key={`${config.id}-top-${position}`}
                  style={{ left: position, scaleY: guideScaleY }}
                  className="absolute top-[10%] h-2 w-px -translate-x-1/2 origin-top bg-white/[0.12]"
                />
              ))}
              {RULER_POSITIONS.map((position) => (
                <motion.div
                  key={`${config.id}-left-${position}`}
                  style={{ top: position, scaleX: guideScaleX }}
                  className="absolute left-[10%] h-px w-2 -translate-y-1/2 origin-left bg-white/[0.12]"
                />
              ))}

              <motion.div
                style={{
                  scaleX: detailScale,
                  scaleY: detailScale,
                  borderColor: withAlpha(accent, '74'),
                  backgroundColor: withAlpha(accent, '08'),
                }}
                className={`absolute border ${config.safeAreaClass}`}
              />
              <motion.div
                style={{ scaleY: guideScaleY, backgroundColor: withAlpha(accent, '44') }}
                className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 origin-top bg-white/[0.08]"
              />
              <motion.div
                style={{ scaleX: guideScaleX, backgroundColor: withAlpha(accent, '44') }}
                className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 origin-left bg-white/[0.08]"
              />
              <motion.div
                style={{ scaleY: guideScaleY }}
                className="absolute bottom-[8%] left-1/3 top-[8%] w-px -translate-x-1/2 origin-top bg-white/[0.05]"
              />
              <motion.div
                style={{ scaleY: guideScaleY }}
                className="absolute bottom-[8%] left-2/3 top-[8%] w-px -translate-x-1/2 origin-top bg-white/[0.05]"
              />
              <motion.div
                style={{ scaleX: guideScaleX }}
                className="absolute left-[8%] right-[8%] top-1/3 h-px -translate-y-1/2 origin-left bg-white/[0.05]"
              />
              <motion.div
                style={{ scaleX: guideScaleX }}
                className="absolute left-[8%] right-[8%] top-2/3 h-px -translate-y-1/2 origin-left bg-white/[0.05]"
              />

              <CropCorners />
            </motion.div>
          </div>
        </div>

        <div className="border-t border-white/[0.08] pt-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-mono tracking-[0.18em] text-white/20 md:text-[9px]">
                {config.sequence}
              </span>
              <div className="relative h-3 w-[7.5rem]">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/[0.06]" />
                {['0%', '33%', '66%', '100%'].map((left) => (
                  <span
                    key={`${config.id}-rail-${left}`}
                    className="absolute top-1/2 h-1.5 w-px -translate-y-1/2 bg-white/[0.14]"
                    style={{ left }}
                  />
                ))}
                <motion.div
                  style={{ scaleX: detailScale, backgroundColor: withAlpha(accent, '70') }}
                  className="absolute inset-y-1/2 left-0 h-px w-full -translate-y-1/2 origin-left"
                />
                <motion.div
                  style={{ scale: detailScale, backgroundColor: accent, left: config.railStop }}
                  className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2"
                />
              </div>
            </div>

            <span className="text-[8px] font-mono tracking-[0.16em] text-white/46 md:text-[9px]">
              {config.purpose}
            </span>

            <div className="ml-auto flex items-center gap-1">
              <motion.span
                style={{ scaleX: detailScale, borderColor: withAlpha(accent, '66') }}
                className="block h-2 w-3 origin-right border"
              />
              <motion.span
                style={{ scaleX: detailScale, borderColor: withAlpha(accent, '88'), backgroundColor: withAlpha(accent, '16') }}
                className="block h-2 w-6 origin-right border"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StaticPanel({ config }: { config: FormatConfig }) {
  return (
    <DeliveryDock
      config={config}
      frameX={0}
      frameY={0}
      frameScale={1}
      routeScale={1}
      guideScaleX={1}
      guideScaleY={1}
      detailScale={1}
    />
  );
}

function AnimatedPanel({
  progress,
  config,
}: {
  progress: MotionValue<number>;
  config: FormatConfig;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [enterStart, enterEnd] = config.enterRange;
  const [detailStart, detailEnd] = config.detailRange;

  const panelY = useTransform(progress, [enterStart, enterEnd], [30, 0]);
  const panelScale = useTransform(progress, [enterStart, enterEnd], [0.97, 1]);

  const frameX = useTransform(
    progress,
    [enterStart, enterEnd],
    [config.route === 'left' ? -88 : config.route === 'right' ? 88 : 0, 0]
  );
  const frameY = useTransform(
    progress,
    [enterStart, enterEnd],
    [config.route === 'bottom' ? 96 : 0, 0]
  );
  const frameScale = useTransform(progress, [enterStart, enterEnd], [0.92, 1]);
  const routeScale = useTransform(progress, [enterStart, detailStart], [0, 1]);
  const guideScaleX = useTransform(progress, [detailStart, detailEnd], [0, 1]);
  const guideScaleY = useTransform(progress, [detailStart, detailEnd], [0, 1]);
  const detailScale = useTransform(progress, [detailStart, detailEnd], [0.55, 1]);

  useDomOpacityKeyframes(ref, progress, [enterStart - 0.05, enterStart + 0.03, 0.92, 1.0], [0, 1, 1, 0.62]);

  return (
    <motion.div ref={ref} style={{ opacity: 0, y: panelY, scale: panelScale }} className="relative h-full">
      <DeliveryDock
        config={config}
        frameX={frameX}
        frameY={frameY}
        frameScale={frameScale}
        routeScale={routeScale}
        guideScaleX={guideScaleX}
        guideScaleY={guideScaleY}
        detailScale={detailScale}
      />
    </motion.div>
  );
}

function StageGrid() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-55"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
          `,
          backgroundSize: '4.8rem 4.8rem, 4.8rem 4.8rem',
          backgroundPosition: 'center, center',
        }}
      />

      <div className="pointer-events-none absolute inset-[2%] border border-white/[0.04]" />
      <div className="pointer-events-none absolute inset-[5%] border border-white/[0.05]" />
      <div className="pointer-events-none absolute inset-x-[7%] top-[14%] h-px bg-white/[0.05]" />
      <div className="pointer-events-none absolute inset-x-[7%] bottom-[14%] h-px bg-white/[0.05]" />
      <div className="pointer-events-none absolute inset-y-[8%] left-1/2 w-px -translate-x-1/2 bg-white/[0.05] hidden min-[760px]:block xl:hidden" />
      <div className="pointer-events-none absolute inset-y-[8%] left-[33.333%] w-px -translate-x-1/2 bg-white/[0.05] hidden xl:block" />
      <div className="pointer-events-none absolute inset-y-[8%] left-[66.666%] w-px -translate-x-1/2 bg-white/[0.05] hidden xl:block" />

      <RegistrationCross className="left-[5%] top-[5%] -translate-x-1/2 -translate-y-1/2" />
      <RegistrationCross className="right-[5%] top-[5%] translate-x-1/2 -translate-y-1/2" />
      <RegistrationCross className="left-[5%] bottom-[5%] -translate-x-1/2 translate-y-1/2" />
      <RegistrationCross className="right-[5%] bottom-[5%] translate-x-1/2 translate-y-1/2" />
    </>
  );
}

export default function Chapter05_MakeItWork() {
  const containerRef = useRef<HTMLDivElement>(null);
  useChapterCursor(containerRef, 'crosshair');
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const reachedRef = useRef(false);
  const completedRef = useRef(false);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v > 0.05 && !reachedRef.current) {
      reachedRef.current = true;
      trackEvent('chapter_reached', { chapter: 5 });
    }
    if (v > 0.95 && !completedRef.current) {
      completedRef.current = true;
      trackEvent('chapter_completed', { chapter: 5 });
    }
  });

  const stepY = useTransform(scrollYProgress, [0.00, 0.12], [20, 0]);
  const headlineY = useTransform(scrollYProgress, [0.05, 0.15], [20, 0]);
  const bodyY = useTransform(scrollYProgress, [0.82, 0.94], [18, 0]);

  const stepRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  useDomOpacity(stepRef, scrollYProgress, [0.00, 0.10]);
  useDomOpacity(headlineRef, scrollYProgress, [0.05, 0.15]);
  useDomOpacity(bodyRef, scrollYProgress, [0.82, 0.94]);

  if (reduce) {
    return (
      <div ref={containerRef}>
        <Chapter id="05-make-it-work" pinned height="380vh">
          <div className="absolute inset-0 flex flex-col gap-6 overflow-auto bg-black px-8 py-14">
            <div className="space-y-2">
              <span className="block font-display text-6xl font-bold leading-none text-white/15">05</span>
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">Make It Work</p>
              <h2 className="font-display text-3xl font-bold text-white">
                Built for the platforms it actually has to live on.
              </h2>
            </div>

            <div className="relative min-h-[34rem] w-full overflow-hidden border border-white/10">
              <StageGrid />
              <div className="relative z-10 grid h-full grid-cols-1 gap-4 px-4 py-4 min-[760px]:grid-cols-2 md:gap-6 md:px-6 md:py-6 xl:grid-cols-3 xl:gap-8 xl:px-8 xl:py-8">
                {FORMATS.map((config) => (
                  <StaticPanel key={config.id} config={config} />
                ))}
              </div>
            </div>

            <p className="max-w-lg text-base leading-relaxed text-white/60">
              We deliver in the formats your channels use, and we stay close enough to keep the work growing after it ships.
            </p>
          </div>
        </Chapter>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <Chapter id="05-make-it-work" pinned height="400vh">
        <div className="absolute inset-0 flex flex-col gap-4 overflow-hidden bg-black px-8 py-10 pt-16 md:px-12">
          <div className="relative z-30 flex flex-wrap items-baseline gap-x-5 gap-y-1 shrink-0">
            <motion.div ref={stepRef} style={{ opacity: 0, y: stepY }} className="flex items-baseline gap-4">
              <span className="font-display text-5xl font-bold leading-none text-white/15 md:text-7xl">05</span>
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">Make It Work</p>
            </motion.div>
            <motion.h2
              ref={headlineRef}
              style={{ opacity: 0, y: headlineY }}
              className="max-w-2xl font-display text-xl font-bold leading-tight text-white md:text-3xl"
            >
              Built for the platforms it actually has to live on.
            </motion.h2>
          </div>

          <div className="relative z-10 flex-1 min-h-0 overflow-hidden border border-white/10">
            <StageGrid />
            <div className="relative z-10 grid h-full grid-cols-1 gap-4 px-4 py-4 min-[760px]:grid-cols-2 md:gap-6 md:px-6 md:py-6 xl:grid-cols-3 xl:gap-8 xl:px-8 xl:py-8">
              {FORMATS.map((config) => (
                <AnimatedPanel key={config.id} progress={scrollYProgress} config={config} />
              ))}
            </div>
          </div>

          <motion.p
            ref={bodyRef}
            style={{ opacity: 0, y: bodyY }}
            className="z-30 max-w-lg shrink-0 pb-6 text-sm leading-relaxed text-white/60 md:text-base"
          >
            We deliver in the formats your channels use, and we stay close enough to keep the work growing after it ships.
          </motion.p>
        </div>
      </Chapter>
    </div>
  );
}
