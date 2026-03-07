import { useBrief } from '@/hooks/useBrief';
import { missions } from '@/data/builder';
import { Mission } from '@/types/brief';
import { motion } from 'framer-motion';

export default function StepMission() {
  const { brief, updateBrief } = useBrief();
  const selected = missions.find(m => m.id === brief.mission);

  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl mb-2">Pick Your Mission.</h2>
      <p className="text-muted-foreground text-sm mb-8">What's the primary objective?</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {missions.map(m => (
          <motion.button
            key={m.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => updateBrief({ mission: m.id as Mission })}
            className={`text-left p-5 border transition-all duration-200 ${
              brief.mission === m.id
                ? 'border-foreground bg-primary text-primary-foreground'
                : 'border-border bg-background hover:border-foreground'
            }`}
          >
            <span className="font-medium text-sm">{m.label}</span>
            <p className={`text-xs mt-1 ${brief.mission === m.id ? 'opacity-70' : 'text-muted-foreground'}`}>{m.description}</p>
          </motion.button>
        ))}
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 border border-border"
        >
          <p className="text-xs text-muted-foreground mb-1">Recommended funnel: <span className="text-foreground font-medium">{selected.funnel}</span></p>
          <p className="text-xs text-muted-foreground">Starter deliverables: {selected.starterDeliverables.join(', ')}</p>
        </motion.div>
      )}
    </div>
  );
}
