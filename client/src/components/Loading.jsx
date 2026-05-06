import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ fullPage = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const spinner = (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      className={`rounded-full border-4 border-blue-200 border-t-blue-600 ${sizeClasses[size]}`}
    />
  );

  if (fullPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          {spinner}
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <div className="flex items-center justify-center py-8">{spinner}</div>;
};

export default Loading;
