import { useState, useEffect } from 'react';
import api from '../api';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editForm, setEditForm] = useState({ id: '', name: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await api.get('/campaigns');
      console.log("📦 campaigns response:", res.data);
      setCampaigns(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching campaigns:', err.response?.data || err.message);
      setCampaigns([]);
    }
  };

  const handleCreate = async () => {
    if (!form.name.trim()) {
      setMessage('Campaign name is required.');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/campaigns', form);
      setForm({ name: '', description: '' });
      setMessage('Campaign created successfully ✅');
      fetchCampaigns();
    } catch (err) {
      console.error('Error creating campaign:', err.response?.data || err.message);
      setMessage('Error creating campaign ❌');
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    setIsDeleting(true);
    try {
      await api.delete(`/campaigns/${id}`);
      setMessage('Campaign deleted ✅');
      fetchCampaigns();
    } catch (err) {
      console.error('Error deleting campaign:', err.response?.data || err.message);
      setMessage('Error deleting campaign ❌');
    } finally {
      setIsDeleting(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const openEditModal = (campaign) => {
    setEditForm({ id: campaign._id, name: campaign.name, description: campaign.description });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editForm.name.trim()) {
      setMessage('Campaign name is required.');
      return;
    }

    setIsUpdating(true);
    try {
      await api.put(`/campaigns/${editForm.id}`, {
        name: editForm.name,
        description: editForm.description,
      });
      setMessage('Campaign updated ✅');
      setShowEditModal(false);
      fetchCampaigns();
    } catch (err) {
      console.error('Error updating campaign:', err.response?.data || err.message);
      setMessage('Error updating campaign ❌');
    } finally {
      setIsUpdating(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Campaigns</h1>

      {/* Create Form */}
      <div className="bg-white shadow rounded-lg p-6 mb-8 space-y-4">
        <input
          type="text"
          placeholder="Campaign Name"
          className="w-full border border-gray-300 rounded px-4 py-2 focus:ring focus:ring-blue-200"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className="w-full border border-gray-300 rounded px-4 py-2 focus:ring focus:ring-blue-200"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        ></textarea>
        <button
          onClick={handleCreate}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create Campaign'}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className="mb-4 text-center text-sm text-blue-600 font-medium">
          {message}
        </div>
      )}

      {/* Campaigns List */}
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {campaigns.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No campaigns found.</div>
        ) : (
          campaigns.map((c) => (
            <div key={c._id} className="flex items-center justify-between p-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{c.name}</h2>
                <p className="text-sm text-gray-500">{c.description}</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => openEditModal(c)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c._id)}
                  disabled={isDeleting}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Campaign</h2>
            <input
              type="text"
              placeholder="Campaign Name"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring focus:ring-blue-200"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
            <textarea
              placeholder="Description"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring focus:ring-blue-200"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            ></textarea>
            <div className="flex justify-end space-x-4 pt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isUpdating ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;
