// src/pages/Campaigns.jsx
import { useState, useEffect } from 'react';
import api from '../api';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Campaigns.css';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', date: new Date() });
  const [editForm, setEditForm] = useState({ id: '', name: '', description: '', date: new Date() });
  const [message, setMessage] = useState('');
  const [view, setView] = useState('list');
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await api.get('/campaigns');
      setCampaigns(Array.isArray(res.data) ? res.data : []);
    } catch {
      setCampaigns([]);
    }
  };

  const handleCreate = async () => {
    if (!form.name.trim()) return setMessage('Name required');
    try {
      await api.post('/campaigns', form);
      setForm({ name: '', description: '', date: new Date() });
      setMessage('✅ Campaign created');
      fetchCampaigns();
    } catch {
      setMessage('❌ Creation failed');
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this campaign?')) return;
    try {
      await api.delete(`/campaigns/${id}`);
      setMessage('✅ Campaign deleted');
      fetchCampaigns();
    } catch {
      setMessage('❌ Deletion failed');
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/campaigns/${editForm.id}`, editForm);
      setMessage('✅ Campaign updated');
      setShowEditModal(false);
      fetchCampaigns();
    } catch {
      setMessage('❌ Update failed');
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const openEditModal = (c) => {
    setEditForm({
      id: c._id,
      name: c.name,
      description: c.description,
      date: new Date(c.date),
    });
    setShowEditModal(true);
  };

  const campaignsByDate = campaigns.reduce((acc, c) => {
    const date = new Date(c.date).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(c);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📅 Campaigns</h1>
        <div className="space-x-2">
          <button onClick={() => setView('list')} className={`px-3 py-1 rounded ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>List</button>
          <button onClick={() => setView('calendar')} className={`px-3 py-1 rounded ${view === 'calendar' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Calendar</button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6 mb-8 space-y-4 border border-gray-100">
        <input
          type="text"
          placeholder="Campaign Name"
          className="w-full border rounded px-4 py-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className="w-full border rounded px-4 py-2"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="date"
          className="w-full border rounded px-4 py-2"
          value={form.date.toISOString().split('T')[0]}
          onChange={(e) => setForm({ ...form, date: new Date(e.target.value) })}
        />
        <button
          onClick={handleCreate}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Create Campaign
        </button>
      </div>

      {message && <div className="text-center text-sm text-blue-600 mb-6">{message}</div>}

      {view === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((c) => (
            <div key={c._id} className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">{c.name}</h2>
              <p className="text-sm text-gray-600">{c.description}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(c.date).toDateString()}</p>
              <div className="flex justify-end space-x-3 mt-3">
                <button onClick={() => openEditModal(c)} className="text-blue-500 hover:underline text-sm">Edit</button>
                <button onClick={() => handleDelete(c._id)} className="text-red-500 hover:underline text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'calendar' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <Calendar
            tileContent={({ date }) => {
              const key = date.toDateString();
              return campaignsByDate[key]?.map((c) => (
                <div
                  key={c._id}
                  className="text-[10px] mt-1 px-1 py-0.5 rounded bg-blue-100 text-blue-800 cursor-pointer hover:underline"
                  onClick={() => openEditModal(c)}
                >
                  {c.name}
                </div>
              ));
            }}
          />
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Campaign</h2>
            <input
              type="text"
              className="w-full mb-3 border rounded px-4 py-2"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
            <textarea
              className="w-full mb-3 border rounded px-4 py-2"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            />
            <input
              type="date"
              className="w-full mb-4 border rounded px-4 py-2"
              value={editForm.date.toISOString().split('T')[0]}
              onChange={(e) => setEditForm({ ...editForm, date: new Date(e.target.value) })}
            />
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded">Cancel</button>
              <button onClick={handleUpdate} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;