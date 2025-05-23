import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Camera, Shield, History } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:8000/api';

function ProfilePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    avatar: '',
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth');
        return;
      }

      const response = await axios.get(`${API_URL}/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUserData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load profile');
      setLoading(false);
      if (err.response?.status === 401) {
        navigate('/auth');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const validatePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required.');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return false;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/user/profile`,
        {
          name: userData.name,
          email: userData.email
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUserData(response.data.user);
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);

      // Show success message for 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Profile update error:', err.response || err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setPasswordError('');
    if (!validatePasswordChange()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/user/password`,
        { 
          current_password: currentPassword,
          new_password: newPassword,
          password_confirmation: confirmPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccessMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Show success message for 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Password update error:', err.response || err);
      setPasswordError(err.response?.data?.message || 'Failed to update password. Please try again.');
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSuccessMessage('');
      setError('');
      
      const formData = new FormData();
      formData.append('avatar', file);

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `${API_URL}/user/avatar`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        // Update user data with new avatar URL
        setUserData(prev => ({ 
          ...prev, 
          avatar: response.data.avatar 
        }));
        
        setSuccessMessage('Profile picture updated successfully!');
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (err) {
        console.error('Avatar update error:', err.response || err);
        setError(err.response?.data?.message || 'Failed to update profile picture. Please try again.');
      }
    }
  };

  const handleHistoryClick = () => {
    navigate('/history');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Profile Header */}
            <div className="relative h-48 bg-gradient-to-r from-emerald-500 to-emerald-600">
              <div className="absolute -bottom-16 left-8">
                <div className="relative">
                  <img
                    src={userData.avatar ? `http://localhost:8000/storage/${userData.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=10B981&color=ffffff&size=200`}
                    alt={`${userData.name}'s profile`}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=10B981&color=ffffff&size=200`;
                    }}
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <Camera size={20} className="text-gray-600" />
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="pt-20 pb-8 px-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
                  <p className="text-gray-600">{userData.email}</p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                  <button
                    onClick={handleHistoryClick}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                  >
                    <History size={20} className="mr-2" />
                    View History
                  </button>
                </div>
              </div>

              {/* Show success message if any */}
              {successMessage && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
                  {successMessage}
                </div>
              )}

              {/* Show error message if any */}
              {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-8">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'profile'
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Profile Information
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'security'
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Security
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'profile' && (
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <div className="flex items-center space-x-2">
                            <User size={16} />
                            <span>Full Name</span>
                          </div>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={userData.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <div className="flex items-center space-x-2">
                            <Mail size={16} />
                            <span>Email</span>
                          </div>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={userData.email}
                          disabled
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </form>
                )}

                {activeTab === 'security' && (
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <div className="flex items-center space-x-2">
                            <Lock size={16} />
                            <span>Current Password</span>
                          </div>
                        </label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={e => setCurrentPassword(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <div className="flex items-center space-x-2">
                            <Shield size={16} />
                            <span>New Password</span>
                          </div>
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <div className="flex items-center space-x-2">
                            <Shield size={16} />
                            <span>Confirm New Password</span>
                          </div>
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>

                      {passwordError && (
                        <p className="text-red-600 text-sm">{passwordError}</p>
                      )}
                      {successMessage && (
                        <p className="text-green-600 text-sm">{successMessage}</p>
                      )}

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;