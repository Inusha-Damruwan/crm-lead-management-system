import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Select = ({ label, error, options = [], ...props }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      {label && <label className="mb-2 block text-sm font-semibold text-gray-700">{label}</label>}
      <div className="relative">
        <select
          className={`w-full appearance-none rounded-xl border-2 px-4 py-2.5 pr-10 transition duration-300 focus:outline-none focus:ring-0 ${
            error ? 'border-red-500 focus:border-red-500' : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
          }`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </motion.div>
  );
};

export default Select;
