import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({ icon: Icon, title, description, action = null }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 px-4"
    >
      {Icon && (
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <Icon className="mb-4 h-16 w-16 text-gray-400" />
        </motion.div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mb-4 text-gray-600">{description}</p>
      {action}
    </motion.div>
  );
};

export default EmptyState;
