import { useBrief } from '@/hooks/useBrief';
import { channelOptions } from '@/data/builder';
import { Channel } from '@/types/brief';
import { motion } from 'framer-motion';

export default function StepChannels() {
  const { brief, updateBrief } = useBrief();

  const toggle = (id: Channel) => {
    const next = brief.channels.includes(id)
      ? brief.channels.filter(c => c !== id)
      : [...brief.channels, id];
    updateBrief({ channels: next });
  };

  const selectedChannels = channelOptions.filter(c => brief.channels.includes(c.id));
  const allRatios = [...new Set(selectedChannels.flatMap(c => c.aspectRatios))];

  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl mb-2">Where will this live?</h2>
      <p className="text-muted-foreground text-sm mb-8">Select your target channels.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg">
        {channelOptions.map(c => {
          const active = brief.channels.includes(c.id);
          return (
            <motion.button
              key={c.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggle(c.id)}
              className={`p-4 rounded-lg border text-center transition-all duration-200 ${
                active ? 'border-accent bg-accent/10 shadow-soft' : 'border-border bg-card hover:border-accent/50'
              }`}
            >
              <span className="text-sm font-medium">{c.label}</span>
            </motion.button>
          );
        })}
      </div>

      {allRatios.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 bg-secondary rounded-lg max-w-lg">
          <p className="text-xs font-medium text-muted-foreground mb-2">Required aspect ratios:</p>
          <div className="flex flex-wrap gap-2">
            {allRatios.map(r => (
              <span key={r} className="text-xs bg-card px-3 py-1 rounded-full border border-border">{r}</span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
