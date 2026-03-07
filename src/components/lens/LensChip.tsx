import { motion } from 'framer-motion';

interface LensChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function LensChip({ label, active, onClick, disabled }: LensChipProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2.5 text-xs font-medium tracking-wider uppercase border transition-all duration-200 ${
        active
          ? 'bg-foreground text-background border-foreground'
          : 'bg-background text-foreground border-border hover:border-foreground'
      } ${disabled && !active ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {label}
    </motion.button>
  );
}
