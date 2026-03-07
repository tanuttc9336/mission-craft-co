import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const principles = [
  {
    title: 'Structure enables creativity',
    body: 'Clear systems reduce noise, protect quality, and make better work easier to deliver.',
  },
  {
    title: 'Technology with purpose',
    body: 'We use automation and AI where repetition exists — not to replace thinking, but to free it up.',
  },
  {
    title: 'Human craft stays human',
    body: 'Ideas, taste, feeling, and final judgment still come from people. That is the part that matters most.',
  },
];

export default function HowWeWork() {
  return (
    <section className="py-24 md:py-32 border-b border-border">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: Label + Headline + Body */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-medium text-muted-foreground mb-6 tracking-[0.3em] uppercase">
              How We Work
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.05] mb-8 tracking-tighter">
              Automate the friction.<br />
              Keep the craft human.
            </h2>
            <div className="space-y-5 text-sm md:text-[15px] leading-relaxed text-muted-foreground max-w-lg">
              <p>
                We believe great creative work needs more than talent.
                It needs structure, clarity, and room to think.
              </p>
              <p>
                That is why we build strong systems, use smart automation, and apply AI where it helps.
                Not to replace creativity — <span className="text-foreground font-medium">to protect it.</span>
              </p>
              <p>
                The repetitive can be automated.<br />
                <span className="text-foreground font-medium">Taste, judgment, and craft stay human.</span>
              </p>
            </div>
          </motion.div>

          {/* Right: Principle Cards */}
          <div className="flex flex-col gap-6 lg:pt-12">
            {principles.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.45 }}
                className="group border border-border bg-card p-6 md:p-8 transition-shadow duration-300 hover:shadow-elevated"
              >
                <span className="text-highlight font-display text-xs font-bold tracking-[0.2em] uppercase">
                  0{i + 1}
                </span>
                <h3 className="font-display text-lg mt-3 mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footnote + CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-10 border-t border-border"
        >
          <p className="text-xs text-muted-foreground tracking-widest uppercase">
            Built with systems. Shaped by humans.
          </p>
          <Button variant="heroOutline" size="lg" asChild>
            <Link to="/lens">See Your Brand Through Undercat <ArrowRight size={14} /></Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
