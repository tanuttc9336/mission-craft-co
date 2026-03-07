import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/utils/analytics';
import type { FeedbackCategory } from '@/types/portal';

const categories: { value: FeedbackCategory; label: string }[] = [
  { value: 'message', label: 'Message / Copy' },
  { value: 'pacing', label: 'Pacing' },
  { value: 'visual', label: 'Visual' },
  { value: 'brand-alignment', label: 'Brand Fit' },
  { value: 'factual-corrections', label: 'Factual' },
  { value: 'cta-clarity', label: 'CTA / Clarity' },
  { value: 'other', label: 'Other' },
];

interface FeedbackFormProps {
  reviewItemId: string;
  onSubmit: (data: { categories: FeedbackCategory[]; notes: string; isDirectional: boolean }) => void;
}

export default function FeedbackForm({ reviewItemId, onSubmit }: FeedbackFormProps) {
  const [selected, setSelected] = useState<FeedbackCategory[]>([]);
  const [notes, setNotes] = useState('');
  const [isDirectional, setIsDirectional] = useState(false);

  const toggleCategory = (cat: FeedbackCategory) => {
    setSelected(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const handleSubmit = () => {
    if (!notes.trim()) return;
    trackEvent('portal_submit_feedback');
    onSubmit({ categories: selected, notes, isDirectional });
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs text-muted-foreground tracking-wide uppercase mb-3">What does your feedback relate to?</p>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => toggleCategory(cat.value)}
              className={cn(
                "px-3 py-1.5 text-[10px] tracking-wider uppercase border transition-colors",
                selected.includes(cat.value)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-foreground"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground tracking-wide uppercase mb-2">Consolidated feedback</p>
        <Textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Please consolidate all feedback here. Be specific about what to keep, change, or adjust."
          className="min-h-[120px] text-sm bg-background border-border"
        />
      </div>

      <div>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={isDirectional}
            onChange={e => setIsDirectional(e.target.checked)}
            className="mt-1"
          />
          <div>
            <p className="text-xs font-medium">This may be a broader directional change</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Not just a small refinement — this could affect the creative direction or scope.
            </p>
          </div>
        </label>
        {isDirectional && (
          <div className="mt-3 p-3 bg-secondary border border-border">
            <p className="text-[10px] text-muted-foreground">
              This request may affect scope. We'll review and confirm next steps before proceeding.
            </p>
          </div>
        )}
      </div>

      <Button onClick={handleSubmit} disabled={!notes.trim()} variant="default" className="w-full">
        Submit Feedback
      </Button>
    </div>
  );
}
