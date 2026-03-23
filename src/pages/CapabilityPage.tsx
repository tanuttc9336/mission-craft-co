import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cases } from '@/data/cases';
import { getCapabilityBySlug, capabilityConfigs } from '@/data/capabilityConfig';
import CaseCard from '@/components/CaseCard';
import { useEffect } from 'react';
import { trackEvent } from '@/utils/analytics';

export default function CapabilityPage() {
  const { slug } = useParams<{ slug: string }>();
  const config = slug ? getCapabilityBySlug(slug) : undefined;

  useEffect(() => {
    if (config) trackEvent('page_view', { page: 'capability', capability: config.label });
  }, [config]);

  if (!config) return <Navigate to="/work" replace />;

  // Get cases by ID — maintains the order defined in config
  const capCases = config.caseIds
    .map(id => cases.find(c => c.id === id))
    .filter(Boolean) as typeof cases;

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
            What We Do
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-7xl leading-[1.05] tracking-tight mb-8 whitespace-pre-line"
          >
            {config.headline}
            {'\n'}
            <span className="text-highlight">{config.highlightLine}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed"
          >
            {config.subtext}
          </motion.p>
        </div>
      </section>

      {/* ── What This Looks Like ── */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs tracking-widest uppercase text-muted-foreground mb-3"
          >
            What This Looks Like
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-2xl sm:text-3xl md:text-4xl tracking-tight mb-16"
          >
            {config.label}
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
            {config.services.map((s, i) => (
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

      {/* ── Selected Work ── */}
      {capCases.length > 0 && (
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
              className="font-display text-2xl sm:text-3xl md:text-4xl tracking-tight mb-12"
            >
              {config.label} — from our portfolio
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {capCases.map((c, i) => (
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
      )}

      {/* ── Explore Other Capabilities ── */}
      <section className="py-16 md:py-20 px-6 border-t border-border">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-6">
            Explore More
          </p>
          <div className="flex flex-wrap gap-2">
            {capabilityConfigs
              .filter(c => c.slug !== slug)
              .map(c => (
                <Link
                  key={c.slug}
                  to={`/capabilities/${c.slug}`}
                  className="px-4 py-2 text-xs font-medium tracking-wider uppercase border border-border hover:border-foreground transition-colors"
                >
                  {c.label}
                </Link>
              ))}
          </div>
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
            {config.ctaHeadline}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-muted-foreground mb-10 max-w-md mx-auto"
          >
            {config.ctaSubtext}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/briefing-room"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 text-xs tracking-widest uppercase font-medium hover:opacity-90 transition-opacity"
            >
              Start a brief <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border border-foreground px-8 py-3 text-xs tracking-widest uppercase font-medium hover:bg-foreground hover:text-background transition-colors"
            >
              Get in touch
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
