import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Calendar,
  LayoutDashboard,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react';
import { leadsAPI } from '../api';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { formatCurrencyLKR } from '../utils/currency';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await leadsAPI.getDashboardStats();
        const payload = response?.data?.stats || response?.data || response || {};
        setStats(payload);
        setError('');
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
        setError('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const timeInColombo = useMemo(() => {
    const parts = new Intl.DateTimeFormat('en-LK', {
      timeZone: 'Asia/Colombo',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }).formatToParts(date);

    const hour = Number(parts.find((part) => part.type === 'hour')?.value || 0);
    const minute = Number(parts.find((part) => part.type === 'minute')?.value || 0);

    return { hour, minute };
  }, [date]);

  const greeting = useMemo(() => {
    const hour = timeInColombo.hour;
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 20) return 'Good Evening';
    return 'Good Night';
  }, [timeInColombo]);

  const formattedDate = useMemo(
    () =>
      new Intl.DateTimeFormat('en-LK', {
        timeZone: 'Asia/Colombo',
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date),
    [date]
  );

  const formattedTime = useMemo(
    () =>
      new Intl.DateTimeFormat('en-LK', {
        timeZone: 'Asia/Colombo',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(date),
    [date]
  );

  const totalLeads = stats?.totalLeads || 0;
  const totalDealValue = stats?.totalDealValue || 0;
  const wonDealValue = stats?.wonDealValue || 0;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar />

      <main className="flex-1 lg:ml-[220px] ml-0 p-5">
        <div className="mx-auto w-full max-w-[1600px] space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="bg-white rounded-3xl p-5 shadow-lg border border-slate-100"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4 min-w-0">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
                  <LayoutDashboard className="h-6 w-6 text-white" />
                </div>

                <div className="min-w-0">
                  <h1 className="text-4xl font-extrabold tracking-tight text-blue-600">
                    Dashboard
                  </h1>
                  <p className="mt-1 text-base font-medium text-slate-600 leading-relaxed">
                    {greeting}! You have {totalLeads} leads and {formatCurrencyLKR(totalDealValue)} in deal value.
                  </p>
                </div>
              </div>

              <div className="flex-shrink-0 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 shadow-sm">
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-medium">{formattedDate}</span>
                    <span className="text-xs text-slate-500">{formattedTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {loading && <div className="text-sm text-slate-600">Loading...</div>}
          {error && <div className="text-sm text-red-500">{error}</div>}

          {stats && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-5"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <motion.div variants={itemVariants}>
                  <StatCard
                    title="Total Leads"
                    value={stats.totalLeads || 0}
                    icon={Users}
                    gradient="from-blue-500 to-indigo-600"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <StatCard
                    title="New Leads"
                    value={stats.newLeads || 0}
                    icon={Zap}
                    gradient="from-green-500 to-emerald-500"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <StatCard
                    title="Qualified"
                    value={stats.qualifiedLeads || 0}
                    icon={Target}
                    gradient="from-orange-500 to-amber-500"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <StatCard
                    title="Won Deals"
                    value={stats.wonLeads || 0}
                    icon={Award}
                    gradient="from-pink-500 to-purple-500"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <StatCard
                    title="Lost Deals"
                    value={stats.lostLeads || 0}
                    icon={TrendingUp}
                    gradient="from-red-500 to-rose-500"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <StatCard
                    title="Contacted"
                    value={stats.contactedLeads || 0}
                    icon={UserCheck}
                    gradient="from-indigo-500 to-blue-500"
                  />
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <motion.div variants={itemVariants}>
                  <div className="h-[140px] rounded-3xl bg-white p-5 shadow-lg border border-slate-100 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-500">Total Deal Value</p>
                        <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-600">
                          {formatCurrencyLKR(totalDealValue)}
                        </h2>
                        <p className="mt-2 text-sm text-slate-400">Across all active and closed deals</p>
                      </div>

                      <div className="flex h-12 min-w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 shadow-sm px-2">
                        <span className="text-xs font-bold tracking-wide">LKR</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div className="h-[140px] rounded-3xl bg-white p-5 shadow-lg border border-slate-100 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-500">Won Deal Value</p>
                        <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-600">
                          {formatCurrencyLKR(wonDealValue)}
                        </h2>
                        <p className="mt-2 text-sm text-slate-400">Successfully closed value</p>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm">
                        <TrendingUp className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div variants={itemVariants}>
                <div className="rounded-3xl bg-white p-5 shadow-lg border border-slate-100">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">Quick Stats</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <MiniStatCard
                      label="Conversion Rate"
                      value={totalLeads > 0 ? `${Math.round((stats.wonLeads / totalLeads) * 100)}%` : '0%'}
                    />
                    <MiniStatCard label="New This Month" value={stats.newLeads || 0} />
                    <MiniStatCard
                      label="Avg Deal Value (LKR)"
                      value={totalLeads > 0 ? formatCurrencyLKR(Math.round(totalDealValue / totalLeads)) : formatCurrencyLKR(0)}
                    />
                    <MiniStatCard
                      label="Success Rate"
                      value={totalLeads > 0 ? `${Math.round(((stats.wonLeads + stats.qualifiedLeads) / totalLeads) * 100)}%` : '0%'}
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

const MiniStatCard = ({ label, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4, scale: 1.01 }}
    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    className="rounded-2xl bg-slate-50 p-4 text-center shadow-sm border border-slate-100"
  >
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <p className="mt-2 text-2xl font-bold tracking-tight text-slate-600 leading-tight">{value}</p>
  </motion.div>
);

export default Dashboard;
