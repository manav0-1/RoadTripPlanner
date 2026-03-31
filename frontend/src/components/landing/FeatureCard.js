import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, index = 0 }) => (
  <motion.article
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
    whileHover={{ y: -6, transition: { duration: 0.25 } }}
    className="premium-card glow-border-hover group h-full"
  >
    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-white transition-all duration-500 group-hover:border-white/20 group-hover:shadow-[0_0_20px_rgba(132,255,216,0.15)]">
      <Icon size={20} strokeWidth={2.2} className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
    </div>
    <h3 className="text-xl font-bold tracking-[-0.03em] text-white">{title}</h3>
    <p className="mt-3 text-sm leading-7 text-white/60">{description}</p>
  </motion.article>
);

export default FeatureCard;
