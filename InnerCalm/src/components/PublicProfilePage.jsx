import React, { useState, useEffect } from 'react';
import { User, Mail } from 'lucide-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:8000/api';

function PublicProfilePage() {
  const { userId } = useParams();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPublicProfile();
  }, [userId]);

  const fetchPublicProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUserData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-emerald-500 to-emerald-600">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <img
                  src={userData.avatar || 'https://placehold.co/200x200/e2e8f0/94a3b8?text=JD'}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 pb-8 px-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
              <p className="text-gray-600">{userData.email}</p>
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center space-x-2">
                      <User size={16} />
                      <span>Full Name</span>
                    </div>
                  </label>
                  <div className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
                    {userData.name}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center space-x-2">
                      <Mail size={16} />
                      <span>Email</span>
                    </div>
                  </label>
                  <div className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
                    {userData.email}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicProfilePage; 