import React from 'react';
import { motion } from 'framer-motion';

const RecentActivity = ({ items = [] }) => {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white p-4 shadow">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent Activity</h4>
        <ul className="space-y-3">
          {items.length === 0 && <li className="text-sm text-gray-500">No recent activity</li>}
          {items.map((it, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700">{it.initials}</div>
              <div>
                <div className="text-sm font-medium">{it.title}</div>
                <div className="text-xs text-gray-500">{it.subtitle}</div>
              </div>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white p-4 shadow">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Top Opportunities</h4>
        <div className="space-y-3">
          {items.slice(0, 5).map((it, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{it.title}</div>
                <div className="text-xs text-gray-500">{it.subtitle}</div>
              </div>
              <div className="text-sm font-semibold text-gray-800">${it.value || '0'}</div>
            </div>
          ))}
          {items.length === 0 && <div className="text-sm text-gray-500">No opportunities</div>}
        </div>
      </motion.div>
    </div>
  );
};

export default RecentActivity;
