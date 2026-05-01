import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, Variants, useVelocity, useTransform } from 'framer-motion';
import { useCursor } from '@/contexts/CursorContext';

export default function MagneticCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const { cursorVariant } = useCursor();
  
  // Start off-screen
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, textarea, [data-magnetic]')) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  // Velocity stretching logic (Ghostly Streak)
  const velX = useVelocity(smoothX);
  const velY = useVelocity(smoothY);

  const lastAngle = useRef(0);

  const finalRotate = useTransform(() => {
    if (cursorVariant !== 'spark') return 0;
    const vx = velX.get();
    const vy = velY.get();
    const speed = Math.sqrt(vx * vx + vy * vy);
    if (speed > 100) {
      lastAngle.current = Math.atan2(vy, vx) * (180 / Math.PI);
    }
    return lastAngle.current;
  });

  const finalScaleX = useTransform(() => {
    if (cursorVariant !== 'spark') return 1;
    const vx = velX.get();
    const vy = velY.get();
    const speed = Math.sqrt(vx * vx + vy * vy);
    return 1 + Math.min(speed / 500, 4); // Stretch dynamically up to 5x for the torch beam
  });

  const finalScaleY = useTransform(() => {
    if (cursorVariant !== 'spark') return 1;
    const vx = velX.get();
    const vy = velY.get();
    const speed = Math.sqrt(vx * vx + vy * vy);
    return Math.max(0.2, 1 - (speed / 1000)); // Squeeze torch narrower when fast
  });

  const variants: Variants = {
    default: {
      width: 16,
      height: 16,
      borderRadius: '50%',
      backgroundColor: '#ffffff',
      border: '0px solid transparent',
      clipPath: 'none',
      marginTop: 0,
      opacity: 1,
    },
    spark: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: '#ffffff',
      border: '0px solid transparent',
      boxShadow: '0px 0px 12px 4px rgba(255,255,255,0.3)',
      clipPath: 'none',
      marginTop: 0,
      opacity: 1,
    },
    ring: {
      width: 64,
      height: 64,
      borderRadius: '50%',
      backgroundColor: 'transparent',
      border: '1px solid white',
      clipPath: 'none',
      marginTop: 0,
      opacity: 1,
    },
    crosshair: {
      width: 32,
      height: 32,
      borderRadius: '0%',
      backgroundColor: '#ffffff',
      border: '0px solid transparent',
      clipPath: 'polygon(45% 0%, 55% 0%, 55% 45%, 100% 45%, 100% 55%, 55% 55%, 55% 100%, 45% 100%, 45% 55%, 0% 55%, 0% 45%, 45% 45%)',
      marginTop: 0,
      opacity: 1,
    },
    square: {
      width: 24,
      height: 24,
      borderRadius: '0%',
      backgroundColor: '#ffffff',
      border: '0px solid transparent',
      clipPath: 'none',
      marginTop: 0,
      opacity: 1,
    },
    line: {
      width: 2,
      height: 48,
      borderRadius: '0%',
      backgroundColor: '#ffffff',
      border: '0px solid transparent',
      clipPath: 'none',
      marginTop: 0,
      opacity: 1,
    },
    velocity: {
      width: 48,
      height: 2,
      borderRadius: '0%',
      backgroundColor: '#ffffff',
      border: '0px solid transparent',
      clipPath: 'none',
      marginTop: 0,
      opacity: 1,
    },
    typing: {
      width: 24,
      height: 2,
      borderRadius: '0%',
      backgroundColor: '#ffffff',
      border: '0px solid transparent',
      clipPath: 'none',
      marginTop: 32, // Offset lower below the pointer
      opacity: [1, 0, 1], // internal blink handles via transition
      transition: {
        opacity: { repeat: Infinity, duration: 1.2, ease: 'linear' },
        default: { type: 'spring', stiffness: 150, damping: 15, mass: 0.2 }
      }
    },
    hover: {
      width: 72,
      height: 72,
      borderRadius: '50%',
      backgroundColor: '#ffffff',
      border: '0px solid transparent',
      clipPath: 'none',
      marginTop: 0,
      opacity: 1,
    }
  };

  const currentVariant = isHovered ? 'hover' : cursorVariant;

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999] mix-blend-difference hidden md:flex items-center justify-center origin-center"
      style={{
        left: smoothX,
        top: smoothY,
        x: '-50%',
        y: '-50%',
        rotate: finalRotate,
        scaleX: finalScaleX,
        scaleY: finalScaleY,
      }}
      initial="default"
      animate={currentVariant}
      variants={variants}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
        mass: 0.2
      }}
    />
  );
}
