import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import type { CaseStudy } from '@/types/brief';

interface ExploreCardProps {
  caseStudy: CaseStudy;
  matchReason: string;
}

export default function ExploreCard({ caseStudy, matchReason }: ExploreCardProps) {
  const videoId = caseStudy.videoIds?.[0];
  const thumbUrl = videoId
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    : caseStudy.thumbnail;

  return (
    <motion.a
      href={caseStudy.videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4 p-4 border border-border bg-background hover:border-foreground/40 transition-all group cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative w-28 h-20 flex-shrink-0 overflow-hidden bg-secondary">
        <img
          src={thumbUrl}
          alt={caseStudy.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
          <Play size={20} className="text-white" />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{caseStudy.title}</p>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {caseStudy.industry} · {caseStudy.goal}
        </p>
        <p className="text-[10px] text-muted-foreground/60 mt-1.5 tracking-wide uppercase">
          {matchReason}
        </p>
      </div>
    </motion.a>
  );
}
