import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const principles = [
  { label: 'Systems protect the craft' },
  { label: 'Automation removes repetition' },
  { label: 'AI supports the process' },
  { label: 'Human judgment shapes the work' },
];

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
};

export default function CraftedByHuman() {
  return (
    <section className="relative overflow-hidden">
      {/* ── INTRO ── */}
      <div className="py-28 md:py-40 border-b border-border">
        <div className="container max-w-3xl">
          <motion.p
            {...fade}
            className="text-xs font-medium text-muted-foreground mb-6 tracking-[0.3em] uppercase"
          >
            Our Philosophy
          </motion.p>
          <motion.h2
            {...fade}
            transition={{ delay: 0.05 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-tighter mb-6"
          >
            Crafted by Human
          </motion.h2>
          <motion.p
            {...fade}
            transition={{ delay: 0.1 }}
            className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed"
          >
            We use systems, automation, and AI to remove friction from the process&nbsp;— not the humanity from the work.
          </motion.p>
        </div>
      </div>

      {/* ── EDITORIAL BLOCKS ── */}
      <div className="py-24 md:py-36 border-b border-border">
        <div className="container max-w-3xl space-y-24 md:space-y-32">
          {/* Block A */}
          <motion.div {...fade}>
            <p className="font-display text-2xl md:text-3xl leading-snug tracking-tight mb-8">
              We believe the best creative work is still human work.
            </p>
            <div className="space-y-1 text-sm md:text-base text-muted-foreground">
              <p>Not slower work.</p>
              <p>Not messier work.</p>
              <p>Not romantic chaos dressed up as artistry.</p>
              <p className="text-foreground font-medium pt-2">Human work.</p>
            </div>
          </motion.div>

          {/* Block B */}
          <motion.div {...fade}>
            <div className="space-y-1 text-sm md:text-base text-muted-foreground">
              <p>The ideas still come from people.</p>
              <p>Taste still comes from people.</p>
              <p>Judgment still comes from people.</p>
            </div>
            <div className="mt-6 space-y-1 text-sm md:text-base text-foreground font-medium">
              <p>So does restraint.</p>
              <p>So does timing.</p>
              <p>So does craft.</p>
            </div>
          </motion.div>

          {/* Block C */}
          <motion.div {...fade}>
            <p className="font-display text-xl md:text-2xl leading-snug tracking-tight mb-4">
              What technology does well is remove the drag.
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-lg leading-relaxed">
              It helps us move faster, think cleaner, organize better, and protect more energy for the part that matters most: making work people can actually feel.
            </p>
          </motion.div>

          {/* Block D */}
          <motion.div {...fade}>
            <div className="space-y-1 text-sm md:text-base text-muted-foreground">
              <p>We use systems.</p>
              <p>We use automation.</p>
              <p>We use AI.</p>
            </div>
            <div className="mt-6 border-l-2 border-highlight pl-6">
              <p className="text-sm md:text-base text-foreground font-medium">
                Not to replace creativity.<br />
                To give it more room.
              </p>
            </div>
          </motion.div>

          {/* Block E */}
          <motion.div {...fade}>
            <p className="font-display text-xl md:text-2xl leading-snug tracking-tight mb-4">
              Modern tools. Human standard.
            </p>
            <div className="space-y-2 text-sm md:text-base text-muted-foreground">
              <p>Every piece we deliver is shaped by human eyes, human skill, and human care.</p>
              <p className="text-foreground font-medium pt-2">
                That is not old-fashioned. That is the point.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── PRINCIPLES STRIP ── */}
      <div className="py-20 md:py-28 border-b border-border bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-6">
            {principles.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4"
              >
                <span className="text-highlight font-display text-2xl font-extrabold leading-none mt-0.5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-sm md:text-base font-medium leading-snug opacity-80">
                  {p.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CLOSING CTA ── */}
      <div className="py-24 md:py-32">
        <div className="container max-w-2xl text-center">
          <motion.div {...fade}>
            <p className="font-display text-2xl md:text-3xl tracking-tight mb-3">
              Built with systems. Delivered with care.
            </p>
            <p className="text-sm text-muted-foreground mb-10">
              See how the work comes together.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/work">Explore Our Work <ArrowRight size={16} /></Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/builder">Start Your Project</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
