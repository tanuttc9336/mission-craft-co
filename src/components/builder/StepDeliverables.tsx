import { useBrief } from '@/hooks/useBrief';
import { bundles } from '@/data/builder';
import { BundleId } from '@/types/brief';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function StepDeliverables() {
  const { brief, updateBrief } = useBrief();

  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl mb-2">Choose Your Loadout.</h2>
      <p className="text-muted-foreground text-sm mb-8">Pick a package or go custom.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bundles.map(b => {
          const active = brief.deliverablesBundle === b.id;
          return (
            <motion.button
              key={b.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateBrief({ deliverablesBundle: b.id as BundleId })}
              className={`text-left p-6 border transition-all duration-200 ${
                active ? 'border-foreground bg-primary text-primary-foreground' : 'border-border bg-background hover:border-foreground'
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <span className="font-medium">{b.label}</span>
                {active && <Check size={16} className="opacity-70 mt-0.5" />}
              </div>
              <p className={`text-xs mb-3 italic ${active ? 'opacity-60' : 'text-muted-foreground'}`}>{b.tagline}</p>
              {b.deliverables.length > 0 && (
                <ul className="space-y-1.5 mb-3">
                  {b.deliverables.map((d, i) => (
                    <li key={i} className={`text-xs flex items-start gap-2 ${active ? 'opacity-80' : 'text-foreground/80'}`}>
                      <span className="text-highlight mt-0.5">—</span> {d}
                    </li>
                  ))}
                </ul>
              )}
              <p className={`text-xs ${active ? 'opacity-50' : 'text-muted-foreground'}`}>{b.note}</p>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6 p-4 border border-border">
        <p className="text-xs text-muted-foreground">2 revision rounds are included in all packages. Directional changes beyond revisions = Change Order.</p>
      </div>
    </div>
  );
}
