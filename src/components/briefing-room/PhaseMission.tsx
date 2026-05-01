import React from 'react';
import { useBrief } from '@/hooks/useBrief';
import { missions } from '@/data/builder';
import { Mission } from '@/types/brief';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState, useEffect, useRef } from 'react';
import { matchForMission } from '@/utils/caseMatch';
import ExploreCard from './ExploreCard';

/* Per-mission principle for the Witness sidebar — closes each "listening" panel */
const PRINCIPLES: Record<Mission, string[]> = {
  'launch-film':     ['Restraint required.', 'Trust the silence.'],
  'brand-film':      ['Story over hype.', 'Voice over volume.'],
  'social-campaign': ['Earn the scroll.', 'Cut for the format.'],
  'ad-spot':         ['Land in 3 seconds.', 'One idea, no clutter.'],
  'event-content':   ['Capture. Then live longer.', 'Edit before you shoot.'],
  'retainer':        ['Consistency compounds.', 'Show up on rhythm.'],
};

/* MOVE A · Audience chips reorder per mission — first chip = system anticipates */
const AUDIENCE_BY_MISSION: Record<Mission, string[]> = {
  'launch-film':     ['New to you', 'Still comparing', 'Need convincing', 'Already with you', 'Ready to buy'],
  'brand-film':      ['Already with you', 'Need convincing', 'New to you', 'Still comparing', 'Ready to buy'],
  'social-campaign': ['Still comparing', 'New to you', 'Ready to buy', 'Need convincing', 'Already with you'],
  'ad-spot':         ['Ready to buy', 'Need convincing', 'Still comparing', 'New to you', 'Already with you'],
  'event-content':   ['Ready to buy', 'Already with you', 'New to you', 'Still comparing', 'Need convincing'],
  'retainer':        ['Already with you', 'Need convincing', 'Ready to buy', 'New to you', 'Still comparing'],
};

/* MOVE B+ · One-liner pool per mission · audience-tagged for smart filtering.
   pickExamples() ranks by audience-match, returns top 4. Examples adapt to mission + audience combo. */
type Example = { line: string; tag: string; audiences: string[] };
const ONE_LINER_POOL: Record<Mission, Example[]> = {
  'launch-film': [
    { line: 'A 60-second film that helps new buyers feel safe to commit.', tag: 'Reduces buying anxiety.', audiences: ['New to you', 'Need convincing', 'Still comparing'] },
    { line: 'A launch that makes the product feel like the obvious choice.', tag: 'Steers the choice without arguing.', audiences: ['New to you', 'Still comparing'] },
    { line: 'A premiere clip for existing fans before the public sees it.', tag: 'Reward loyalty first.', audiences: ['Already with you'] },
    { line: 'A 30-second cut to push pre-sold buyers to action.', tag: 'Close the gap between intent and action.', audiences: ['Ready to buy'] },
    { line: 'A launch film that answers the top 3 doubts up front.', tag: 'Skeptics need answers before stories.', audiences: ['Need convincing'] },
    { line: 'A 4-week countdown that builds excitement before launch day.', tag: 'Time builds anticipation.', audiences: ['New to you', 'Still comparing', 'Already with you'] },
    { line: 'A launch that compares us directly to the alternative.', tag: 'Comparison is what shoppers actually do.', audiences: ['Still comparing', 'Need convincing'] },
    { line: 'A 90-second hero film for people who shape opinion.', tag: 'Reach the few who reach many.', audiences: ['Already with you', 'Ready to buy'] },
  ],
  'brand-film': [
    { line: 'A 2-minute brand film about why we exist, not what we sell.', tag: 'Brand work outlasts every campaign.', audiences: ['New to you', 'Already with you', 'Need convincing'] },
    { line: 'A film that wins skeptics through values, not features.', tag: 'Values travel further than features.', audiences: ['Need convincing', 'Still comparing'] },
    { line: 'A brand film that staff are proud to share.', tag: 'Inside-out brand. Team becomes the channel.', audiences: ['Already with you', 'New to you'] },
    { line: "A reset that shows existing fans how we've grown.", tag: 'Loyalty rewards continuity.', audiences: ['Already with you'] },
    { line: 'A 30-second loop on your homepage.', tag: 'Sets the tone for everything else.', audiences: ['Still comparing', 'Need convincing', 'New to you'] },
    { line: 'A short brand intro for first-time visitors.', tag: 'Earns the first 60 seconds of attention.', audiences: ['New to you', 'Still comparing'] },
    { line: 'A 60-second cut from the brand film for ads.', tag: 'Brand fuels performance.', audiences: ['Ready to buy', 'Still comparing'] },
  ],
  'social-campaign': [
    { line: 'A campaign that makes followers post about us.', tag: 'Audience-first beats brand-first.', audiences: ['New to you', 'Still comparing', 'Need convincing'] },
    { line: 'A 4-week test of 3 different messages.', tag: 'Find what works before scaling.', audiences: ['Still comparing', 'Need convincing'] },
    { line: 'A series of short stories around one moment.', tag: 'Repetition with depth.', audiences: ['Already with you', 'New to you'] },
    { line: 'One shoot, 10 posts across all formats.', tag: 'Production efficient.', audiences: ['Ready to buy', 'New to you', 'Still comparing'] },
    { line: 'A campaign just for our most loyal followers.', tag: 'Treat the inner circle well.', audiences: ['Already with you'] },
    { line: 'A series that turns Reel viewers into DMs.', tag: 'Move the conversation closer.', audiences: ['Need convincing', 'Ready to buy'] },
    { line: "A 2-week pulse to bring back followers we've lost.", tag: 'Make returning easy.', audiences: ['Need convincing'] },
  ],
  'ad-spot': [
    { line: 'A 30-second ad to convince skeptics fast.', tag: 'Win doubters in the first 5 seconds.', audiences: ['Need convincing', 'Still comparing'] },
    { line: 'A 15-second hook + 30-second sell for paid social.', tag: 'Hook earns the sell.', audiences: ['Ready to buy', 'Need convincing'] },
    { line: 'A 60-second story that earns the click.', tag: 'Story before sell.', audiences: ['New to you', 'Still comparing'] },
    { line: 'A 6-second pre-roll with one clear message.', tag: 'One idea, no clutter.', audiences: ['Ready to buy'] },
    { line: 'A retargeting cut for almost-buyers.', tag: "Drop-off isn't no — it's bad timing.", audiences: ['Need convincing', 'Already with you'] },
    { line: "A reminder ad for people who've seen us before.", tag: 'Familiar beats novel.', audiences: ['Already with you', 'New to you'] },
    { line: 'A direct comparison ad for cross-shoppers.', tag: "Reframe, don't bash.", audiences: ['Still comparing'] },
  ],
  'event-content': [
    { line: 'A capture turned into 12 weeks of content.', tag: 'One night, three months of social.', audiences: ['New to you', 'Already with you', 'Still comparing'] },
    { line: 'A documentary cut that makes people wish they were there.', tag: "FOMO builds next year's audience.", audiences: ['Already with you', 'New to you'] },
    { line: 'Live highlights edited overnight for next-day posts.', tag: 'Speed earns the algorithm.', audiences: ['Ready to buy', 'Still comparing', 'New to you'] },
    { line: 'A 90-second sizzle reel for sponsors.', tag: 'Built for the renewal conversation.', audiences: ['Already with you', 'Need convincing'] },
    { line: 'An edit attendees want to find themselves in.', tag: 'Self-find drives sharing.', audiences: ['Already with you'] },
    { line: "A recap that doubles as next year's first ad.", tag: 'The recap is the campaign.', audiences: ['New to you', 'Still comparing', 'Need convincing'] },
    { line: 'Behind-the-scenes for future audiences.', tag: "Show how it's made.", audiences: ['Need convincing', 'New to you'] },
  ],
  'retainer': [
    { line: 'A monthly slate of content for loyal customers.', tag: 'Show up before you need anything.', audiences: ['Already with you'] },
    { line: 'Always-on content over a quarter.', tag: 'Repetition compounds.', audiences: ['Already with you', 'New to you', 'Need convincing'] },
    { line: '4 pieces a month, your platform first.', tag: 'Owned beats paid.', audiences: ['Already with you', 'Need convincing'] },
    { line: 'An editorial-style series telling your story.', tag: 'Editorial earns trust.', audiences: ['Already with you', 'New to you'] },
    { line: 'A rhythm to bring back followers who drifted.', tag: "Listen, don't lecture.", audiences: ['Need convincing', 'Still comparing'] },
    { line: "Always-on social that doesn't feel like ads.", tag: 'Native energy converts.', audiences: ['Already with you', 'Ready to buy'] },
    { line: 'Monthly content with a sales target.', tag: 'Branding that earns its keep.', audiences: ['Ready to buy', 'Still comparing'] },
  ],
};

/* Pick top 4 examples for current mission + audience.
   Logic: examples whose audiences[] include the picked audience rank first,
   then mission-generic. Top 4 surface. Visitor sees content tailored to BOTH inputs. */
function pickExamples(mission: Mission | null, audience: string): Example[] {
  const fallbackMission: Mission = mission ?? 'launch-film';
  const pool = ONE_LINER_POOL[fallbackMission];
  if (!audience || !AUDIENCE_ANGLE[audience]) {
    return pool.slice(0, 4);
  }
  const matching = pool.filter(e => e.audiences.includes(audience));
  const rest = pool.filter(e => !e.audiences.includes(audience));
  return [...matching, ...rest].slice(0, 4);
}

/* MOVE C · Pattern label for Witness — mission shape + audience angle */
const MISSION_PATTERN: Record<Mission, string> = {
  'launch-film':     'a chapter-zero brief',
  'brand-film':      'a brand-foundation brief',
  'social-campaign': 'a multi-pulse campaign',
  'ad-spot':         'a sharp single-shot',
  'event-content':   'a capture-and-extend brief',
  'retainer':        'a long-game rhythm brief',
};
const AUDIENCE_ANGLE: Record<string, string> = {
  'New to you':       'awareness angle',
  'Already with you': 'loyalty angle',
  'Still comparing':  'differentiation angle',
  'Ready to buy':     'activation angle',
  'Need convincing':  'proof angle',
};

/* Witness — quiet sidebar that reflects what the visitor has typed,
   with a per-mission principle below. Mirrors the v4 mockup. */
type SectionId = 'mission' | 'audience' | 'oneliner';

function Witness({ activeSection }: { activeSection: SectionId }) {
  const { brief } = useBrief();

  const truncate = (s: string, n = 28) => s.length <= n ? s + '.' : s.slice(0, n).trim() + '…';

  // Each slot — always renders if has content. Active slot = full ink + cursor. Others = dimmed.
  const slots: { id: SectionId; text: string }[] = [];
  if (brief.mission) {
    const m = missions.find(x => x.id === brief.mission);
    if (m) slots.push({ id: 'mission', text: m.label + '.' });
  }
  if (brief.audienceText.trim()) {
    slots.push({ id: 'audience', text: truncate(brief.audienceText.split(/[,.;\n]/)[0].trim()) });
  }
  if (brief.offer.keyOffer.trim()) {
    slots.push({ id: 'oneliner', text: truncate(brief.offer.keyOffer.trim()) });
  }

  const principle = PRINCIPLES[(brief.mission ?? 'brand-film') as Mission] ?? ['Listening for direction.'];

  // If active section has no content yet, place cursor on it as ghost
  const activeHasContent = slots.some(s => s.id === activeSection);

  return (
    <aside className="hidden md:block">
      <div
        className="sticky top-24 border border-ink/15 p-5"
        style={{ backgroundColor: 'hsl(40 32% 97%)' }}
      >
        <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-ink/45 mb-4">
          Listening
        </p>
        <div className="font-mono text-[13px] leading-[1.7] mb-4 min-h-[88px]">
          {slots.length === 0 && !activeHasContent ? (
            <span className="text-ink/35 italic">
              —
              <motion.span
                animate={{ opacity: [1, 1, 0, 0] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'linear', times: [0, 0.5, 0.51, 1] }}
                className="inline-block ml-0.5 text-ink/45"
              >
                ▍
              </motion.span>
            </span>
          ) : (
            <>
              {slots.map(slot => {
                const isActive = slot.id === activeSection;
                return (
                  <motion.p
                    key={slot.id}
                    animate={{
                      opacity: isActive ? 1 : 0.25,
                      x: isActive ? 0 : -2,
                    }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className={isActive ? 'text-oxblood' : 'text-ink'}
                  >
                    {slot.text}
                    {isActive && (
                      <motion.span
                        animate={{ opacity: [1, 1, 0, 0] }}
                        transition={{ duration: 1.1, repeat: Infinity, ease: 'linear', times: [0, 0.5, 0.51, 1] }}
                        className="inline-block ml-0.5 text-oxblood"
                      >
                        ▍
                      </motion.span>
                    )}
                  </motion.p>
                );
              })}
              {!activeHasContent && (
                <motion.p
                  animate={{ opacity: 1 }}
                  className="text-ink/35 italic"
                >
                  …
                  <motion.span
                    animate={{ opacity: [1, 1, 0, 0] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: 'linear', times: [0, 0.5, 0.51, 1] }}
                    className="inline-block ml-0.5 text-ink/55"
                  >
                    ▍
                  </motion.span>
                </motion.p>
              )}
            </>
          )}
        </div>
        <div className="border-t border-ink/10 pt-3 space-y-3">
          <div>
            {principle.map((p, i) => (
              <p key={i} className="font-mono text-[11px] text-ink/55 leading-[1.6]">{p}</p>
            ))}
          </div>
          {brief.mission && (
            <div className="border-t border-ink/8 pt-3">
              <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-ink/40 mb-1.5">Pattern</p>
              <p className="font-mono text-[11px] text-ink/65 leading-[1.5]">
                Reading: {MISSION_PATTERN[brief.mission as Mission]}.
              </p>
              {AUDIENCE_ANGLE[brief.audienceText] && (
                <p className="font-mono text-[11px] text-ink/65 leading-[1.5]">
                  Angle: {AUDIENCE_ANGLE[brief.audienceText]}.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default function PhaseMission() {
  const { brief, updateBrief, updateOffer } = useBrief();

  // ─── Section tracking: scroll-based — find section whose center is nearest viewport-center ───
  const [activeSection, setActiveSection] = useState<SectionId>('mission');
  const sectionARef = useRef<HTMLElement | null>(null);
  const sectionBRef = useRef<HTMLElement | null>(null);
  const sectionCRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const compute = () => {
      const probeY = window.innerHeight * 0.35; // upper-third of viewport feels right
      const sections: { id: SectionId; el: HTMLElement | null }[] = [
        { id: 'mission', el: sectionARef.current },
        { id: 'audience', el: sectionBRef.current },
        { id: 'oneliner', el: sectionCRef.current },
      ];
      // Pick the LAST section whose top is above the probe line (i.e., reading position)
      let active: SectionId = 'mission';
      sections.forEach(s => {
        if (!s.el) return;
        const top = s.el.getBoundingClientRect().top;
        if (top <= probeY) active = s.id;
      });
      setActiveSection(active);
    };
    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(compute);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    const initTimer = setTimeout(compute, 100);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(rafId);
      clearTimeout(initTimer);
    };
  }, []);

  // ─── Audience: chip-select 1 of 5 plain archetypes + custom escape ───
  const AUDIENCE_CHIPS: { label: string; explainer: string }[] = [
    { label: 'New to you',         explainer: "They don't know your brand yet. The work has to introduce, not assume." },
    { label: 'Already with you',   explainer: 'They trust you. Skip the basics — build on the relationship.' },
    { label: 'Still comparing',    explainer: "They're cross-shopping. Show what makes you different, not better." },
    { label: 'Ready to buy',       explainer: 'Already convinced. They need a final push, not a sales pitch.' },
    { label: 'Need convincing',    explainer: 'Skeptical. Remove the doubt before you ever try to sell.' },
  ];
  const audLabels = AUDIENCE_CHIPS.map(c => c.label);
  const isCustom = brief.audienceText.length > 0 && !audLabels.includes(brief.audienceText);
  const [audCustomOpen, setAudCustomOpen] = useState(isCustom);

  // Match cases based on mission + audience text
  const matchedCases = useMemo(
    () => matchForMission(brief.mission, brief.audienceText),
    [brief.mission, brief.audienceText]
  );

  const hasExploreContent = matchedCases.length > 0 && (brief.mission || brief.audienceText.trim());

  return (
    <div className="grid md:grid-cols-[1fr_240px] gap-x-10 lg:gap-x-14">
      <div className="space-y-12">
      {/* Section A: Mission Select */}
      <section ref={sectionARef as React.RefObject<HTMLElement>}>
        <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ink/50 mb-3">A · Type</p>
        <h2 className="font-display italic text-3xl md:text-4xl text-ink mb-2 leading-tight">What are you making?</h2>
        <p className="text-ink/55 text-sm mb-8 max-w-lg leading-relaxed">
          Pick the closest. We sharpen on the call.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {missions.map(m => (
            <motion.button
              key={m.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => updateBrief({ mission: m.id as Mission })}
              className={`text-left p-5 border transition-all duration-300 ${
                brief.mission === m.id
                  ? 'border-oxblood bg-oxblood/8 text-ink'
                  : 'border-ink/15 bg-white/40 text-ink hover:border-ink/40 hover:bg-white/70'
              }`}
            >
              <span className="font-display italic text-base text-ink">{m.label}</span>
              <p className={`text-xs mt-2 leading-relaxed ${brief.mission === m.id ? 'text-ink/75' : 'text-ink/55'}`}>
                {m.description}
              </p>
              <p className={`font-mono text-[10px] tracking-wide mt-3 ${brief.mission === m.id ? 'text-ink/55' : 'text-ink/30'}`}>
                e.g. {m.starterDeliverables.slice(0, 2).join(' · ')}
              </p>
            </motion.button>
          ))}
        </div>
      </section>

      <div className="h-px bg-ink/10" />

      {/* Section B: Audience — single chip-select, plain English (no jargon) */}
      <section ref={sectionBRef as React.RefObject<HTMLElement>}>
        <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ink/50 mb-3">B · Audience</p>
        <h2 className="font-display italic text-2xl md:text-3xl text-ink mb-2 leading-tight">Who's it for?</h2>
        <p className="text-ink/55 text-sm mb-6 max-w-lg leading-relaxed">
          Pick one. We sharpen on the call.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl mb-3">
          {(brief.mission ? AUDIENCE_BY_MISSION[brief.mission as Mission].map(label => AUDIENCE_CHIPS.find(c => c.label === label)!).filter(Boolean) : AUDIENCE_CHIPS).map(chip => {
            const isActive = brief.audienceText === chip.label;
            return (
              <button
                key={chip.label}
                type="button"
                onClick={() => { updateBrief({ audienceText: chip.label }); setAudCustomOpen(false); }}
                className={`text-left p-4 border transition-colors group ${
                  isActive
                    ? 'border-oxblood bg-oxblood/8'
                    : 'border-ink/15 bg-white/60 hover:border-ink/45 hover:bg-white/90'
                }`}
              >
                <p className={`text-sm font-medium mb-1.5 ${isActive ? 'text-ink' : 'text-ink/85'}`}>
                  {chip.label}
                </p>
                <p className={`text-xs leading-relaxed ${isActive ? 'text-ink/70' : 'text-ink/55'}`}>
                  {chip.explainer}
                </p>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => { setAudCustomOpen(true); if (!isCustom) updateBrief({ audienceText: '' }); }}
            className={`text-left p-4 border transition-colors ${
              audCustomOpen || isCustom
                ? 'border-oxblood bg-oxblood/8'
                : 'border-ink/15 bg-white/60 hover:border-ink/45 hover:bg-white/90'
            }`}
          >
            <p className={`text-sm font-medium mb-1.5 ${(audCustomOpen || isCustom) ? 'text-ink' : 'text-ink/85'}`}>
              Other…
            </p>
            <p className={`text-xs leading-relaxed ${(audCustomOpen || isCustom) ? 'text-ink/70' : 'text-ink/55'}`}>
              Describe in your own words. We listen for the texture.
            </p>
          </button>
        </div>

        {(audCustomOpen || isCustom) && (
          <input
            type="text"
            value={isCustom ? brief.audienceText : ''}
            onChange={e => updateBrief({ audienceText: e.target.value })}
            maxLength={100}
            placeholder="Describe your audience in your own words"
            autoFocus={audCustomOpen && !isCustom}
            className="w-full max-w-xl bg-white/60 border border-ink/15 px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-oxblood transition-colors"
          />
        )}
      </section>

      <div className="h-px bg-bone/10" />

      {/* Section C: One-liner — starter cards (click-to-fill) + input */}
      <section ref={sectionCRef as React.RefObject<HTMLElement>}>
        <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ink/50 mb-3">C · The line</p>
        <h2 className="font-display italic text-2xl md:text-3xl text-ink mb-2 leading-tight">Describe the project.</h2>
        <p className="text-ink/55 text-sm mb-6 max-w-lg leading-relaxed">
          If a director read only this line, what would they need to know?
        </p>

        {/* Starter patterns — click to fill input */}
        <div className="space-y-2 max-w-2xl mb-4">
          {pickExamples(brief.mission, brief.audienceText).map(({ line, tag }) => {
            const isActive = brief.offer.keyOffer === line;
            return (
              <button
                key={line}
                type="button"
                onClick={() => updateOffer({ keyOffer: line })}
                className={`w-full text-left p-4 border transition-colors group ${
                  isActive
                    ? 'border-oxblood bg-oxblood/8'
                    : 'border-ink/15 bg-white/60 hover:border-ink/45 hover:bg-white/90'
                }`}
              >
                <p className={`font-display italic text-base leading-snug mb-1.5 ${isActive ? 'text-ink' : 'text-ink/85'}`}>
                  &ldquo;{line}&rdquo;
                </p>
                <p className={`font-mono text-[10px] tracking-[0.18em] uppercase leading-relaxed ${isActive ? 'text-ink/65' : 'text-ink/45'}`}>
                  — {tag}
                </p>
              </button>
            );
          })}
        </div>

        <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-ink/45 mb-2">or write your own</p>
        <input
          type="text"
          maxLength={120}
          value={brief.offer.keyOffer}
          onChange={e => updateOffer({ keyOffer: e.target.value })}
          placeholder="A 60-second hero film for buyers who want certainty before they commit."
          className="w-full max-w-2xl bg-white/60 border border-ink/15 px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-oxblood transition-colors"
        />
        <span className="font-mono text-[10px] text-ink/40 mt-2 block tracking-wide">
          {brief.offer.keyOffer.length} / 120
        </span>
      </section>

      {/* ─── Explore While Briefing ─── */}
      <AnimatePresence>
        {hasExploreContent && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-8 border-t border-ink/10">
              <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ink/50 mb-5">
                We've done something similar
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {matchedCases.map(mc => (
                  <ExploreCard
                    key={mc.caseStudy.id}
                    caseStudy={mc.caseStudy}
                    matchReason={mc.matchReason}
                  />
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      </div>
      <Witness activeSection={activeSection} />
    </div>
  );
}
