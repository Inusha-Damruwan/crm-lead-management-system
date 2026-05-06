import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { leadsAPI } from '../api';
import Sidebar from '../components/Sidebar';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import SuccessModal from '../components/SuccessModal';
import { formatCurrencyLKR } from '../utils/currency';

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteContent, setNoteContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    loadLead();
  }, [id]);

  const loadLead = async () => {
    try {
      setLoading(true);
      const [leadResponse, notesResponse] = await Promise.all([
        leadsAPI.getOne(id),
        leadsAPI.getNotes(id),
      ]);

      setLead(leadResponse.data);
      setNotes(notesResponse.data);
      setError('');
    } catch (err) {
      console.error('Failed to load lead:', err);
      setError(err.response?.data?.message || 'Failed to load lead');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await leadsAPI.delete(id);
      setShowDeleteModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Delete failed:', err);
      setError(err.response?.data?.message || 'Failed to delete lead');
    } finally {
      setDeleting(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;

    try {
      setSavingNote(true);
      await leadsAPI.addNote(id, noteContent.trim());
      setNoteContent('');
      await loadLead();
    } catch (err) {
      console.error('Failed to add note:', err);
      setError(err.response?.data?.message || 'Failed to add note');
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-[220px] ml-0 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500" />
            <p className="text-gray-600">Loading lead...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-[220px] ml-0 p-8">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-gray-600">Lead not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 lg:ml-[220px] ml-0 overflow-auto">
        <div className="border-b border-gray-200 bg-white p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <button onClick={() => navigate('/leads')} className="mb-2 text-blue-600 hover:text-blue-800">
                ← Back to Leads
              </button>
              <h1 className="text-3xl font-bold text-gray-900">{lead.name}</h1>
              <p className="mt-2 text-gray-600">{lead.company}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigate(`/leads/${lead._id}/edit`)}
                className="rounded-xl bg-amber-100 px-4 py-2 font-semibold text-amber-700 transition hover:bg-amber-200"
              >
                Edit Lead
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="rounded-xl bg-red-100 px-4 py-2 font-semibold text-red-700 transition hover:bg-red-200"
              >
                Delete Lead
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          {error && <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-xl font-bold text-gray-900">Lead Information</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Info label="Name" value={lead.name} />
                  <Info label="Company" value={lead.company} />
                  <Info label="Email" value={lead.email} />
                  <Info label="Phone" value={lead.phone} />
                  <Info label="Source" value={lead.source || 'Website'} />
                  <Info label="Assigned Salesperson" value={lead.assignedTo?.name || 'Unassigned'} />
                  <Info label="Status" value={lead.status} />
                  <Info label="Deal Value (LKR)" value={formatCurrencyLKR(lead.dealValue || 0)} />
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-xl font-bold text-gray-900">Notes</h2>

                <div className="mb-6">
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    rows="4"
                    placeholder="Add a note..."
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={handleAddNote}
                      disabled={savingNote}
                      className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {savingNote ? 'Saving...' : 'Add Note'}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {notes.length > 0 ? (
                    notes.map((note) => (
                      <div key={note._id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <p className="font-semibold text-gray-900">{note.createdBy?.name || 'Unknown User'}</p>
                          <span className="text-sm text-gray-500">
                            {new Date(note.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{note.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No notes yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-gray-900">Lead Summary</h3>
              <div className="space-y-4 text-sm">
                <Summary label="Status" value={lead.status} />
                <Summary label="Source" value={lead.source || 'Website'} />
                <Summary label="Assigned" value={lead.assignedTo?.name || 'Unassigned'} />
                <Summary label="Created" value={new Date(lead.createdAt).toLocaleDateString()} />
                <Summary label="Updated" value={new Date(lead.updatedAt).toLocaleDateString()} />
                <Summary label="Deal Value (LKR)" value={formatCurrencyLKR(lead.dealValue || 0)} />
              </div>
            </div>
          </div>
        </div>

        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => !deleting && setShowDeleteModal(false)}
          onConfirm={handleDelete}
          loading={deleting}
        />

        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            navigate('/leads');
          }}
          title="Lead Deleted Successfully"
          message="The selected lead has been permanently removed from the CRM system."
          actionLabel="Done"
        />
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="mt-1 font-semibold text-gray-900">{value || '—'}</p>
  </div>
);

const Summary = ({ label, value }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-semibold text-gray-900">{value}</p>
  </div>
);

export default LeadDetail;
