import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = 'http://127.0.0.1:8000/api';

// Add axios interceptor to handle token
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.post(`${API_URL}/refresh-token`, {}, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;
            return axios(originalRequest);
          }
        }
      } catch (refreshError) {
        // If refresh fails, clear auth data and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (token && userId) {
      // Set default axios authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserProfile(userId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/user`);
      setUser(response.data);
      // Update token if provided in response
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      if (error.response?.status === 401) {
        // Token is invalid, clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/auth';
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      // Set default axios authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (fullName, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        fullName,
        email,
        password
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      // Set default axios authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`${API_URL}/logout`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    fetchUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 