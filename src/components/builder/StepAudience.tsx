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
      <h2 className="font-display text-2xl md:text-3xl mb-2">Who Are We Talking To?</h2>
      <p className="text-muted-foreground text-sm mb-8">Select one or more audience personas.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {personas.map(p => {
          const active = brief.audiencePersonas.includes(p.id);
          return (
            <motion.button
              key={p.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggle(p.id)}
              className={`text-left p-5 border transition-all duration-200 ${
                active ? 'border-foreground bg-primary text-primary-foreground' : 'border-border bg-background hover:border-foreground'
              }`}
            >
              <span className="font-medium text-sm">{p.label}</span>
              <p className={`text-xs mt-1 ${active ? 'opacity-70' : 'text-muted-foreground'}`}>{p.description}</p>
              <p className={`text-xs mt-2 ${active ? 'opacity-60' : 'text-muted-foreground'}`}>Tone: {p.tone}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
