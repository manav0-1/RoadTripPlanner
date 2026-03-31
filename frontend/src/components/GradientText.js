import React from 'react';
import { motion } from 'framer-motion';

const GradientText = ({ children, className = '', as: Tag = 'span' }) => (
  <Tag className={`gradient-text-animated ${className}`}>
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      style={{ display: 'inline' }}
    >
      {children}
    </motion.span>
  </Tag>
);

export default GradientText;
