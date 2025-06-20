import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiAlertTriangle, FiLogOut } from 'react-icons/fi';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/me');
      setProfile({
        name: res.data.name || '',
        email: res.data.email || '',
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await api.put('/users/me', profile);
      setMessage('Profile updated ✅');
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage('Error updating profile ❌');
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handlePasswordChange = async () => {
    try {
      await api.put('/users/me/password', passwordForm);
      setMessage('Password updated ✅');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      console.error('Error changing password:', err);
      setMessage('Error changing password ❌');
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return;

    try {
      await api.delete('/users/me');
      localStorage.removeItem('token');
      alert('Account deleted');
      navigate('/login');
    } catch (err) {
      console.error('Error deleting account:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex max-w-5xl mx-auto px-4 py-8">
      {/* Sidebar */}
      <div className="w-1/4 pr-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-4">Settings</h2>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('account')}
              className={`flex items-center w-full px-4 py-2 text-left rounded ${
                activeTab === 'account' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              <FiUser className="mr-2" /> Account
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center w-full px-4 py-2 text-left rounded ${
                activeTab === 'security' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              <FiLock className="mr-2" /> Security
            </button>

            <button
              onClick={() => setActiveTab('danger')}
              className={`flex items-center w-full px-4 py-2 text-left rounded ${
                activeTab === 'danger' ? 'bg-red-100 text-red-700' : 'hover:bg-gray-100'
              }`}
            >
              <FiAlertTriangle className="mr-2" /> Danger Zone
            </button>
          </nav>
        </div>

        {/* Log Out */}
        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-left rounded text-gray-600 hover:bg-gray-100"
          >
            <FiLogOut className="mr-2" /> Log Out
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="w-3/4 bg-white shadow rounded-lg p-6 space-y-4">
        {activeTab === 'account' && (
          <>
            <h2 className="text-2xl font-bold mb-4">Account Details</h2>
            <div>
              <label className="block text-gray-600 mb-1">Name</label>
              <input
                type="text"
                className="w-full border rounded px-4 py-2"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Email</label>
              <input
                type="email"
                className="w-full border rounded px-4 py-2"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>

            <button
              onClick={handleProfileUpdate}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </>
        )}

        {activeTab === 'security' && (
          <>
            <h2 className="text-2xl font-bold mb-4">Change Password</h2>
            <div>
              <label className="block text-gray-600 mb-1">Current Password</label>
              <input
                type="password"
                className="w-full border rounded px-4 py-2"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">New Password</label>
              <input
                type="password"
                className="w-full border rounded px-4 py-2"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
            </div>

            <button
              onClick={handlePasswordChange}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Update Password
            </button>
          </>
        )}

        {activeTab === 'danger' && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-red-700">Danger Zone</h2>
            <p className="mb-4 text-gray-600">Deleting your account is permanent and cannot be undone.</p>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
            >
              Delete My Account
            </button>
          </>
        )}

        {message && (
          <div className="text-center text-blue-600 font-medium pt-4">{message}</div>
        )}
      </div>
    </div>
  );
};

export default Settings;
