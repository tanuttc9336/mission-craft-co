/**
 * Chapter — editorial chapter label.
 * e.g. `01 — Intro`, `02 — Selected Work`.
 * Sits at the top of every EditorialSection.
 */
export function Chapter({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase text-bone/55">
      <span className="font-mono">{index}</span>
      <span className="w-6 h-[1px] bg-bone/30" />
      <span>{label}</span>
    </div>
  );
}
