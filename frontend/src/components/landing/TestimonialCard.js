import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const TestimonialCard = ({ quote, name, role, avatar, index = 0 }) => (
  <motion.article
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
    whileHover={{ y: -4, transition: { duration: 0.25 } }}
    className="premium-card glow-border-hover group h-full"
  >
    <Quote size={28} className="mb-4 text-white/15 transition-colors duration-500 group-hover:text-[#84ffd8]/30" />
    <p className="text-base leading-8 text-white/70">"{quote}"</p>
    <div className="mt-8 flex items-center gap-4 border-t border-white/8 pt-6">
      <img 
        src={avatar} 
        alt={name} 
        className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10 transition-all duration-300 group-hover:ring-white/25" 
      />
      <div>
        <p className="font-bold text-white">{name}</p>
        <p className="text-sm text-white/50">{role}</p>
      </div>
    </div>
  </motion.article>
);

export default TestimonialCard;
