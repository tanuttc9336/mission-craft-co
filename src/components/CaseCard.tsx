import { CaseStudy } from '@/types/brief';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CaseCard({ case: c, index = 0 }: { case: CaseStudy; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Link to={`/work/${c.id}`} className="group block">
        <div
          className="aspect-[4/3] rounded-lg overflow-hidden mb-4 shadow-card group-hover:shadow-elevated transition-shadow duration-300"
          style={{ background: c.gradient }}
        >
          <div className="w-full h-full flex items-end p-5">
            <span className="font-display text-lg" style={{ color: 'hsl(0 0% 95%)' }}>
              {c.title}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-medium bg-secondary text-secondary-foreground px-3 py-1 rounded-full">{c.goal}</span>
          <span className="text-xs font-medium bg-secondary text-secondary-foreground px-3 py-1 rounded-full">{c.industry}</span>
          <span className="text-xs font-medium bg-secondary text-secondary-foreground px-3 py-1 rounded-full">{c.outputs[0]}</span>
        </div>
      </Link>
    </motion.div>
  );
}
