import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, gradient = false, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -4 } : {}}
      className={`rounded-2xl bg-white shadow-lg transition duration-300 ${
        gradient ? 'bg-gradient-to-br from-blue-50 to-indigo-50' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
