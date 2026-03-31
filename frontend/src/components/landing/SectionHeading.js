import React from 'react';
import { motion } from 'framer-motion';

const SectionHeading = ({ eyebrow, title, description, align = 'left' }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.35 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'}
  >
    {eyebrow && <p className="hero-chip">{eyebrow}</p>}
    <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">{title}</h2>
    {description && <p className="mt-4 text-lg leading-8 text-white/60">{description}</p>}
  </motion.div>
);

export default SectionHeading;
