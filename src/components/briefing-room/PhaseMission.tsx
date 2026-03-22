import { useBrief } from '@/hooks/useBrief';
import { missions, personas } from '@/data/builder';
import { Mission, PersonaId } from '@/types/brief';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

function suggestPersonas(text: string): typeof personas {
  if (!text.trim()) return [];
  const lower = text.toLowerCase();
  return personas.filter(p =>
    p.keywords.some(kw => lower.includes(kw))
  );
}

export default function PhaseMission() {
  const { brief, updateBrief, updateOffer } = useBrief();

  const suggested = useMemo(() => suggestPersonas(brief.audienceText), [brief.audienceText]);

  const togglePersona = (id: PersonaId) => {
    const next = brief.audiencePersonas.includes(id)
      ? brief.audiencePersonas.filter(p => p !== id)
      : [...brief.audiencePersonas, id];
    updateBrief({ audiencePersonas: next });
  };

  return (
    <div className="space-y-10">
      {/* Section A: Mission Select */}
      <section>
        <h2 className="font-display text-2xl md:text-3xl mb-2">What's The Mission?</h2>
        <p className="text-muted-foreground text-sm mb-6">What's the primary objective?</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {missions.map(m => (
            <motion.button
              key={m.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => updateBrief({ mission: m.id as Mission })}
              className={`text-left p-4 border transition-all duration-200 ${
                brief.mission === m.id
                  ? 'border-foreground bg-primary text-primary-foreground'
                  : 'border-border bg-background hover:border-foreground'
              }`}
            >
              <span className="font-medium text-sm">{m.label}</span>
              <p className={`text-xs mt-1 ${brief.mission === m.id ? 'opacity-70' : 'text-muted-foreground'}`}>
                {m.description}
              </p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Section B: Audience (free-text + suggested personas) */}
      <section>
        <h2 className="font-display text-xl md:text-2xl mb-2">Who's It For?</h2>
        <p className="text-muted-foreground text-sm mb-4">Describe your target audience in your own words.</p>

        <textarea
          value={brief.audienceText}
          onChange={e => updateBrief({ audienceText: e.target.value })}
          maxLength={200}
          rows={3}
          placeholder='e.g. "Thai golfers aged 25-45 who want to improve their game"'
          className="w-full max-w-lg bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-shadow resize-none"
        />
        <span className="text-[10px] text-muted-foreground mt-1 block">
          {brief.audienceText.length}/200
        </span>

        {/* Suggested personas based on text */}
        {(suggested.length > 0 || brief.audiencePersonas.length > 0) && (
          <div className="mt-4">
            <p className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground mb-2">
              Suggested personas
            </p>
            <div className="flex flex-wrap gap-2">
              {(suggested.length > 0 ? suggested : personas.filter(p => brief.audiencePersonas.includes(p.id))).map(p => {
                const active = brief.audiencePersonas.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePersona(p.id)}
                    className={`px-3 py-1.5 text-xs font-medium border transition-all ${
                      active
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-foreground border-border hover:border-foreground'
                    }`}
                  >
                    {p.label} {active && '✓'}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Section C: One-liner */}
      <section>
        <h2 className="font-display text-xl md:text-2xl mb-2">What Are We Making?</h2>
        <p className="text-muted-foreground text-sm mb-4">One line. What's the product or campaign?</p>

        <input
          type="text"
          maxLength={120}
          value={brief.offer.keyOffer}
          onChange={e => updateOffer({ keyOffer: e.target.value })}
          placeholder='e.g. "Launch film for new Audi A6 e-tron"'
          className="w-full max-w-lg bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-shadow"
        />
        <span className="text-[10px] text-muted-foreground mt-1 block">
          {brief.offer.keyOffer.length}/120
        </span>
      </section>
    </div>
  );
}
