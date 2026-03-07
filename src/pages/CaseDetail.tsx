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
      <p className="text-muted-foreground text-sm">Case not found.</p>
      <Button variant="ghost" asChild className="mt-4"><Link to="/work">Back to Work</Link></Button>
    </div>
  );

  return (
    <div className="container py-16 md:py-24 max-w-3xl">
      <Link to="/work" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft size={14} /> Back to Work
      </Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div
          className="aspect-video mb-8 border border-border"
          style={{ background: c.gradient }}
        />

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-[10px] font-medium tracking-widest uppercase bg-primary text-primary-foreground px-3 py-1">{c.goal}</span>
          <span className="text-[10px] font-medium tracking-widest uppercase border border-border px-3 py-1">{c.industry}</span>
          {c.outputs.map(o => (
            <span key={o} className="text-[10px] font-medium tracking-widest uppercase border border-border px-3 py-1">{o}</span>
          ))}
        </div>

        <h1 className="font-display text-3xl md:text-4xl mb-4">{c.title}</h1>
        <p className="text-muted-foreground text-sm mb-10">{c.description}</p>

        <div className="mb-10">
          <h3 className="font-display text-lg mb-4">Deliverables</h3>
          <div className="flex flex-wrap gap-2">
            {c.deliverables.map(d => (
              <span key={d} className="text-[10px] tracking-wider uppercase bg-secondary px-3 py-1.5">{d}</span>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h3 className="font-display text-lg mb-4">Approach</h3>
          <ul className="space-y-3">
            {c.approach.map((a, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-3">
                <span className="text-highlight font-bold mt-0.5">—</span> {a}
              </li>
            ))}
          </ul>
        </div>

        <Button variant="hero" size="xl" onClick={() => navigate(`/builder?template=${c.id}`)}>
          Build something like this <ArrowRight size={16} />
        </Button>
      </motion.div>
    </div>
  );
}
