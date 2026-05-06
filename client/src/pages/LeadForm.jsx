import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Building, Phone, Briefcase, ArrowLeft } from 'lucide-react';
import { authAPI, leadsAPI } from '../api';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import CreateLeadSuccessModal from '../components/CreateLeadSuccessModal';

const getEmptyForm = () => ({
  name: '',
  company: '',
  email: '',
  phone: '',
  source: 'Website',
  assignedTo: '',
  status: 'New',
  dealValue: 0,
});

const salespersonTitles = {
  'Kasun Perera': 'Sales Executive',
  'Nimal Fernando': 'Senior Sales Executive',
  'Sachini Fernando': 'Account Manager',
  'Yasara Wijesinghe': 'Business Development Officer',
  'Dilshan Silva': 'Sales Executive',
};

const LeadForm = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [showCreateSuccessModal, setShowCreateSuccessModal] = useState(false);

  const [formData, setFormData] = useState(getEmptyForm());

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await authAPI.getUsers();
        setUsers(response.data);
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setUsersLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.name === 'dealValue' ? Number(e.target.value) : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await leadsAPI.create(formData);
      setShowCreateSuccessModal(true);
    } catch (error) {
      console.error('Create lead failed:', error);
      setError(error.response?.data?.message || 'Failed to create lead');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Sidebar />
      <div className="flex-1 lg:ml-[220px] ml-0 overflow-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="border-b border-white/20 bg-white/80 backdrop-blur-sm p-8">
          <div className="flex items-center gap-4">
            <motion.button whileHover={{ x: -4 }} onClick={() => navigate('/leads')} className="rounded-xl p-2 hover:bg-gray-100 transition">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </motion.button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Create New Lead</h1>
              <p className="mt-2 text-gray-600">Add a new prospect to your sales pipeline</p>
            </div>
          </div>
        </motion.div>

        <div className="p-8">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto">
            {/* Error Alert */}
            {error && (
              <motion.div variants={itemVariants} className="mb-6 rounded-2xl border-l-4 border-red-500 bg-red-50 p-4 text-red-700">
                {error}
              </motion.div>
            )}

            {/* Form Card */}
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-white to-blue-50 p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Contact Information Section */}
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                      Contact Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Full Name" icon={Briefcase} name="name" value={formData.name} onChange={handleChange} placeholder="Kasun Perera" required />
                      <Input label="Company Name" icon={Building} name="company" value={formData.company} onChange={handleChange} placeholder="Lanka Tech Solutions" required />
                      <Input label="Email Address" icon={Mail} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="info@lankatech.lk" required />
                      <Input label="Phone Number" icon={Phone} name="phone" value={formData.phone} onChange={handleChange} placeholder="0771234567" required />
                    </div>
                  </div>

                  {/* Deal Information Section */}
                  <div className="border-t border-gray-200 pt-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-emerald-100 px-1.5 text-xs font-bold text-emerald-700">Rs</span>
                      Deal Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Deal Value (LKR)" type="number" name="dealValue" value={formData.dealValue} onChange={handleChange} placeholder="750000" />
                      <Select
                        label="Lead Source"
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        options={[
                          { label: 'Website', value: 'Website' },
                          { label: 'Email', value: 'Email' },
                          { label: 'Phone', value: 'Phone' },
                          { label: 'Referral', value: 'Referral' },
                          { label: 'Social Media', value: 'Social Media' },
                          { label: 'Trade Show', value: 'Trade Show' },
                          { label: 'Other', value: 'Other' },
                        ]}
                      />
                    </div>
                  </div>

                  {/* Sales Information Section */}
                  <div className="border-t border-gray-200 pt-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-purple-600" />
                      Sales Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Select
                        label="Assigned Salesperson"
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleChange}
                        disabled={usersLoading}
                        options={[
                          { label: 'Unassigned', value: '' },
                          ...users.map((user) => ({
                            label: `${user.name}${salespersonTitles[user.name] ? ` (${salespersonTitles[user.name]})` : ''}`,
                            value: user._id,
                          })),
                        ]}
                      />
                      <Select
                        label="Lead Status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        options={[
                          { label: 'New', value: 'New' },
                          { label: 'Contacted', value: 'Contacted' },
                          { label: 'Qualified', value: 'Qualified' },
                          { label: 'Proposal Sent', value: 'Proposal Sent' },
                          { label: 'Won', value: 'Won' },
                          { label: 'Lost', value: 'Lost' },
                        ]}
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="border-t border-gray-200 pt-6 flex justify-between gap-4">
                    <Button variant="secondary" onClick={() => navigate('/leads')}>
                      Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? 'Creating Lead...' : 'Create Lead'}
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        <CreateLeadSuccessModal
          isOpen={showCreateSuccessModal}
          onClose={() => setShowCreateSuccessModal(false)}
          onViewLeads={() => {
            setShowCreateSuccessModal(false);
            navigate('/leads');
          }}
          onContinue={() => {
            setShowCreateSuccessModal(false);
            setFormData(getEmptyForm());
            setError('');
          }}
        />
      </div>
    </div>
  );
};

export default LeadForm;
