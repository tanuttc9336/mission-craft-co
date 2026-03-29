import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/utils/analytics';
import { ArrowRight, Target, BarChart3, Settings2 } from 'lucide-react';

/* ─── Data ─── */

const pillars = [
  {
    icon: Target,
    title: 'Make Your Brand Say What It Means',
    body: `Most golf businesses have something great — a legendary coach, lab-grade technology, a beautiful course — but struggle to communicate it clearly and consistently.\n\nWe help you find where your brand stands in the market, build a core message your entire team can align on, design the visual direction and tone that makes you recognizable, and define what every piece of content should actually do for your business.`,
    tags: ['Positioning', 'Core Message', 'Visual Direction', 'Content Architecture'],
  },
  {
    icon: BarChart3,
    title: 'Turn Your Numbers Into Decisions',
    body: `You're already generating data — from social media, ads, trials, student records, and package sales. But most of it sits in separate spreadsheets that no one connects.\n\nWe analyze your full funnel: content → leads → trials → paid students → retention. We separate vanity metrics from real business signals. We find which sources bring people who actually buy — not just people who watch.`,
    tags: ['Funnel Analysis', 'Ads Optimization', 'Conversion Tracking', 'Business Intelligence'],
  },
  {
    icon: Settings2,
    title: 'Connect the Dots Between Your Team and Your Customers',
    body: `What happens after someone walks in for a trial? What does the admin record? What does the coach report? What does the owner see on Monday morning?\n\nWe design the customer journey so every touchpoint feels intentional — and build internal workflows that keep your team aligned without adding complexity they'll abandon in two weeks.`,
    tags: ['Customer Journey', 'Internal Workflow', 'Post-Trial Experience', 'Operations'],
  },
];

const caseChapters = [
  {
    num: '01',
    title: 'A lab full of tools. A brand waiting to be found.',
    body: `Greenline Golf Lab is a golf academy in Bangna with serious credentials: a legendary certified coach, lab-grade technology (launch monitors, pressure plates, 3D motion capture), and a long-drive specialist building a fast-growing online audience.\n\nEvery piece was strong on its own. But they weren't connected. The brand didn't have a clear voice. The content didn't have a strategy. The data existed but wasn't being read. And the customer experience after a trial lesson just... ended.`,
  },
  {
    num: '02',
    title: '"What is Greenline, really?" — answering the question no one had asked yet.',
    body: `We started with the fundamentals: where should Greenline stand in the market? What's the real strength? What do students, viewers, and potential clients actually feel about this brand?\n\nThe result was a Core Communication Book — a complete internal playbook covering brand positioning ("Decode your Swing DNA"), key messages tailored to five audience segments (beginners, mid-handicappers, women, juniors, and corporates), five content pillars, a visual system, and a working checklist the team uses to QC every single piece of content before it goes live.`,
  },
  {
    num: '03',
    title: 'Looking past the likes.',
    body: `We didn't just measure which posts got the most views. We analyzed which content attracted the right people — people ready to book a trial and ready to buy.\n\nWe redesigned the content direction: which topics to keep, which formats play to Greenline's strengths, how each piece connects to the business funnel, and where the gap is between "people who watch" and "people who walk in."`,
  },
  {
    num: '04',
    title: 'Reading the numbers the ads dashboard won\'t tell you.',
    body: `We audited three months of Meta Ads data across multiple campaigns.\n\nThe findings were clear: the best-performing campaign was delivering messages at ฿80 each — within benchmark and ready to scale. Meanwhile, a campaign with the wrong objective was burning budget at ฿1,700 per message.\n\nOur recommendations: what to pause, what to scale, what to A/B test, and how to structure reporting so these insights don't require an analyst every time.`,
  },
  {
    num: '05',
    title: 'Making the trial lesson the beginning, not the end.',
    body: `Before: a trial lesson was a nice experience that ended when the student walked out the door.\n\nAfter: every trial student receives a Swing DNA Assessment — a personalized diagnosis with measurable data and a clear next step. The experience was designed so the student feels they received something valuable, not just "a free lesson."\n\nWe also began building internal data infrastructure: what the admin records, what the coach reports, what management sees — starting simple, designed to grow.`,
  },
];

const audienceCards = [
  {
    title: 'Golf Academies & Driving Ranges',
    body: 'You have great coaches and great tech. But people still don\'t know you exist — or why you\'re different. We help you build the brand, create content that brings the right students in, and design the system that turns trials into active members.',
  },
  {
    title: 'Golf Courses',
    body: 'Competing on green fees alone is a race to the bottom. We help you build an identity that attracts new audiences, create experiences worth talking about, and communicate what makes your course the one to visit.',
  },
  {
    title: 'Golf Equipment Brands',
    body: 'Product shots aren\'t enough anymore. We create content that puts your equipment in the hands and stories of real golfers — the kind of content that makes people want to try it, not just see it.',
  },
  {
    title: 'Golf Pros & Personal Brands',
    body: 'You have the knowledge. You have the skill. But translating that into a brand that people follow, trust, and eventually pay — that\'s a different game. We help you find your voice and build your content engine.',
  },
  {
    title: 'Tournament & Event Organizers',
    body: 'Coverage that makes people who weren\'t there wish they had been — and come next time. Not just highlight reels. Stories.',
  },
];

/* ─── Component ─── */

export default function IndustryGolfPage() {
  useEffect(() => { trackEvent('page_view', { page: 'industry-golf' }); }, []);

  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section className="min-h-[85vh] flex items-center bg-primary text-primary-foreground relative overflow-hidden">
        <div className="container py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="text-xs font-medium text-highlight mb-8 tracking-[0.3em] uppercase">Industries — Golf</p>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[0.95] mb-6 tracking-tighter">
              We speak<br />
              <span className="text-highlight">golf.</span>
            </h1>
            <div className="text-base md:text-lg opacity-60 max-w-xl mb-10 font-body space-y-4">
              <p>Not just the sport. The business.</p>
              <p>
                We understand why a driving range thinks differently from a course,
                why a head coach's brand isn't the same as the owner's,
                why a trial lesson that "went well" still doesn't convert,
                and why high-reach content isn't always high-value content.
              </p>
              <p>We've been inside the operation — not just behind the camera.</p>
            </div>
            <Button variant="hero" size="xl" asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Link to="/contact">Talk to us about your golf business <ArrowRight size={16} /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ═══ BEYOND CONTENT — PILLARS ═══ */}
      <section className="py-24 md:py-32 border-b border-border">
        <div className="container">
          <div className="max-w-2xl mb-16">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <p className="text-xs font-medium text-muted-foreground mb-4 tracking-[0.3em] uppercase">Beyond Content</p>
              <h2 className="font-display text-3xl md:text-4xl mb-4">What we actually do for golf businesses.</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A golf business doesn't just need better content. It needs someone who sees the full picture — from the brand people see on the outside, to the system that makes the team work better on the inside.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border border-border p-8"
              >
                <div className="w-10 h-10 bg-highlight flex items-center justify-center mb-6">
                  <p.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-display text-lg mb-4">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line mb-6">{p.body}</p>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-medium tracking-wider uppercase px-3 py-1 border border-border text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CASE STUDY — GREENLINE ═══ */}
      <section className="py-24 md:py-32 bg-primary text-primary-foreground">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <p className="text-xs font-medium text-highlight mb-4 tracking-[0.3em] uppercase">Case Study</p>
            <h2 className="font-display text-3xl md:text-4xl mb-3">Greenline Golf Lab</h2>
            <p className="text-base opacity-60 mb-16 font-body max-w-xl">
              From scattered strengths to a connected system — how we helped a golf academy see its own full picture.
            </p>
          </motion.div>

          <div className="space-y-16">
            {caseChapters.map((ch, i) => (
              <motion.div
                key={ch.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-highlight font-display text-sm font-bold">{ch.num}</span>
                  <div className="w-8 h-px bg-primary-foreground/20" />
                </div>
                <h3 className="font-display text-xl md:text-2xl mb-4 leading-tight">{ch.title}</h3>
                <p className="text-sm opacity-60 leading-relaxed whitespace-pre-line font-body">{ch.body}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 pt-8 border-t border-primary-foreground/10"
          >
            <p className="text-sm opacity-60 leading-relaxed font-body italic">
              What Greenline received wasn't "content services." It was a strategic partner who looked at the business as a whole and helped it grow in the direction that made sense.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ WHO THIS IS FOR ═══ */}
      <section className="py-24 md:py-32 border-b border-border">
        <div className="container">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-16">
            <p className="text-xs font-medium text-muted-foreground mb-4 tracking-[0.3em] uppercase">Who This Is For</p>
            <h2 className="font-display text-3xl md:text-4xl max-w-lg">
              If your business lives in the world of golf, we speak the same language.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {audienceCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="border border-border p-6"
              >
                <h3 className="font-display text-base mb-3">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-24 md:py-32">
        <div className="container max-w-2xl text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl md:text-4xl mb-4">Let's talk about your golf business.</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-md mx-auto">
              We don't start with a quotation. We start by listening — where your business is now, and where you want it to go. Then we figure out the right plan together.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">Book a Conversation <ArrowRight size={16} /></Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/work">Explore our work first <ArrowRight size={16} /></Link>
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground/50 tracking-wider uppercase">
              Currently working with golf academies, tournament organizers, and coaching brands across Thailand.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
