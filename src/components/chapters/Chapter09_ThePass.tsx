import { useRef, useState, useEffect, type FormEvent } from 'react';
import { motion, useReducedMotion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RevealText } from '@/components/scroll/RevealText';
import { asset } from '@/lib/asset-urls';
import { trackEvent } from '@/lib/analytics';

// ── Locked copy — do not paraphrase ─────────────────────────────────────────
const TAGLINE = 'Content with direction. Production with taste.';
const CLOSING_LINE =
  'If you have a brand that needs to say something the right way, send us the pass.';

// TODO: replace placeholder once chapter-09/pass-closing-still.jpg is uploaded
const CLOSING_STILL = asset('chapter-09/pass-closing-still.jpg');

// ── Field-level error map ────────────────────────────────────────────────────
type FieldErrors = Partial<Record<'name' | 'email' | 'brief', string>>;

function validate(name: string, email: string, brief: string): FieldErrors {
  const errs: FieldErrors = {};
  if (!name) errs.name = 'Your name is required.';
  if (!email) errs.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errs.email = 'Enter a valid email address.';
  if (!brief) errs.brief = 'Tell us what you\u2019re making.';
  return errs;
}

// ── Input row ────────────────────────────────────────────────────────────────
function Field({
  id,
  name,
  label,
  type = 'text',
  autoComplete,
  multiline,
  inputRef,
  error,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
  inputRef?: React.Ref<HTMLInputElement & HTMLTextAreaElement>;
  error?: string;
}) {
  const errorId = error ? `${id}-error` : undefined;
  const sharedClass =
    'w-full bg-transparent border-b border-white/20 py-3 text-white placeholder:text-white/15 focus:outline-none focus:border-white/60 transition-colors text-base resize-none';

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-[11px] tracking-[0.25em] uppercase text-white/40"
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          ref={inputRef as React.Ref<HTMLTextAreaElement>}
          id={id}
          name={name}
          rows={3}
          aria-invalid={!!error || undefined}
          aria-describedby={errorId}
          className={sharedClass}
        />
      ) : (
        <input
          ref={inputRef as React.Ref<HTMLInputElement>}
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          aria-invalid={!!error || undefined}
          aria-describedby={errorId}
          className={sharedClass}
        />
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-400 leading-snug">
          {error}
        </p>
      )}
    </div>
  );
}

// ── Closing still placeholder (swap for <RevealImage> once assets are live) ──
function ClosingStill({ animated }: { animated: boolean }) {
  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.05 }}
        className="relative w-full h-screen overflow-hidden"
      >
        {/* Placeholder until real asset is uploaded */}
        <div className="absolute inset-0 bg-white/[0.04] border-b border-white/5 flex items-end p-6">
          <span className="text-[10px] font-mono text-white/20 leading-none">
            {CLOSING_STILL}
          </span>
        </div>
      </motion.div>
    );
  }
  return (
    <div className="relative w-full aspect-video max-h-screen overflow-hidden bg-white/[0.04] border-b border-white/5 flex items-end p-4">
      <span className="text-[10px] font-mono text-white/20 leading-none">{CLOSING_STILL}</span>
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────────────────
export default function Chapter09_ThePass() {
  const sectionRef = useRef<HTMLElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const briefRef = useRef<HTMLTextAreaElement>(null);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const reduce = useReducedMotion();

  // Analytics refs — fire once per mount
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

  // Focus success message when form submits
  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = ((fd.get('name') as string) ?? '').trim();
    const email = ((fd.get('email') as string) ?? '').trim();
    const brief = ((fd.get('brief') as string) ?? '').trim();

    const errs = validate(name, email, brief);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      if (errs.name) nameRef.current?.focus();
      else if (errs.email) emailRef.current?.focus();
      else if (errs.brief) briefRef.current?.focus();
      return;
    }

    setErrors({});
    console.log('[ch09] form submit', { name, email, brief });
    // TODO: POST to import.meta.env.VITE_CONTACT_FORM_ENDPOINT
    setSubmitted(true);
  };

  // ── Reduced-motion fallback ─────────────────────────────────────────────
  if (reduce) {
    return (
      <section
        ref={sectionRef}
        id="09-the-pass"
        data-chapter="09-the-pass"
        className="bg-black text-white"
      >
        <ClosingStill animated={false} />

        <div className="px-8 md:px-16 py-24 max-w-4xl mx-auto space-y-16">
          {/* Tagline */}
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight">
            {TAGLINE}
          </h2>

          {/* Closing line */}
          <p className="text-white/65 text-lg md:text-2xl leading-relaxed max-w-2xl">
            {CLOSING_LINE}
          </p>

          {/* Form */}
          {submitted ? (
            <div ref={successRef} tabIndex={-1} className="py-8 focus:outline-none">
              <p className="text-white/80 text-lg leading-relaxed">
                Your pass is in. We&rsquo;ll be in touch.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-8 max-w-lg">
              <Field
                id="pass-name"
                name="name"
                label="Your name"
                autoComplete="name"
                inputRef={nameRef as React.Ref<HTMLInputElement & HTMLTextAreaElement>}
                error={errors.name}
              />
              <Field
                id="pass-email"
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
                inputRef={emailRef as React.Ref<HTMLInputElement & HTMLTextAreaElement>}
                error={errors.email}
              />
              <Field
                id="pass-brief"
                name="brief"
                label="What are you making?"
                multiline
                inputRef={briefRef as React.Ref<HTMLInputElement & HTMLTextAreaElement>}
                error={errors.brief}
              />
              <button
                type="submit"
                className="mt-2 text-white border-b border-white/30 pb-0.5 text-sm tracking-wider hover:border-white/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                Send the pass &rarr;
              </button>
            </form>
          )}

          {/* Tool links */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <p className="text-[11px] text-white/30 tracking-[0.25em] uppercase">
              Tools for teams building something now
            </p>
            <nav aria-label="Undercat tools" className="flex flex-wrap gap-6 text-sm text-white/45">
              <Link to="/briefing-room" className="hover:text-white transition-colors">
                Briefing Room
              </Link>
              <Link to="/blueprint" className="hover:text-white transition-colors">
                Blueprint
              </Link>
              <Link to="/lens" className="hover:text-white transition-colors">
                Lens
              </Link>
            </nav>
          </div>

          {/* Footer */}
          <footer className="pt-8 border-t border-white/5">
            <p className="text-xs text-white/20 tracking-[0.2em] uppercase">
              &copy; Undercat Creatives 2026
            </p>
          </footer>
        </div>
      </section>
    );
  }

  // ── Animated path ───────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="09-the-pass"
      data-chapter="09-the-pass"
      className="bg-black text-white"
    >
      {/* Closing still — full viewport */}
      <ClosingStill animated />

      {/* Content block — natural scroll (no pin) */}
      <div className="px-8 md:px-16 py-24 max-w-4xl mx-auto space-y-20">

        {/* Tagline — RevealText uses element-level scroll, works in non-pinned flow */}
        <RevealText
          as="h2"
          start={0}
          end={0.35}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
        >
          {TAGLINE}
        </RevealText>

        {/* Closing line */}
        <RevealText
          as="p"
          start={0}
          end={0.4}
          className="text-white/65 text-lg md:text-2xl leading-relaxed max-w-2xl"
        >
          {CLOSING_LINE}
        </RevealText>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.15 }}
        >
          {submitted ? (
            <div ref={successRef} tabIndex={-1} className="py-8 focus:outline-none">
              <p className="text-white/80 text-lg md:text-xl leading-relaxed">
                Your pass is in. We&rsquo;ll be in touch.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-8 max-w-lg">
              <Field
                id="pass-name"
                name="name"
                label="Your name"
                autoComplete="name"
                inputRef={nameRef as React.Ref<HTMLInputElement & HTMLTextAreaElement>}
                error={errors.name}
              />
              <Field
                id="pass-email"
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
                inputRef={emailRef as React.Ref<HTMLInputElement & HTMLTextAreaElement>}
                error={errors.email}
              />
              <Field
                id="pass-brief"
                name="brief"
                label="What are you making?"
                multiline
                inputRef={briefRef as React.Ref<HTMLInputElement & HTMLTextAreaElement>}
                error={errors.brief}
              />
              <button
                type="submit"
                className="mt-2 text-white border-b border-white/30 pb-0.5 text-sm tracking-[0.15em] uppercase hover:border-white/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                Send the pass &rarr;
              </button>
            </form>
          )}
        </motion.div>

        {/* Tool links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-4 pt-4 border-t border-white/10"
        >
          <p className="text-[11px] text-white/30 tracking-[0.25em] uppercase">
            Tools for teams building something now
          </p>
          <nav aria-label="Undercat tools" className="flex flex-wrap gap-6 text-sm text-white/45">
            <Link to="/briefing-room" className="hover:text-white transition-colors">
              Briefing Room
            </Link>
            <Link to="/blueprint" className="hover:text-white transition-colors">
              Blueprint
            </Link>
            <Link to="/lens" className="hover:text-white transition-colors">
              Lens
            </Link>
          </nav>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.5 }}
          className="pt-8 border-t border-white/5"
        >
          <p className="text-xs text-white/20 tracking-[0.2em] uppercase">
            &copy; Undercat Creatives 2026
          </p>
        </motion.footer>

      </div>
    </section>
  );
}
