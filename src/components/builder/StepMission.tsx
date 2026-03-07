import { useBrief } from '@/hooks/useBrief';
import { missions } from '@/data/builder';
import { Mission } from '@/types/brief';
import { motion } from 'framer-motion';

export default function StepMission() {
  const { brief, updateBrief } = useBrief();
  const selected = missions.find(m => m.id === brief.mission);

  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl mb-2">Pick your mission.</h2>
      <p className="text-muted-foreground text-sm mb-8">What's the primary objective?</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {missions.map(m => (
          <motion.button
            key={m.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => updateBrief({ mission: m.id as Mission })}
            className={`text-left p-5 rounded-lg border transition-all duration-200 ${
              brief.mission === m.id
                ? 'border-accent bg-accent/10 shadow-soft'
                : 'border-border bg-card hover:border-accent/50'
            }`}
          >
            <span className="font-medium text-sm">{m.label}</span>
            <p className="text-xs text-muted-foreground mt-1">{m.description}</p>
          </motion.button>
        ))}
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-secondary rounded-lg"
        >
          <p className="text-xs text-muted-foreground mb-1">Recommended funnel: <span className="text-foreground font-medium">{selected.funnel}</span></p>
          <p className="text-xs text-muted-foreground">Starter deliverables: {selected.starterDeliverables.join(', ')}</p>
        </motion.div>
      )}
    </div>
  );
}
