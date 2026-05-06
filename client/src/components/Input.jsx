import React from 'react';
import { motion } from 'framer-motion';

const Input = ({ label, error, icon: Icon, ...props }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      {label && <label className="mb-2 block text-sm font-semibold text-gray-700">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />}
        <input
          className={`w-full rounded-xl border-2 transition duration-300 ${
            Icon ? 'pl-10' : 'px-4'
          } py-2.5 focus:border-blue-500 focus:outline-none focus:ring-0 ${
            error ? 'border-red-500 focus:border-red-500' : 'border-gray-200 hover:border-gray-300'
          }`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </motion.div>
  );
};

export default Input;
