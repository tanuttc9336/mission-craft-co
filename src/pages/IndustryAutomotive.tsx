import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Film, Smartphone, Sparkles, BarChart3 } from 'lucide-react';
import { cases } from '@/data/cases';
import CaseCard from '@/components/CaseCard';

const services = [
  {
    icon: Film,
    title: 'Product Feature Films',
    description:
      'We showcase your car\u2019s luxury through cinematic storytelling. Our feature films highlight your car\u2019s design, performance, and elegance in every frame. We make your audience dream of driving it.',
  },
  {
    icon: Smartphone,
    title: 'Short-Form Reels for Social',
    description:
      'Your customers are on social media, and they\u2019re looking for experiences that match their lifestyle. Our reels capture the luxury feel of your car in 15 to 30 seconds, perfect for platforms like Instagram and TikTok.',
  },
  {
    icon: Sparkles,
    title: 'Event Cinematics',
    description:
      'A luxury car launch is more than just an event\u2014it\u2019s an experience. We capture every detail, from the reveal to the audience\u2019s reaction, and create a cinematic package that showcases the exclusivity and prestige of your brand.',
  },
  {
    icon: BarChart3,
    title: 'Motion Graphics & Infographics',
    description:
      'Luxury doesn\u2019t need to be complicated. We explain your car\u2019s cutting-edge features through elegant, minimalist motion graphics that make complex ideas look simple and stylish.',
  },
];

const automotiveCases = cases.filter((c) => c.industry === 'Automotive');

export default function IndustryAutomotive() {
  return (
    <main>
      {/* ── Hero ── */}
      <section className="min-h-[80vh] flex flex-col justify-center bg-primary text-primary-foreground px-6">
        <div className="max-w-[1200px] mx-auto w-full">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs tracking-widest uppercase text-muted-foreground mb-6"
          >
            Explore by Industry
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-7xl leading-[1.05] tracking-tight mb-8"
          >
            Cars don&rsquo;t sell
            <br />
            themselves.
            <br />
            <span className="text-highlight">Great stories do.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed"
          >
            Tailored video production for Thailand&rsquo;s automotive marketers&mdash;designed to engage, convert, and deliver ROI.
          </motion.p>
        </div>
      </section>

      {/* ── Featured Services ── */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs tracking-widest uppercase text-muted-foreground mb-3"
          >
            Featured Services
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-2xl sm:text-3xl md:text-4xl tracking-tight mb-16"
          >
            What we do for automotive brands
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                className="bg-background p-8 md:p-10 flex flex-col gap-4"
              >
                <s.icon className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                <h3 className="font-display text-base sm:text-lg tracking-tight">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Automotive Projects ── */}
      <section className="py-24 md:py-32 px-6 bg-secondary/30">
        <div className="max-w-[1200px] mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs tracking-widest uppercase text-muted-foreground mb-3"
          >
            Selected Work
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-2xl sm:text-3xl md:text-4xl tracking-tight mb-4"
          >
            Automotive projects
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-muted-foreground max-w-lg mb-12"
          >
            From launch films to social campaigns&mdash;here&rsquo;s how we&rsquo;ve
            helped automotive brands tell their story.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {automotiveCases.map((c, i) => (
              <CaseCard key={c.id} case={c} index={i} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link
              to="/work"
              className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-medium hover:text-foreground text-muted-foreground transition-colors"
            >
              View all work <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 md:py-32 px-6 text-center">
        <div className="max-w-[1200px] mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-2xl sm:text-3xl md:text-4xl tracking-tight mb-4"
          >
            Tell the story your customers want to hear
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-muted-foreground mb-10 max-w-md mx-auto"
          >
            People don&rsquo;t just buy cars&mdash;they buy an experience of what
            driving that car will mean for their lives.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 text-xs tracking-widest uppercase font-medium hover:opacity-90 transition-opacity"
            >
              Get in touch <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
