import { useLens } from '@/hooks/useLens';
import LensChip from './LensChip';
import type { LensChallenge } from '@/types/lens';

const challenges: LensChallenge[] = [
  'Not getting enough attention',
  'Getting seen but not remembered',
  'Looking good but not converting',
  'Hard to explain what makes us different',
  'Launch pressure',
  'Content feels flat',
  'Audience trust is weak',
  'Brand feels inconsistent',
  'We need stronger positioning',
  "We're not sure yet",
];

export default function StepStuck() {
  const { session, toggleChallenge } = useLens();

  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl mb-2">What Feels Stuck?</h2>
      <p className="text-muted-foreground text-sm mb-10">We're looking for friction, not perfection. <span className="text-foreground/60">Select up to 2.</span></p>

      <div className="flex flex-wrap gap-2 max-w-2xl">
        {challenges.map(c => (
          <LensChip
            key={c}
            label={c}
            active={session.currentChallenges.includes(c)}
            onClick={() => toggleChallenge(c)}
            disabled={session.currentChallenges.length >= 2 && !session.currentChallenges.includes(c)}
          />
        ))}
      </div>
    </div>
  );
}
