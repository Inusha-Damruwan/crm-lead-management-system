import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';

const ChartsSection = ({ data }) => {
  // data: { revenue: [], leads: [], conversion: [] }
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="col-span-1 rounded-2xl bg-white p-4 shadow">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Revenue</h4>
        <div style={{ height: 160 }}>
          <ResponsiveContainer>
            <AreaChart data={data.revenue}>
              <defs>
                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#gradRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="col-span-1 rounded-2xl bg-white p-4 shadow">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Leads Growth</h4>
        <div style={{ height: 160 }}>
          <ResponsiveContainer>
            <LineChart data={data.leads}>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="col-span-1 rounded-2xl bg-white p-4 shadow">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Conversion Rate</h4>
        <div style={{ height: 160 }}>
          <ResponsiveContainer>
            <BarChart data={data.conversion}>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" opacity={0.05} />
              <Bar dataKey="value" fill="#06b6d4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default ChartsSection;
