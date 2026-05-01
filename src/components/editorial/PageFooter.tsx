import { LineReveal } from './LineReveal';
import { MetaLabel } from './MetaLabel';

/**
 * PageFooter — editorial end marker shared across every page.
 *
 * - Optional tagline (serif italic pull-quote)
 * - Meta strip: left = location/year, right = "End of reel" marker
 * - Matches Section 04 treatment on Home
 */
export function PageFooter({
  tagline,
  marker = 'End of reel',
  meta,
  className = '',
}: {
  tagline?: React.ReactNode;
  marker?: React.ReactNode;
  meta?: { left?: React.ReactNode; right?: React.ReactNode };
  className?: string;
}) {
  return (
    <footer
      className={`relative border-t border-bone/10 px-6 md:px-20 pt-16 md:pt-24 pb-14 md:pb-20 ${className}`}
    >
      <div className="max-w-[1600px] mx-auto w-full">
        {tagline && (
          <div className="mb-16 md:mb-24 max-w-4xl">
            <LineReveal asView>
              <p
                className="font-serif text-bone/80 italic leading-[1.18] tracking-[-0.01em]"
                style={{ fontSize: 'clamp(24px, 3.4vw, 52px)' }}
              >
                {tagline}
              </p>
            </LineReveal>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <MetaLabel variant="quiet">
              {meta?.left ?? (
                <>
                  Bangkok <span className="text-bone/15">|</span> Est. 2568
                </>
              )}
            </MetaLabel>
          </div>

          <MetaLabel variant="ghost" className="tracking-[0.26em]">
            {meta?.right ?? marker}
          </MetaLabel>
        </div>
      </div>
    </footer>
  );
}
