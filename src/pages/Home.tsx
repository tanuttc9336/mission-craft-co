import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cases } from '@/data/cases';
import CaseCard from '@/components/CaseCard';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { trackEvent } from '@/utils/analytics';
import { ArrowRight } from 'lucide-react';
import logo from '@/assets/undercat-logo.png';
import HowWeWork from '@/components/HowWeWork';

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
      <section className="min-h-[90vh] flex items-center bg-primary text-primary-foreground relative overflow-hidden">
        {/* Background logo watermark */}
        <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none">
          <img src={logo} alt="" className="w-[600px] h-auto" />
        </div>
        
        <div className="container py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <img src={logo} alt="Undercat" className="h-12 w-auto" />
            </div>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[0.95] mb-6 tracking-tighter">
              Creative<br />
              production<br />
              <span className="text-highlight">that delivers.</span>
            </h1>
            <p className="text-lg md:text-xl opacity-60 max-w-xl mb-10 font-body">
              Pick your mission. We'll handle the craft. From concept to final cut — masterful content for brands that refuse to blend in.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl" asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                <Link to="/work">Explore Work <ArrowRight size={16} /></Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/builder">Build Your Project</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MEOW Pillars */}
      <section className="py-24 md:py-32 border-b border-border">
        <div className="container">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-medium text-muted-foreground mb-16 tracking-[0.3em] uppercase"
          >
            The MEOW Standard
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {pillars.map((p, i) => (
              <motion.div
                key={p.letter}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="font-display text-6xl font-extrabold text-highlight">{p.letter}</span>
                <h3 className="font-display text-lg mt-3 mb-2">{p.word}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <HowWeWork />

      {/* Featured Work */}
      <section className="py-24 md:py-32 border-b border-border">
        <div className="container">
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-3 tracking-[0.3em] uppercase">Featured Work</p>
              <h2 className="font-display text-3xl md:text-4xl">Recent Projects</h2>
            </div>
            <Button variant="ghost" asChild className="hidden sm:inline-flex text-xs tracking-widest uppercase">
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

      {/* Undercat Lens CTA */}
      <section className="py-24 md:py-32 border-b border-border">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-xs font-medium text-highlight mb-6 tracking-[0.3em] uppercase">Undercat Lens</p>
              <h2 className="font-display text-3xl md:text-4xl mb-4">See Your Brand Through Undercat</h2>
              <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
                Discover what may be holding attention back — and what kind of creative direction could move it forward.
              </p>
              <Button variant="hero" size="xl" asChild>
                <Link to="/lens">Start Your Lens <ArrowRight size={16} /></Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 md:py-32 bg-primary text-primary-foreground">
        <div className="container">
          <p className="text-xs font-medium opacity-50 mb-16 tracking-[0.3em] uppercase">How It Works</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <span className="text-highlight font-display text-sm font-bold">{s.num}</span>
                <h3 className="font-display text-2xl mt-3 mb-3">{s.title}</h3>
                <p className="text-sm opacity-50">{s.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-20">
            <Button variant="hero" size="xl" asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Link to="/builder">Start Building <ArrowRight size={16} /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
