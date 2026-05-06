import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authAPI, leadsAPI } from '../api';
import Sidebar from '../components/Sidebar';
import UpdateSuccessModal from '../components/UpdateSuccessModal';

const emptyForm = {
  name: '',
  company: '',
  email: '',
  phone: '',
  source: 'Website',
  assignedTo: '',
  status: 'New',
  dealValue: 0,
};

const salespersonTitles = {
  'Kasun Perera': 'Sales Executive',
  'Nimal Fernando': 'Senior Sales Executive',
  'Sachini Fernando': 'Account Manager',
  'Yasara Wijesinghe': 'Business Development Officer',
  'Dilshan Silva': 'Sales Executive',
};

const LeadEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState('');
  const [showUpdateSuccessModal, setShowUpdateSuccessModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [leadRes, usersRes] = await Promise.all([
          leadsAPI.getOne(id),
          authAPI.getUsers(),
        ]);

        const lead = leadRes.data;
        setFormData({
          name: lead.name || '',
          company: lead.company || '',
          email: lead.email || '',
          phone: lead.phone || '',
          source: lead.source || 'Website',
          assignedTo: lead.assignedTo?._id || lead.assignedTo || '',
          status: lead.status || 'New',
          dealValue: lead.dealValue || 0,
        });
        setUsers(usersRes.data);
      } catch (err) {
        console.error('Failed to load lead for edit:', err);
        setError(err.response?.data?.message || 'Failed to load lead');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'dealValue' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await leadsAPI.update(id, formData);
      setShowUpdateSuccessModal(true);
    } catch (err) {
      console.error('Failed to update lead:', err);
      setError(err.response?.data?.message || 'Failed to update lead');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500" />
            <p className="text-gray-600">Loading lead...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 overflow-auto">
        <div className="bg-white border-b border-gray-200 p-8">
          <button onClick={() => navigate('/leads')} className="mb-2 text-blue-600 hover:text-blue-800">
            ← Back to Leads
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Lead</h1>
          <p className="mt-2 text-gray-600">Update lead details and assignment.</p>
        </div>

        <div className="p-8">
          <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-lg">
            {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field label="Name" name="name" value={formData.name} onChange={handleChange} required />
                <Field label="Company" name="company" value={formData.company} onChange={handleChange} required />
                <Field label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                <Field label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Source</label>
                  <select name="source" value={formData.source} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500">
                    <option value="Website">Website</option>
                    <option value="Email">Email</option>
                    <option value="Phone">Phone</option>
                    <option value="Referral">Referral</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Trade Show">Trade Show</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Assigned Salesperson</label>
                  <select name="assignedTo" value={formData.assignedTo} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500">
                    <option value="">Unassigned</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}{salespersonTitles[user.name] ? ` (${salespersonTitles[user.name]})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500">
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>

                <Field label="Deal Value (LKR)" name="dealValue" type="number" value={formData.dealValue} onChange={handleChange} />
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => navigate('/leads')} className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <UpdateSuccessModal
          isOpen={showUpdateSuccessModal}
          onClose={() => {
            setShowUpdateSuccessModal(false);
            navigate('/leads');
          }}
          title="Lead Updated Successfully"
          message="The lead information has been updated successfully in the CRM system."
          actionLabel="Continue"
        />
      </div>
    </div>
  );
};

const Field = ({ label, name, value, onChange, type = 'text', required = false }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default LeadEdit;