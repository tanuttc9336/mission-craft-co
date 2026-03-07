import { useState, useEffect, useMemo } from 'react';
import { cases, industries, goals, allOutputs, allStyleDNA } from '@/data/cases';
import CaseCard from '@/components/CaseCard';
import { trackEvent } from '@/utils/analytics';
import { motion } from 'framer-motion';

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
    <div className="container py-16 md:py-24 relative">
      <div className="liquid-orb liquid-orb-1 -top-60 -right-40 opacity-20" />
      
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
        <h1 className="font-display text-4xl md:text-5xl mb-4">Our Work</h1>
        <p className="text-muted-foreground mb-12 max-w-lg">Every project starts with a clear mission. Here's what we've delivered.</p>
      </motion.div>

      {/* Filters */}
      <div className="space-y-4 mb-12 relative z-10">
        {filterGroups.map(group => (
          <div key={group.label}>
            <span className="text-xs font-medium text-muted-foreground mr-3">{group.label}:</span>
            {group.options.map(opt => {
              const active = (filters[group.label] ?? []).includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => toggleFilter(group.label, opt)}
                  className={`inline-block mr-2 mb-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    active
                      ? 'bg-accent text-accent-foreground border-accent'
                      : 'bg-card text-foreground border-border hover:border-accent/40'
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {filtered.map((c, i) => (
          <CaseCard key={c.id} case={c} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-20">No cases match your filters. Try adjusting.</p>
      )}
    </div>
  );
}
