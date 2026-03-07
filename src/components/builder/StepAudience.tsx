import { useBrief } from '@/hooks/useBrief';
import { personas } from '@/data/builder';
import { PersonaId } from '@/types/brief';
import { motion } from 'framer-motion';

export default function StepAudience() {
  const { brief, updateBrief } = useBrief();

  const toggle = (id: PersonaId) => {
    const next = brief.audiencePersonas.includes(id)
      ? brief.audiencePersonas.filter(p => p !== id)
      : [...brief.audiencePersonas, id];
    updateBrief({ audiencePersonas: next });
  };

  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl mb-2">Who are we talking to?</h2>
      <p className="text-muted-foreground text-sm mb-8">Select one or more audience personas.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {personas.map(p => {
          const active = brief.audiencePersonas.includes(p.id);
          return (
            <motion.button
              key={p.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggle(p.id)}
              className={`text-left p-5 rounded-lg border transition-all duration-200 ${
                active ? 'border-accent bg-accent/10 shadow-soft' : 'border-border bg-card hover:border-accent/50'
              }`}
            >
              <span className="font-medium text-sm">{p.label}</span>
              <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
              <p className="text-xs text-muted-foreground mt-2">Tone: {p.tone}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
