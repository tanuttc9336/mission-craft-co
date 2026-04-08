import { useEffect, useRef } from 'react';
import { useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'framer-motion';

interface ScrollSequenceProps {
  frames: string[];
  containerHeight?: string;
  posterSrc?: string;
  className?: string;
}

export function ScrollSequence({ frames, containerHeight = '500vh', posterSrc, className = '' }: ScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, frames.length - 1]);

  const drawAt = (idx: number) => {
    const canvas = canvasRef.current;
    const clamped = Math.max(0, Math.min(frames.length - 1, idx));
    const img = imagesRef.current[clamped];
    if (!canvas || !img || !img.naturalWidth) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (canvas.width !== img.naturalWidth) canvas.width = img.naturalWidth;
    if (canvas.height !== img.naturalHeight) canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
  };

  // Preload all frames and paint as soon as the relevant one is ready.
  // No `loaded` state — each image draws itself when it arrives, and the
  // current scroll-position frame is repainted whenever a new image lands.
  useEffect(() => {
    if (reduce) return;
    const imgs: HTMLImageElement[] = frames.map((src, i) => {
      const img = new Image();
      img.onload = () => {
        // If this image is the current scroll-position frame, paint it.
        const cur = Math.round(frameIndex.get());
        if (cur === i) drawAt(i);
        // Always try painting current frame in case it was already loaded.
        drawAt(cur);
      };
      img.src = src;
      return img;
    });
    imagesRef.current = imgs;
    // Also try a paint on next tick in case images were cached and complete.
    const t = setTimeout(() => drawAt(Math.round(frameIndex.get())), 0);
    return () => {
      clearTimeout(t);
      imgs.forEach((img) => { img.onload = null; });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frames, reduce]);

  useMotionValueEvent(frameIndex, 'change', (v) => {
    if (reduce) return;
    drawAt(Math.round(v));
  });

  if (reduce && posterSrc) {
    return (
      <div ref={containerRef} style={{ height: containerHeight }} className={`relative w-full ${className}`}>
        <div className="sticky top-0 h-screen w-full flex items-center justify-center">
          <img src={posterSrc} alt="" className="w-full h-full object-cover" />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ height: containerHeight }} className={`relative w-full ${className}`}>
      <div className="sticky top-0 h-screen w-full flex items-center justify-center bg-black">
        <canvas ref={canvasRef} className="w-full h-full object-contain" />
      </div>
    </div>
  );
}
