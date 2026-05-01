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
          className="aspect-[4/3] overflow-hidden mb-4 border border-border group-hover:border-foreground transition-colors duration-300 relative"
          style={{ background: c.gradient }}
        >
          {c.thumbnail && (
            <img
              src={c.thumbnail}
              alt={c.title}
              className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500"
            />
          )}
          <div className="w-full h-full flex items-end p-5 relative z-10 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
            <span className="font-display text-base tracking-wide uppercase" style={{ color: 'hsl(0 0% 95%)' }}>
              {c.title}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-[10px] font-medium tracking-widest uppercase bg-primary text-primary-foreground px-3 py-1">{c.goal}</span>
          <span className="text-[10px] font-medium tracking-widest uppercase border border-border px-3 py-1">{c.industry}</span>
          <span className="text-[10px] font-medium tracking-widest uppercase border border-border px-3 py-1">{c.outputs[0]}</span>
        </div>
      </Link>
    </motion.div>
  );
}
