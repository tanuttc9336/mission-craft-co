import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import craftedBg from '@/assets/crafted-by-human-bg.jpg';

const philosophyItems = [
  {
    id: 'human-work',
    title: 'Human work.',
    body: 'We believe the best creative work is still human work.\nNot slower work. Not messier work. Not chaos dressed up as artistry.\nHuman work.',
  },
  {
    id: 'idea-starts-here',
    title: 'The idea still starts here.',
    body: 'The ideas still come from people.\nTaste still comes from people.\nJudgment still comes from people.\nSo does restraint. So does timing. So does craft.',
  },
  {
    id: 'removes-drag',
    title: 'Technology removes the drag.',
    body: 'What technology does well is remove friction.\nIt helps us move faster, think cleaner, organize better, and protect energy for the part that matters most.',
  },
  {
    id: 'more-room',
    title: 'More room for real creativity.',
    body: 'We use systems.\nWe use automation.\nWe use AI.\nNot to replace creativity.\nTo give it more room.',
  },
  {
    id: 'human-standard',
    title: 'Modern tools. Human standard.',
    body: 'Every piece we deliver is shaped by human eyes, human skill, and human care.\nThat is not old-fashioned.\nThat is the point.',
  },
];

export default function CraftedByHumanSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={craftedBg}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-primary/85" />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          {/* Section label */}
          <p className="text-xs font-medium text-primary-foreground/50 mb-8 tracking-[0.3em] uppercase">
            Our Philosophy
          </p>

          {/* Headline */}
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-primary-foreground mb-6 tracking-tighter leading-[0.95]">
            Crafted by Human
          </h2>

          {/* Intro */}
          <p className="text-sm md:text-base text-primary-foreground/60 max-w-xl mb-16 leading-relaxed font-body">
            We believe the best creative work is still human work.
            <br />
            Technology helps us move faster, think cleaner, and protect more energy for the part that matters most: making work people can actually feel.
          </p>

          {/* Accordion */}
          <Accordion
            type="single"
            collapsible
            defaultValue="human-work"
            className="w-full"
          >
            {philosophyItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <AccordionItem
                  value={item.id}
                  className="border-primary-foreground/10"
                >
                  <AccordionTrigger className="text-primary-foreground font-display text-lg md:text-xl tracking-tight py-6 hover:no-underline hover:text-highlight [&>svg]:text-primary-foreground/40 [&>svg]:h-5 [&>svg]:w-5">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-primary-foreground/55 text-sm md:text-base leading-relaxed pb-6 font-body whitespace-pre-line">
                    {item.body}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>

          {/* Closing line + CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            <p className="text-xs text-primary-foreground/30 tracking-[0.2em] uppercase font-medium">
              Modern tools. Human standard.
            </p>
            <Button
              variant="heroOutline"
              size="lg"
              asChild
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link to="/work">
                See How We Work <ArrowRight size={14} />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
