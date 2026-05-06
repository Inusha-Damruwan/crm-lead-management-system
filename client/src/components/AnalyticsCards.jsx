import React from 'react';
import StatCard from './StatCard';
import { motion } from 'framer-motion';

const AnalyticsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <StatCard title="Total Leads" value={stats.totalLeads} gradient="from-blue-500 to-indigo-600" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <StatCard title="Deal Value (LKR)" value={stats.totalDealValue || 0} gradient="from-green-500 to-emerald-500" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <StatCard title="Conversion" value={stats.totalLeads > 0 ? Math.round((stats.wonLeads / stats.totalLeads) * 100) : 0} gradient="from-purple-500 to-pink-500" />
      </motion.div>
    </div>
  );
};

export default AnalyticsCards;
