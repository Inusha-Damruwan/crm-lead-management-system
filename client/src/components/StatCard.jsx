import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const StatCard = ({
  title,
  value,
  icon: Icon,
  gradient = 'from-blue-500 to-indigo-600',
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const start = Date.now();
    const numericValue = typeof value === 'number' ? value : parseInt(value, 10) || 0;

    const interval = setInterval(() => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      setDisplayValue(Math.floor(numericValue * progress));

      if (progress === 1) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className={`group relative h-[110px] overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-5 text-white shadow-lg border border-white/10`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-white/85" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.18)' }}>
            {title}
          </p>
          <motion.p
            className="mt-2 text-4xl font-extrabold tracking-tight leading-none text-white/95"
            style={{ textShadow: '0 8px 18px rgba(0,0,0,0.18)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {displayValue.toLocaleString()}
          </motion.p>
        </div>

        {Icon && (
          <motion.div
            whileHover={{ scale: 1.08, rotate: 4 }}
            transition={{ type: 'spring', stiffness: 260, damping: 14 }}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-lg ring-1 ring-white/15"
          >
            <Icon className="h-6 w-6 text-white/95" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;