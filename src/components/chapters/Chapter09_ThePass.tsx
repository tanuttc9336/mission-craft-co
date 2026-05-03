import { useRef, useState, type FormEvent } from 'react';
import { motion, useReducedMotion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useChapterCursor } from '@/contexts/CursorContext';
import { Link, useNavigate } from 'react-router-dom';
import { RevealText } from '@/components/scroll/RevealText';
import { trackEvent } from '@/lib/analytics';
import MagneticHover from '@/components/chrome/MagneticHover';

// ── Locked copy ─────────────────────────────────────────────────────────────
const TAGLINE = 'Content with direction. Production with taste.';

// ── Field-level error map ────────────────────────────────────────────────────
type FieldErrors = Partial<Record<'name' | 'email' | 'brief', string>>;

function validate(name: string, email: string, brief: string): FieldErrors {
  const errs: FieldErrors = {};
  if (!name) errs.name = 'Name missing';
  if (!email) errs.email = 'Email missing';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errs.email = 'Invalid email';
  if (!brief) errs.brief = 'Project missing';
  return errs;
}

// ── Main export ──────────────────────────────────────────────────────────────
export default function Chapter09_ThePass() {
  const sectionRef = useRef<HTMLElement>(null);
  useChapterCursor(sectionRef, 'typing');
  const navigate = useNavigate();

  const [errors, setErrors] = useState<FieldErrors>({});
  const reduce = useReducedMotion();

  // Analytics refs
  const reachedRef = useRef(false);
  const completedRef = useRef(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v > 0.05 && !reachedRef.current) {
      reachedRef.current = true;
      trackEvent('chapter_reached', { chapter: '09-the-pass' });
    }
    if (v >= 0.9 && !completedRef.current) {
      completedRef.current = true;
      trackEvent('chapter_completed', { chapter: '09-the-pass' });
    }
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = ((fd.get('name') as string) ?? '').trim();
    const email = ((fd.get('email') as string) ?? '').trim();
    const brief = ((fd.get('brief') as string) ?? '').trim();

    const errs = validate(name, email, brief);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    console.log('[ch09] narrative form submit', { name, email, brief });
    // TODO: Track submission, save context if needed
    
    // Programmatic routing to the briefing room
    navigate('/briefing-room');
  };

  const formContent = (
    <form onSubmit={handleSubmit} noValidate className="relative mt-24">
      {/* Missing field errors (Absolute top) */}
      {Object.keys(errors).length > 0 && (
        <div className="absolute -top-10 left-0 text-[10px] font-mono tracking-widest uppercase text-red-400">
          * Please complete all fields to proceed.
        </div>
      )}

      {/* Narrative Mad-Libs Form */}
      <div className="font-body font-light text-xl sm:text-3xl md:text-4xl leading-[2.2] sm:leading-[2.2] text-white/40 max-w-4xl">
        Hey Undercat. I'm
        <input 
          name="name"
          type="text"
          autoComplete="name"
          className="bg-transparent border-b border-white/20 focus:border-white text-white px-2 mx-2 md:mx-4 w-[6em] sm:w-[8em] focus:outline-none placeholder:text-white/10 transition-colors text-center" 
          placeholder="[ Name ]" 
          aria-invalid={!!errors.name}
        />
        . My brand is tired of playing it safe, and we want to make something wild. Hit me up at
        <input 
          name="email"
          type="email"
          autoComplete="email"
          className="bg-transparent border-b border-white/20 focus:border-white text-white px-2 mx-2 md:mx-4 w-[8em] sm:w-[10em] focus:outline-none placeholder:text-white/10 transition-colors text-center" 
          placeholder="[ Email ]" 
          aria-invalid={!!errors.email}
        />
        so we can scheme about a killer
        <input 
          name="brief"
          type="text"
          className="bg-transparent border-b border-white/20 focus:border-white text-white px-2 mx-2 md:mx-4 w-[8em] sm:w-[10em] md:w-[12em] focus:outline-none placeholder:text-white/10 transition-colors text-center" 
          placeholder="[ Project ]" 
          aria-invalid={!!errors.brief}
        />
        .
      </div>

      <div className="mt-20 md:mt-32 flex justify-start">
        <MagneticHover pullFactor={0.15}>
          <button
            type="submit"
            className="font-mono text-xs md:text-sm uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors pb-1 border-b border-transparent hover:border-white/50 focus:outline-none focus:text-white group flex items-center gap-4"
          >
            [ ENTER THE BRIEFING ROOM ]
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
          </button>
        </MagneticHover>
      </div>
    </form>
  );

  return (
    <section
      ref={sectionRef}
      id="09-the-pass"
      data-chapter="09-the-pass"
      className="bg-black text-white relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Terminal Cursor Rain — soft snow of typing prompts */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 25 }).map((_, i) => {
          const left = `${3 + (i * 37 + i * i * 7) % 94}%`;
          const dur = 10 + (i % 7) * 2;
          const delay = (i * 1.3) % 6;
          const opacity = 0.03 + (i % 5) * 0.012;
          return (
            <motion.span
              key={i}
              className="absolute text-white font-mono text-[10px] select-none"
              style={{ left, opacity }}
              animate={{ y: ['-5vh', '110vh'] }}
              transition={{
                duration: dur,
                delay,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              _
            </motion.span>
          );
        })}
      </div>

      <div className="px-8 md:px-16 py-32 max-w-5xl mx-auto w-full space-y-8 relative z-10">
        
        {reduce ? (
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
            {TAGLINE}
          </h2>
        ) : (
          <RevealText
            as="h2"
            start={0}
            end={0.35}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
          >
            {TAGLINE}
          </RevealText>
        )}

        {reduce ? (
          formContent
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            viewport={{ once: true, amount: 0.15 }}
          >
            {formContent}
          </motion.div>
        )}

        {/* Footer Connections */}
        <motion.div
          initial={!reduce ? { opacity: 0 } : undefined}
          whileInView={!reduce ? { opacity: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true, amount: 0.5 }}
          className="pt-32"
        >
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <p className="text-[10px] font-mono text-white/20 tracking-[0.2em] uppercase">
              &copy; Undercat Creatives 2026
            </p>
            
            <nav aria-label="System Tools" className="flex flex-wrap gap-6 text-[10px] sm:text-xs font-mono tracking-widest uppercase text-white/30">
              <Link to="/blueprint" className="hover:text-white transition-colors">
                Blueprint
              </Link>
              <Link to="/lens" className="hover:text-white transition-colors">
                Lens
              </Link>
            </nav>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
