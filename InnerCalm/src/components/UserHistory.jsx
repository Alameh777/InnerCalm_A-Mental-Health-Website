import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, TrendingUp, TrendingDown, Activity, Flower } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://127.0.0.1:8000/api';

function UserHistory() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      navigate('/auth');
      return;
    }

    console.log('Fetching survey history...');
    fetchSurveyHistory();
  }, [navigate]); // Remove user dependency since we're checking token directly

  const fetchSurveyHistory = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        navigate('/auth');
        return;
      }

      console.log('Fetching surveys for user:', userId);

      // Get user-specific surveys from localStorage using userId as key
      const userSurveysKey = `surveys_${userId}`;
      const localSurveys = JSON.parse(localStorage.getItem(userSurveysKey) || '[]');
      console.log('Local surveys found:', localSurveys.length);
      
      try {
        // Set default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Get surveys from API
        const response = await axios.get(`${API_URL}/mood-tracking/history`);
        const apiSurveys = response.data.mood_logs || [];
        console.log('API surveys found:', apiSurveys.length);
        
        // Combine API and local surveys, remove duplicates by ID
        const allSurveys = [...localSurveys, ...apiSurveys];
        const uniqueSurveys = allSurveys.filter((survey, index, self) =>
          index === self.findIndex((s) => s.id === survey.id)
        );
        
        // Sort by creation date, newest first
        const sortedSurveys = uniqueSurveys.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        
        console.log('Total unique surveys:', sortedSurveys.length);
        setSurveys(sortedSurveys);
      } catch (apiError) {
        console.error('API fetch failed, using localStorage only:', apiError);
        if (apiError.response?.status === 401) {
          // Don't navigate on API error, just use local data
          console.log('Using local surveys due to API error');
          setSurveys(localSurveys);
        } else {
          // If API fails, use local surveys
          setSurveys(localSurveys);
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading survey history:', err);
      setError('Failed to load survey history. Please try again later.');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMoodEmoji = (mood) => {
    const moodLevel = parseInt(mood);
    switch (moodLevel) {
      case 1: return '😢';
      case 2: return '😕';
      case 3: return '😐';
      case 4: return '🙂';
      case 5: return '😄';
      default: return '😐';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-8 py-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Survey History</h1>
              <div className="flex gap-4">
                <button 
                  onClick={fetchSurveyHistory}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg transition-colors"
                >
                  <Activity size={18} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-600">
                <p>{error}</p>
                <button 
                  onClick={fetchSurveyHistory}
                  className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {surveys.map((survey) => (
                  <div 
                    key={survey.id}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:border-emerald-500 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar size={20} />
                        <span>{formatDate(survey.created_at)}</span>
                      </div>
                      <div className="text-4xl">{getMoodEmoji(survey.mood)}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="text-emerald-500" size={18} />
                        <span className="text-gray-600">Sleep Hours:</span>
                        <span className="font-medium">{survey.sleep_hours}h</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Activity className="text-emerald-500" size={18} />
                        <span className="text-gray-600">Stress Level:</span>
                        <span className="font-medium">{survey.stress_level}/5</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <TrendingUp className="text-emerald-500" size={18} />
                        <span className="text-gray-600">Motivation:</span>
                        <span className="font-medium">{survey.motivation_level}/5</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">Physical Tiredness:</span>
                        <span className="font-medium">{survey.physical_tiredness}/5</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">Mental Tiredness:</span>
                        <span className="font-medium">{survey.mental_tiredness}/5</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">Water (L):</span>
                        <span className="font-medium">{survey.water_liters}L</span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {survey.trained && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Exercised
                        </span>
                      )}
                      {survey.meditated && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          Meditated
                        </span>
                      )}
                      {survey.ate_healthy && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          Ate Healthy
                        </span>
                      )}
                      {survey.social_interaction && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          Social Interaction
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {surveys.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No survey history found. Complete your first daily survey to see your history!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHistory; 