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
            <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.05] mb-8">
              Automate the friction.<br />
              <span className="text-highlight">Keep the craft human.</span>
            </h2>
            <div className="space-y-5 text-sm md:text-[15px] text-muted-foreground leading-relaxed max-w-lg">
              <p>
                We believe great creative work needs more than talent.
                It needs structure, clarity, and room to think.
              </p>
              <p>
                That is why we build strong systems, use smart automation, and apply AI where it helps.
                Not to replace creativity — to protect it.
              </p>
              <p className="text-foreground font-medium">
                The repetitive can be automated.<br />
                Taste, judgment, and craft stay human.
              </p>
            </div>

            <div className="mt-10">
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/lens">See Your Brand Through Undercat <ArrowRight size={14} /></Link>
              </Button>
            </div>
          </motion.div>

          {/* Right: Principle Cards */}
          <div className="flex flex-col gap-6 lg:justify-center">
            {principles.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.45 }}
                className="group border border-border bg-card p-6 md:p-8 transition-all duration-300 hover:border-foreground/20 hover:shadow-soft"
              >
                <span className="text-highlight font-display text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
                  0{i + 1}
                </span>
                <h3 className="font-display text-lg md:text-xl mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-xs text-muted-foreground tracking-widest uppercase mt-16 text-center lg:text-left"
        >
          Built with systems. Shaped by humans.
        </motion.p>
      </div>
    </section>
  );
}
