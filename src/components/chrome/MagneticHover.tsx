import { useRef } from 'react';
import { motion, useSpring } from 'framer-motion';

interface MagneticHoverProps {
  children: React.ReactNode;
  className?: string;
  pullFactor?: number;
}

export default function MagneticHover({ children, className = '', pullFactor = 0.3 }: MagneticHoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const getX = useSpring(0, springConfig);
  const getY = useSpring(0, springConfig);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    // Pull the element towards the pointer slightly
    getX.set(middleX * pullFactor); 
    getY.set(middleY * pullFactor);
  };

  const reset = () => {
    getX.set(0);
    getY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      data-magnetic="true"
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: getX, y: getY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
