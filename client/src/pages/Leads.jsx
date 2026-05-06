import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, RotateCcw, Edit, Trash2, Eye, Users } from 'lucide-react';
import { authAPI, leadsAPI } from '../api';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import SuccessModal from '../components/SuccessModal';
import { formatCurrencyLKR } from '../utils/currency';

const statusBadgeVariants = {
  New: 'blue',
  Contacted: 'purple',
  Qualified: 'yellow',
  'Proposal Sent': 'indigo',
  Won: 'green',
  Lost: 'red',
};

const Leads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [assignedFilter, setAssignedFilter] = useState('');
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await authAPI.getUsers();
        setUsers(response.data);
      } catch (err) {
        console.error('Failed to load users:', err);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [search, statusFilter, sourceFilter, assignedFilter]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (search) filters.search = search;
      if (statusFilter) filters.status = statusFilter;
      if (sourceFilter) filters.source = sourceFilter;
      if (assignedFilter) filters.assignedTo = assignedFilter;

      const response = await leadsAPI.getAll(filters);
      setLeads(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to load leads:', err);
      setError('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!leadToDelete) return;
    try {
      setDeleting(true);
      await leadsAPI.delete(leadToDelete);
      setLeads((currentLeads) => currentLeads.filter((lead) => lead._id !== leadToDelete));
      setLeadToDelete(null);
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Delete failed:', err);
      setError(err.response?.data?.message || 'Failed to delete lead');
    } finally {
      setDeleting(false);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setSourceFilter('');
    setAssignedFilter('');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Sidebar />

      <div className="flex-1 ml-64 overflow-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="p-8 pb-0">
          <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-lg backdrop-blur-sm md:p-7">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-blue-400/15 blur-3xl" />
              <div className="absolute -bottom-20 left-16 h-52 w-52 rounded-full bg-indigo-400/15 blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_45%)]" />
              <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(100,116,139,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.4)_1px,transparent_1px)] [background-size:24px_24px]" />
            </div>

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <motion.div
                  animate={{ boxShadow: ['0 8px 24px rgba(37,99,235,0.25)', '0 10px 30px rgba(79,70,229,0.32)', '0 8px 24px rgba(37,99,235,0.25)'] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
                  <Users className="relative h-7 w-7 text-white" />
                </motion.div>

                <div className="min-w-0">
                  <h1 className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl">
                    Leads
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-slate-600 md:text-base">
                    Manage and track all your sales leads in one premium workspace.
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                <div className="inline-flex items-center justify-center rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
                  {leads.length} Active Leads
                </div>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/leads/new')}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-indigo-700"
                >
                  <Plus className="h-5 w-5" />
                  New Lead
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div className="p-8" variants={containerVariants} initial="hidden" animate="visible">
          {error && (
            <motion.div variants={itemVariants} className="mb-6 rounded-2xl border-l-4 border-red-500 bg-red-50 p-4 text-red-700">
              {error}
            </motion.div>
          )}

          {/* Filters Card */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-white to-gray-50 p-6 mb-6">
              <h3 className="mb-4 text-lg font-bold text-gray-900">Search & Filter</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 pl-10 py-2.5 transition focus:border-blue-500 focus:outline-none hover:border-gray-300"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 transition focus:border-blue-500 focus:outline-none hover:border-gray-300"
                >
                  <option value="">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>

                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 transition focus:border-blue-500 focus:outline-none hover:border-gray-300"
                >
                  <option value="">All Sources</option>
                  <option value="Website">Website</option>
                  <option value="Email">Email</option>
                  <option value="Phone">Phone</option>
                  <option value="Referral">Referral</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Trade Show">Trade Show</option>
                  <option value="Other">Other</option>
                </select>

                <select
                  value={assignedFilter}
                  onChange={(e) => setAssignedFilter(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 transition focus:border-blue-500 focus:outline-none hover:border-gray-300"
                >
                  <option value="">All Salespeople</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </select>

                <Button variant="outline" onClick={resetFilters} className="flex items-center justify-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Leads Table */}
          {loading ? (
            <Loading />
          ) : leads.length === 0 ? (
            <motion.div variants={itemVariants}>
              <EmptyState icon={Search} title="No leads found" description="Try adjusting your filters or create a new lead to get started" action={<Button onClick={() => navigate('/leads/new')}>Create Lead</Button>} />
            </motion.div>
          ) : (
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Lead Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Company</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Deal Value (LKR)</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Assigned To</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {leads.map((lead, idx) => (
                        <motion.tr
                          key={lead._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="group transition hover:bg-blue-50/50"
                        >
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900 group-hover:text-blue-600 transition">{lead.name}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{lead.company}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{lead.email}</td>
                          <td className="px-6 py-4">
                            <Badge variant={statusBadgeVariants[lead.status] || 'default'} size="sm">
                              {lead.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">{formatCurrencyLKR(lead.dealValue || 0)}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{lead.assignedTo?.name || 'Unassigned'}</td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => navigate(`/leads/${lead._id}`)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition">
                                <Eye className="h-4 w-4" />
                              </motion.button>
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => navigate(`/leads/${lead._id}/edit`)} className="rounded-lg p-2 text-amber-600 hover:bg-amber-50 transition">
                                <Edit className="h-4 w-4" />
                              </motion.button>
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => setLeadToDelete(lead._id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition">
                                <Trash2 className="h-4 w-4" />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}
        </motion.div>

        <DeleteConfirmModal
          isOpen={Boolean(leadToDelete)}
          onClose={() => !deleting && setLeadToDelete(null)}
          onConfirm={handleDelete}
          loading={deleting}
        />

        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Lead Deleted Successfully"
          message="The selected lead has been permanently removed from the CRM system."
          actionLabel="Continue"
        />
      </div>
    </div>
  );
};

export default Leads;
