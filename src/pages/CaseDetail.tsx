import { useParams, Link, useNavigate } from 'react-router-dom';
import { cases } from '@/data/cases';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { trackEvent } from '@/utils/analytics';

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const c = cases.find(x => x.id === id);

  useEffect(() => { trackEvent('page_view', { page: 'case_detail', caseId: id }); }, [id]);

  if (!c) return (
    <div className="container py-32 text-center">
      <p className="text-muted-foreground">Case not found.</p>
      <Button variant="ghost" asChild className="mt-4"><Link to="/work">Back to Work</Link></Button>
    </div>
  );

  return (
    <div className="container py-16 md:py-24 max-w-3xl relative">
      <div className="liquid-orb liquid-orb-1 -top-32 -right-48 opacity-15" />
      
      <div className="relative z-10">
        <Link to="/work" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft size={14} /> Back to Work
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div
            className="aspect-video rounded-lg mb-8 shadow-elevated"
            style={{ background: c.gradient }}
          />

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-xs font-medium bg-secondary text-secondary-foreground px-3 py-1 rounded-full">{c.goal}</span>
            <span className="text-xs font-medium bg-secondary text-secondary-foreground px-3 py-1 rounded-full">{c.industry}</span>
            {c.outputs.map(o => (
              <span key={o} className="text-xs font-medium bg-secondary text-secondary-foreground px-3 py-1 rounded-full">{o}</span>
            ))}
          </div>

          <h1 className="font-display text-3xl md:text-4xl mb-4">{c.title}</h1>
          <p className="text-muted-foreground mb-8">{c.description}</p>

          <div className="mb-8">
            <h3 className="font-display text-xl mb-3">Deliverables</h3>
            <div className="flex flex-wrap gap-2">
              {c.deliverables.map(d => (
                <span key={d} className="text-xs bg-muted text-muted-foreground px-3 py-1.5 rounded-full">{d}</span>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h3 className="font-display text-xl mb-3">Approach</h3>
            <ul className="space-y-2">
              {c.approach.map((a, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span> {a}
                </li>
              ))}
            </ul>
          </div>

          <Button variant="hero" size="xl" onClick={() => navigate(`/builder?template=${c.id}`)}>
            Build something like this <ArrowRight size={16} />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
