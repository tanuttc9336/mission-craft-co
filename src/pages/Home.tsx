import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cases } from '@/data/cases';
import CaseCard from '@/components/CaseCard';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { trackEvent } from '@/utils/analytics';
import { ArrowRight } from 'lucide-react';

const pillars = [
  { letter: 'M', word: 'Masterful', desc: 'Craft that commands attention.' },
  { letter: 'E', word: 'Engaging', desc: 'Content people actually want to watch.' },
  { letter: 'O', word: 'Original', desc: 'No templates. No recycled ideas.' },
  { letter: 'W', word: 'Wow', desc: 'The feeling when it all comes together.' },
];

const steps = [
  { num: '01', title: 'Explore', desc: 'Browse our work. Find what resonates.' },
  { num: '02', title: 'Build', desc: 'Use the Brief Builder to shape your project.' },
  { num: '03', title: 'Blueprint', desc: 'Get a 1-page project plan. Instantly.' },
];

export default function Home() {
  useEffect(() => { trackEvent('page_view', { page: 'home' }); }, []);
  const featured = cases.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="min-h-[85vh] flex items-center relative overflow-hidden">
        {/* Liquid shadow atmosphere */}
        <div className="liquid-orb liquid-orb-1 -top-40 -right-40 opacity-70" />
        <div className="liquid-orb liquid-orb-2 bottom-20 -left-32 opacity-50" />
        <div className="liquid-ink w-[600px] h-[300px] top-1/3 right-1/4 opacity-40" />
        
        <div className="container py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] mb-6">
              Creative production<br />
              <span className="italic text-accent">that delivers.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10">
              Pick your mission. We'll handle the craft. From concept to final cut — masterful content for brands that refuse to blend in.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/work">Explore Work <ArrowRight size={16} /></Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/builder">Build Your Project</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MEOW Pillars */}
      <section className="py-20 md:py-28 border-t border-border section-atmosphere">
        <div className="liquid-orb liquid-orb-3 top-0 left-1/2 -translate-x-1/2 opacity-30" />
        <div className="container relative z-10">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-medium text-muted-foreground mb-12 tracking-widest uppercase"
          >
            The MEOW Standard
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((p, i) => (
              <motion.div
                key={p.letter}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="font-display text-5xl text-accent">{p.letter}</span>
                <h3 className="font-display text-xl mt-2 mb-1">{p.word}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="py-20 md:py-28 border-t border-border relative overflow-hidden">
        <div className="liquid-orb liquid-orb-2 -top-20 -right-48 opacity-25" />
        <div className="container relative z-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2 tracking-widest uppercase">Featured Work</p>
              <h2 className="font-display text-3xl md:text-4xl">Recent projects.</h2>
            </div>
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link to="/work">View all <ArrowRight size={14} /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((c, i) => (
              <CaseCard key={c.id} case={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 border-t border-border section-atmosphere relative overflow-hidden">
        <div className="liquid-ink w-[500px] h-[250px] bottom-0 left-1/4 opacity-30" />
        <div className="container relative z-10">
          <p className="text-sm font-medium text-muted-foreground mb-12 tracking-widest uppercase">How It Works</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <span className="text-sm font-medium text-accent">{s.num}</span>
                <h3 className="font-display text-2xl mt-2 mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/builder">Start Building <ArrowRight size={16} /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
