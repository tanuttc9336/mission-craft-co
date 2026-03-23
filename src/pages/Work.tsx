import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { cases, industries, goals, allOutputs, allStyleDNA } from '@/data/cases';
import CaseCard from '@/components/CaseCard';
import { trackEvent } from '@/utils/analytics';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

type FilterGroup = { label: string; options: string[] };

const filterGroups: FilterGroup[] = [
  { label: 'Goal', options: goals },
  { label: 'Industry', options: industries },
  { label: 'Output', options: allOutputs },
  { label: 'Style DNA', options: allStyleDNA },
];

export default function Work() {
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  useEffect(() => { trackEvent('page_view', { page: 'work' }); }, []);

  const toggleFilter = (group: string, value: string) => {
    setFilters(prev => {
      const current = prev[group] ?? [];
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      trackEvent('case_filter', { group, value });
      return { ...prev, [group]: next };
    });
  };

  const filtered = useMemo(() => {
    return cases.filter(c => {
      for (const [group, values] of Object.entries(filters)) {
        if (values.length === 0) continue;
        if (group === 'Goal' && !values.includes(c.goal)) return false;
        if (group === 'Industry' && !values.includes(c.industry)) return false;
        if (group === 'Output' && !values.some(v => c.outputs.includes(v))) return false;
        if (group === 'Style DNA' && !values.some(v => c.styleDNA.includes(v))) return false;
      }
      return true;
    });
  }, [filters]);

  return (
    <div className="container py-16 md:py-24">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl md:text-5xl mb-4">Our Work</h1>
        <p className="text-muted-foreground text-sm mb-16 max-w-lg">Every project starts with a clear mission. Here's what we've delivered.</p>
      </motion.div>

      {/* Filters */}
      <div className="space-y-4 mb-16">
        {filterGroups.map(group => (
          <div key={group.label} className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mr-2 min-w-[70px]">{group.label}</span>
            {group.options.map(opt => {
              const active = (filters[group.label] ?? []).includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => toggleFilter(group.label, opt)}
                  className={`px-3 py-1.5 text-[10px] font-medium tracking-wider uppercase border transition-all ${
                    active
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-foreground border-border hover:border-foreground'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((c, i) => (
          <CaseCard key={c.id} case={c} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-20 text-sm">No cases match your filters. Try adjusting.</p>
      )}

      {/* Briefing Room CTA */}
      <div className="mt-20 border-t border-border pt-12 text-center">
        <p className="text-[10px] font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4">Ready to start?</p>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
          Have a project in mind? Build a brief and get a production-ready blueprint.
        </p>
        <Button variant="default" size="lg" asChild>
          <Link to="/briefing-room">Start Your Brief <ArrowRight size={14} /></Link>
        </Button>
      </div>
    </div>
  );
}
