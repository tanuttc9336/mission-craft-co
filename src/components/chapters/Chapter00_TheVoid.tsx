import { motion, useReducedMotion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { useChapterCursor } from '@/contexts/CursorContext';
import { Chapter } from '@/components/scroll/Chapter';
import { useDomOpacity } from '@/lib/use-dom-opacity';

interface CatProjectionDef {
  width: number;
  depth: number;
  startX: number;
  endX: number;
  startScale: number;
  endScale: number;
  startY: number;
  endY: number;
  finalOpacity: number;
  strokeWidth: number;
  faceOpacity: number;
  whiskerOpacity: number;
  color: string;
  blur: number;
  glow: number;
}

type ProjectionAnchorKey = 'leftEar' | 'leftCheek' | 'nose' | 'rightCheek' | 'rightEar' | 'chin';

const CAT_PROJECTIONS: CatProjectionDef[] = [
  { width: 440, depth: 144, startX: -124, endX: -84, startScale: 1.26, endScale: 1.04, startY: -128, endY: -72, finalOpacity: 0.18, strokeWidth: 0.94, faceOpacity: 0.05, whiskerOpacity: 0.12, color: '#f5c56c', blur: 3.2, glow: 0.34 },
  { width: 380, depth: 124, startX: -66, endX: -40, startScale: 1.18, endScale: 1.02, startY: -84, endY: -38, finalOpacity: 0.22, strokeWidth: 1.04, faceOpacity: 0.06, whiskerOpacity: 0.15, color: '#ff9b8b', blur: 2.4, glow: 0.28 },
  { width: 306, depth: 96, startX: 0, endX: 0, startScale: 1.10, endScale: 1, startY: -26, endY: -4, finalOpacity: 0.38, strokeWidth: 1.22, faceOpacity: 0.11, whiskerOpacity: 0.24, color: '#ffffff', blur: 0, glow: 0.18 },
  { width: 240, depth: 74, startX: 72, endX: 42, startScale: 1.00, endScale: 0.98, startY: 28, endY: 22, finalOpacity: 0.22, strokeWidth: 0.98, faceOpacity: 0.07, whiskerOpacity: 0.16, color: '#87d9ff', blur: 2.0, glow: 0.24 },
  { width: 186, depth: 58, startX: 126, endX: 78, startScale: 0.94, endScale: 0.94, startY: 72, endY: 46, finalOpacity: 0.17, strokeWidth: 0.92, faceOpacity: 0.06, whiskerOpacity: 0.13, color: '#a6e4c6', blur: 2.8, glow: 0.22 },
];

const PROJECTION_MESH_ANCHORS: ProjectionAnchorKey[] = ['leftEar', 'leftCheek', 'nose', 'rightCheek', 'rightEar', 'chin'];

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const full = normalized.length === 3
    ? normalized.split('').map((char) => char + char).join('')
    : normalized;
  const value = Number.parseInt(full, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getProjectionAnchorPoint(def: CatProjectionDef, anchor: ProjectionAnchorKey) {
  const width = def.width;
  const height = width * 0.8;

  switch (anchor) {
    case 'leftEar':
      return { x: -width * 0.18, y: -height * 0.40 };
    case 'leftCheek':
      return { x: -width * 0.28, y: height * 0.06 };
    case 'nose':
      return { x: 0, y: height * 0.08 };
    case 'rightCheek':
      return { x: width * 0.28, y: height * 0.06 };
    case 'rightEar':
      return { x: width * 0.18, y: -height * 0.40 };
    case 'chin':
      return { x: 0, y: height * 0.42 };
  }
}

function getProjectionStagePoint(def: CatProjectionDef, anchor: ProjectionAnchorKey, phase: 'start' | 'end') {
  const point = getProjectionAnchorPoint(def, anchor);
  const scale = phase === 'start' ? def.startScale : def.endScale;
  const x = phase === 'start' ? def.startX : def.endX;
  const y = phase === 'start' ? def.startY : def.endY;

  return {
    x: x + point.x * scale,
    y: y + point.y * scale,
  };
}

function CatProjectionGlyph({ def }: { def: CatProjectionDef }) {
  const w = def.width;
  const h = w * 0.8;
  const dx = def.depth;
  const dy = def.depth * 0.58;
  const sidePad = w * 0.34;
  const topPad = def.strokeWidth;
  const ox = sidePad;
  const oy = topPad / 2;

  const front = [
    [ox + 0, oy + h],
    [ox + 0, oy + h * 0.3],
    [ox + w * 0.22, oy + h * 0.3],
    [ox + w * 0.32, oy + 0],
    [ox + w * 0.5, oy + h * 0.17],
    [ox + w * 0.68, oy + 0],
    [ox + w * 0.78, oy + h * 0.3],
    [ox + w, oy + h * 0.3],
    [ox + w, oy + h],
  ];
  const back = front.map(([x, y]) => [x + dx, y + dy]);

  const toPoints = (points: number[][]) => points.map(([x, y]) => `${x},${y}`).join(' ');

  const topFace = [back[2], back[3], back[4], back[5], back[6], front[6], front[5], front[4], front[3], front[2]];
  const leftFace = [back[0], back[1], back[2], front[2], front[1], front[0]];
  const rightFace = [back[6], back[7], back[8], front[8], front[7], front[6]];

  const connectorIndexes = [0, 2, 3, 4, 5, 6, 8];
  const whiskers = [
    { x1: ox + w * 0.16, y1: oy + h * 0.54, x2: ox - sidePad * 0.52, y2: oy + h * 0.5 },
    { x1: ox + w * 0.14, y1: oy + h * 0.64, x2: ox - sidePad * 0.68, y2: oy + h * 0.64 },
    { x1: ox + w * 0.16, y1: oy + h * 0.74, x2: ox - sidePad * 0.52, y2: oy + h * 0.78 },
    { x1: ox + w * 0.84, y1: oy + h * 0.54, x2: ox + w + sidePad * 0.52, y2: oy + h * 0.5 },
    { x1: ox + w * 0.86, y1: oy + h * 0.64, x2: ox + w + sidePad * 0.68, y2: oy + h * 0.64 },
    { x1: ox + w * 0.84, y1: oy + h * 0.74, x2: ox + w + sidePad * 0.52, y2: oy + h * 0.78 },
  ];

  const nose = [
    [ox + w * 0.5, oy + h * 0.48],
    [ox + w * 0.55, oy + h * 0.56],
    [ox + w * 0.5, oy + h * 0.64],
    [ox + w * 0.45, oy + h * 0.56],
  ];

  return (
    <svg
      width={w + dx + sidePad * 2}
      height={h + dy + topPad}
      viewBox={`0 0 ${w + dx + sidePad * 2} ${h + dy + topPad}`}
      style={{ display: 'block', transform: 'translate(-50%, -50%)' }}
    >
      <polygon points={toPoints(topFace)} fill={def.color} fillOpacity={def.faceOpacity * 0.9} />
      <polygon points={toPoints(leftFace)} fill={def.color} fillOpacity={def.faceOpacity * 0.5} />
      <polygon points={toPoints(rightFace)} fill={def.color} fillOpacity={def.faceOpacity * 0.5} />
      <polygon points={toPoints(front)} fill={def.color} fillOpacity={def.faceOpacity * 0.25} />

      {whiskers.map((line, index) => (
        <line
          key={index}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke={def.color}
          strokeWidth={def.strokeWidth * 0.92}
          strokeOpacity={def.whiskerOpacity}
          strokeLinecap="round"
        />
      ))}

      <polygon points={toPoints(back)} fill="none" stroke={def.color} strokeWidth={def.strokeWidth} strokeOpacity="0.42" strokeLinejoin="round" />
      <polygon points={toPoints(front)} fill="none" stroke={def.color} strokeWidth={def.strokeWidth} strokeOpacity="0.88" strokeLinejoin="round" />
      {connectorIndexes.map((index) => (
        <line
          key={index}
          x1={back[index][0]}
          y1={back[index][1]}
          x2={front[index][0]}
          y2={front[index][1]}
          stroke={def.color}
          strokeWidth={def.strokeWidth}
          strokeOpacity="0.55"
          strokeLinecap="round"
        />
      ))}

      <polygon points={toPoints(nose)} fill={def.color} fillOpacity={def.faceOpacity * 2.3} />
    </svg>
  );
}

function CatProjection({ def, progress }: { def: CatProjectionDef; progress: MotionValue<number> }) {
  const opacity = useTransform(
    progress,
    [0.00, 0.08, 0.18, 0.34, 0.50],
    [0.04, def.finalOpacity * 0.58, def.finalOpacity, def.finalOpacity * 0.62, 0]
  );
  const x = useTransform(progress, [0.00, 0.34], [def.startX, def.endX]);
  const scale = useTransform(progress, [0.00, 0.18, 0.40], [def.startScale, def.endScale, def.endScale * 0.985]);
  const y = useTransform(progress, [0.00, 0.34], [def.startY, def.endY]);

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 pointer-events-none mix-blend-screen"
      style={{
        x,
        y,
        opacity,
        scale,
        filter: `blur(${def.blur}px) drop-shadow(0 0 40px ${hexToRgba(def.color, def.glow)})`,
      }}
    >
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 blur-3xl"
        style={{
          width: def.width * 1.34,
          height: def.width * 0.98,
          background: `radial-gradient(circle, ${hexToRgba(def.color, def.glow)} 0%, ${hexToRgba(def.color, def.glow * 0.58)} 34%, transparent 74%)`,
        }}
      />
      <CatProjectionGlyph def={def} />
    </motion.div>
  );
}

function ProjectionMeshLink({
  fromDef,
  toDef,
  anchor,
  progress,
}: {
  fromDef: CatProjectionDef;
  toDef: CatProjectionDef;
  anchor: ProjectionAnchorKey;
  progress: MotionValue<number>;
}) {
  const fromStart = getProjectionStagePoint(fromDef, anchor, 'start');
  const fromEnd = getProjectionStagePoint(fromDef, anchor, 'end');
  const toStart = getProjectionStagePoint(toDef, anchor, 'start');
  const toEnd = getProjectionStagePoint(toDef, anchor, 'end');

  const x1 = useTransform(progress, [0.00, 0.34], [fromStart.x, fromEnd.x]);
  const y1 = useTransform(progress, [0.00, 0.34], [fromStart.y, fromEnd.y]);
  const x2 = useTransform(progress, [0.00, 0.34], [toStart.x, toEnd.x]);
  const y2 = useTransform(progress, [0.00, 0.34], [toStart.y, toEnd.y]);
  const opacity = useTransform(progress, [0.00, 0.08, 0.18, 0.36, 0.52], [0, 0.16, 0.40, 0.18, 0]);

  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={hexToRgba(toDef.color, 0.62)}
      strokeWidth={(fromDef.strokeWidth + toDef.strokeWidth) * 0.52}
      strokeLinecap="round"
      strokeDasharray={anchor === 'nose' || anchor === 'chin' ? undefined : '4 10'}
      style={{
        opacity,
        filter: `drop-shadow(0 0 14px ${hexToRgba(toDef.color, Math.max(toDef.glow * 0.7, 0.1))})`,
      }}
    />
  );
}

function ProjectionMesh({ progress }: { progress: MotionValue<number> }) {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 h-[68rem] w-[68rem] -translate-x-1/2 -translate-y-1/2 mix-blend-screen overflow-visible"
      viewBox="-540 -540 1080 1080"
    >
      {CAT_PROJECTIONS.slice(0, -1).map((def, index) => {
        const next = CAT_PROJECTIONS[index + 1];

        return PROJECTION_MESH_ANCHORS.map((anchor) => (
          <ProjectionMeshLink
            key={`${index}-${anchor}`}
            fromDef={def}
            toDef={next}
            anchor={anchor}
            progress={progress}
          />
        ));
      })}
    </svg>
  );
}

function ProjectionMeshStatic() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 h-[68rem] w-[68rem] -translate-x-1/2 -translate-y-1/2 mix-blend-screen overflow-visible"
      viewBox="-540 -540 1080 1080"
    >
      {CAT_PROJECTIONS.slice(0, -1).map((def, index) => {
        const next = CAT_PROJECTIONS[index + 1];

        return PROJECTION_MESH_ANCHORS.map((anchor) => {
          const start = getProjectionStagePoint(def, anchor, 'end');
          const end = getProjectionStagePoint(next, anchor, 'end');

          return (
            <line
              key={`${index}-${anchor}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={hexToRgba(next.color, 0.62)}
              strokeWidth={(def.strokeWidth + next.strokeWidth) * 0.52}
              strokeLinecap="round"
              strokeDasharray={anchor === 'nose' || anchor === 'chin' ? undefined : '4 10'}
              style={{
                opacity: 0.24,
                filter: `drop-shadow(0 0 14px ${hexToRgba(next.color, Math.max(next.glow * 0.7, 0.1))})`,
              }}
            />
          );
        });
      })}
    </svg>
  );
}

export default function Chapter00_TheVoid() {
  const containerRef = useRef<HTMLDivElement>(null);
  useChapterCursor(containerRef, 'spark');
  const reduce       = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const pulseOpacity = useTransform(scrollYProgress, [0.00, 0.08, 0.40, 1.00], [0.02, 0.08, 0.24, 0.10]);
  const pulseScale = useTransform(scrollYProgress, [0.00, 0.45, 1.00], [0.88, 0.98, 1.08]);
  const pulseY = useTransform(scrollYProgress, [0.00, 0.16], [-18, -6]);
  const wordmarkY = useTransform(scrollYProgress, [0.10, 0.22], [18, 0]);
  const tagline1Y = useTransform(scrollYProgress, [0.12, 0.24], [16, 0]);
  const tagline2Y = useTransform(scrollYProgress, [0.14, 0.26], [18, 0]);
  const glowOpacity = useTransform(scrollYProgress, [0.10, 0.24, 0.85, 1.00], [0, 0.24, 0.10, 0.06]);
  const glowScale = useTransform(scrollYProgress, [0.00, 0.40, 1.00], [0.88, 0.98, 1.08]);
  const contentRef = useRef<HTMLDivElement>(null);
  useDomOpacity(contentRef, scrollYProgress, [0.10, 0.22]);

  if (reduce) {
    return (
      <div ref={containerRef}>
        <Chapter id="00-the-void" pinned height="400vh">
          <div className="absolute inset-0 bg-black flex flex-col items-center justify-center text-center px-6 pt-14 pb-8 md:px-8 md:pt-20 md:pb-12">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <ProjectionMeshStatic />
              {CAT_PROJECTIONS.map((def, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 pointer-events-none mix-blend-screen"
                  style={{
                    opacity: Math.min(def.finalOpacity * 1.8, 0.64),
                    transform: `translate(calc(-50% + ${def.endX}px), calc(-50% + ${def.endY}px)) scale(${def.endScale})`,
                    filter: `blur(${def.blur}px) drop-shadow(0 0 40px ${hexToRgba(def.color, def.glow)})`,
                  }}
                >
                  <div
                    aria-hidden
                    className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 blur-3xl"
                    style={{
                      width: def.width * 1.34,
                      height: def.width * 0.98,
                      background: `radial-gradient(circle, ${hexToRgba(def.color, def.glow)} 0%, ${hexToRgba(def.color, def.glow * 0.58)} 34%, transparent 74%)`,
                    }}
                  />
                  <CatProjectionGlyph def={{ ...def, startScale: def.endScale, endScale: def.endScale, startY: def.endY, endY: def.endY }} />
                </div>
              ))}
            </div>
            <div className="relative overflow-visible pt-[0.08em]">
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 h-[7rem] w-[12rem] -translate-x-1/2 -translate-y-1/2 blur-3xl md:h-[9rem] md:w-[18rem]"
                style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.07) 36%, transparent 72%)' }}
              />
              <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tight leading-[1.06] text-white">
                UNDERCAT
              </h1>
            </div>
            <p className="mt-6 text-base md:text-lg text-white/70 tracking-wide">Content with direction.</p>
            <p className="mt-2 text-base md:text-lg text-white/70 tracking-wide">Production with taste.</p>
          </div>
        </Chapter>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <Chapter id="00-the-void" pinned height="400vh">
        {/* Black background */}
        <div className="absolute inset-0 bg-black" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at center, transparent 0%, transparent 24%, rgba(0,0,0,0.36) 58%, rgba(0,0,0,0.82) 100%)',
          }}
        />

        {/* Breathing Pulse — heartbeat in the void */}
        <motion.div
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
          style={{ opacity: pulseOpacity, scale: pulseScale, y: pulseY }}
        >
          <motion.div
            className="h-[34vw] w-[34vw] max-h-[420px] max-w-[420px] rounded-full"
            animate={{ scale: [0.82, 1.18, 0.82] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 34%, transparent 66%)' }}
          />
        </motion.div>

        {/* Noise grain overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
          }}
        />

        <ProjectionMesh progress={scrollYProgress} />

        {/* Cat projections */}
        {CAT_PROJECTIONS.map((def, i) => (
          <CatProjection key={i} def={def} progress={scrollYProgress} />
        ))}

        {/* Wordmark + taglines */}
        <motion.div
          ref={contentRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pt-14 pb-8 pointer-events-none md:px-8 md:pt-20 md:pb-12"
          initial={false}
          style={{ opacity: 0, y: wordmarkY }}
        >
          <div className="relative overflow-visible pt-[0.08em]">
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[7rem] w-[12rem] -translate-x-1/2 -translate-y-1/2 blur-3xl md:h-[9rem] md:w-[18rem]"
              style={{
                opacity: glowOpacity,
                scale: glowScale,
                background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.07) 36%, transparent 72%)',
              }}
            />
            <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tight leading-[1.06] text-white">
              UNDERCAT
            </h1>
          </div>
          <motion.p
            className="mt-6 text-base md:text-lg text-white/70 tracking-wide"
            style={{ y: tagline1Y }}
          >
            Content with direction.
          </motion.p>
          <motion.p
            className="mt-2 text-base md:text-lg text-white/70 tracking-wide"
            style={{ y: tagline2Y }}
          >
            Production with taste.
          </motion.p>
        </motion.div>
      </Chapter>
    </div>
  );
}
