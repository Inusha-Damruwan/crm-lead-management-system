import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Calendar } from 'lucide-react';
import { leadsAPI } from '../api';
import { formatCurrencyLKR } from '../utils/currency';

const DashboardHeader = () => {
  const [date, setDate] = useState(new Date());
  const [greeting, setGreeting] = useState('Good Morning');
  const [stats, setStats] = useState(null);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await leadsAPI.getDashboardStats();
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      }
    };

    fetchStats();
  }, []);

  // Update date and greeting every minute
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setDate(now);

      const hour = now.getHours();
      if (hour < 12) {
        setGreeting('Good Morning');
      } else if (hour < 18) {
        setGreeting('Good Afternoon');
      } else {
        setGreeting('Good Evening');
      }
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative mb-6"
    >
      {/* Gradient Background Glow */}
      <motion.div
        className="absolute -top-40 right-0 w-80 h-80 bg-gradient-to-br from-blue-400/10 via-purple-400/5 to-transparent rounded-full blur-3xl -z-10"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Main Header Container - Minimal and Clean */}
      <div className="relative backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-5 md:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        {/* Gradient Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-transparent rounded-2xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300" />

        <div className="relative z-10">
          {/* Header Content - Single Clean Row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
            {/* Left Side - Icon, Title and Greeting */}
            <div className="flex items-start gap-4 flex-1 min-w-0">
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 400 }}
                className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex-shrink-0"
              >
                <LayoutDashboard className="h-6 w-6 text-white" />
              </motion.div>

              {/* Title and Greeting */}
              <div className="flex-1 min-w-0 space-y-2">
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.4 }}
                  className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight"
                >
                  Dashboard
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16, duration: 0.4 }}
                  className="text-sm md:text-base text-gray-600 leading-snug"
                >
                  {greeting}! {stats ? `You have ${stats.totalLeads || 0} leads and ${formatCurrencyLKR(stats.totalDealValue || 0)} in deal value.` : 'Loading your data...'}
                </motion.p>
              </div>
            </div>

            {/* Right Side - Date */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18, duration: 0.4 }}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-50/50 rounded-lg border border-gray-200/50 w-fit flex-shrink-0"
            >
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{formattedDate}</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-8 right-8 h-20 w-20 bg-purple-400/10 rounded-full blur-2xl -z-10 hidden lg:block"
      />
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute bottom-0 left-12 h-16 w-16 bg-blue-400/10 rounded-full blur-2xl -z-10 hidden lg:block"
      />
    </motion.div>
  );
};

export default DashboardHeader;

