import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Leaf, Cloud, Sun, Calendar, RefreshCw, ChevronLeft, ArrowUpCircle, Clock } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const PlantGarden = () => {
  const [surveyHistory, setSurveyHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [plants, setPlants] = useState([]);
  const [totalPlants, setTotalPlants] = useState(0);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [gardenStats, setGardenStats] = useState({
    totalActivities: 0,
    mostFrequentPlant: '',
    averageMood: 0,
  });
  const [nextSurveyTime, setNextSurveyTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [canSubmitSurvey, setCanSubmitSurvey] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Define different plant types based on mood
  const plantTypes = [
    { name: 'Sunshine Daisy', icon: '🌼', minMood: 4, color: 'yellow' },
    { name: 'Balanced Blossom', icon: '🌷', minMood: 3, color: 'purple' },
    { name: 'Hope Sprout', icon: '🌱', minMood: 1, color: 'green' },
    { name: 'Serene Lily', icon: '🪷', minMood: 4, color: 'pink' },
    { name: 'Resilient Reed', icon: '🌿', minMood: 2, color: 'teal' },
    { name: 'Mindful Moss', icon: '🍀', minMood: 3, color: 'green' },
    { name: 'Calm Cactus', icon: '🌵', minMood: 2, color: 'green' },
    { name: 'Restful Rose', icon: '🌹', minMood: 4, color: 'red' },
    { name: 'Joyful Jasmine', icon: '💮', minMood: 5, color: 'white' },
    { name: 'Tranquil Tulip', icon: '🌷', minMood: 3, color: 'pink' },
    { name: 'Energetic Echinacea', icon: '🌺', minMood: 4, color: 'orange' },
    { name: 'Peaceful Peony', icon: '🌸', minMood: 3, color: 'pink' },
  ];

  // Plant growth stages
  const growthStages = [
    { name: 'Seed', height: 1 },
    { name: 'Sprout', height: 2 },
    { name: 'Small Plant', height: 3 },
    { name: 'Medium Plant', height: 4 },
    { name: 'Full Plant', height: 5 }
  ];

  useEffect(() => {
    fetchSurveyHistory();
    checkSubmissionStatus();
    
    // Handle new survey data if it exists in location state
    if (location.state?.newSurvey && location.state?.surveyData) {
      const newSurvey = location.state.surveyData;
      
      // Determine plant type based on mood
      const mood = parseInt(newSurvey.mood);
      const eligiblePlants = plantTypes.filter(plant => plant.minMood <= mood);
      const randomPlantIndex = Math.floor(Math.random() * eligiblePlants.length);
      const plantType = eligiblePlants[randomPlantIndex];

      // Calculate growth stage based on activities
      let activities = 0;
      if (newSurvey.trained) activities++;
      if (newSurvey.meditated) activities++;
      if (newSurvey.ate_healthy) activities++;
      if (newSurvey.social_interaction) activities++;
      if (newSurvey.spent_time_outside) activities++;
      
      const growthIndex = Math.min(
        Math.floor((activities / 5) * growthStages.length),
        growthStages.length - 1
      );

      // Add a bit of randomness to position
      const position = {
        x: 100 + Math.floor(Math.random() * 600),
        y: 100 + Math.floor(Math.random() * 400)
      };

      const newPlant = {
        id: Date.now(),
        type: plantType,
        growth: growthStages[growthIndex],
        date: new Date(newSurvey.created_at),
        water: parseFloat(newSurvey.water_liters) || 0,
        sleep: parseInt(newSurvey.sleep_hours) || 0,
        position,
        surveyData: newSurvey,
        isNew: true // Flag to trigger special animation
      };

      // Add the new plant to the garden
      setPlants(prevPlants => [newPlant, ...prevPlants]);
      setTotalPlants(prev => prev + 1);
      
      // Show the plant details
      setSelectedPlant(newPlant);

      // Clear the state after using it
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);
  
  // Add timer effect for countdown
  useEffect(() => {
    if (!nextSurveyTime) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const nextAvailableDate = new Date(nextSurveyTime);
      const difference = nextAvailableDate - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        return { hours, minutes, seconds };
      }
      return null;
    };

    const updateTimer = () => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      if (!newTimeLeft) {
        setCanSubmitSurvey(true);
      }
    };

    // Initial calculation
    updateTimer();

    // Update every second
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [nextSurveyTime]);
  
  const fetchSurveyHistory = async () => {
    try {
      setLoading(true);
      console.log('Fetching survey history');
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token) {
        console.error('No token found');
        setError('Please log in to view your garden');
        setLoading(false);
        navigate('/auth');
        return;
      }

      // Get user-specific surveys from localStorage using userId as key
      const userSurveysKey = `surveys_${userId}`;
      const localSurveys = JSON.parse(localStorage.getItem(userSurveysKey) || '[]');
      
      // Try to get surveys from API
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get(`${API_URL}/mood-tracking/history`);
        const apiSurveys = response.data.mood_logs || [];
        
        // Combine API and local surveys, remove duplicates by ID
        const allSurveys = [...localSurveys, ...apiSurveys];
        const uniqueSurveys = allSurveys.filter((survey, index, self) =>
          index === self.findIndex((s) => s.id === survey.id)
        );
        
        // Sort by creation date, newest first
        const sortedSurveys = uniqueSurveys.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        
        processSurveyData(sortedSurveys);
      } catch (apiError) {
        console.error('API fetch failed, using localStorage only:', apiError);
        processSurveyData(localSurveys);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading survey history:', err);
      setError('Failed to load garden data. Please try again later.');
      setLoading(false);
    }
  };
  
  const checkSubmissionStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const lastSubmissionTime = localStorage.getItem(`lastSubmission_${token}`);
        if (lastSubmissionTime) {
          const lastSubmission = new Date(lastSubmissionTime);
          const now = new Date();
          const timeDiff = now - lastSubmission;
          const hoursDiff = timeDiff / (1000 * 60 * 60);

          if (hoursDiff < 24) {
            setCanSubmitSurvey(false);
            setNextSurveyTime(new Date(lastSubmission.getTime() + 24 * 60 * 60 * 1000).toISOString());
            return;
          }
        }
      }
      
      setCanSubmitSurvey(true);
      setNextSurveyTime(null);
    } catch (error) {
      console.error('Error checking submission status:', error);
      setCanSubmitSurvey(true);
    }
  };

  const processSurveyData = (surveyData) => {
    console.log(`Found ${surveyData.length} survey entries`);
    
    setSurveyHistory(surveyData);
    
    // Only generate plants if we have survey data
    if (surveyData.length > 0) {
      console.log('Generating plants from survey data');
      generatePlants(surveyData);
      calculateGardenStats(surveyData);
    } else {
      console.log('No survey data found, garden is empty');
      setPlants([]);
      setTotalPlants(0);
    }
  };

  const calculateGardenStats = (surveys) => {
    if (!surveys.length) return;

    // Calculate total activities
    let totalActivities = 0;
    const plantCounts = {};
    let moodSum = 0;

    surveys.forEach(survey => {
      if (survey.trained) totalActivities++;
      if (survey.meditated) totalActivities++;
      if (survey.ate_healthy) totalActivities++;
      if (survey.social_interaction) totalActivities++;
      if (survey.spent_time_outside) totalActivities++;
      
      // Count plant types (based on mood level)
      const mood = parseInt(survey.mood);
      const eligiblePlants = plantTypes.filter(plant => plant.minMood <= mood);
      if (eligiblePlants.length) {
        const plantType = eligiblePlants[0].name;
        plantCounts[plantType] = (plantCounts[plantType] || 0) + 1;
      }
      
      moodSum += mood;
    });
    
    // Find most frequent plant
    let mostFrequentPlant = '';
    let maxCount = 0;
    for (const [plant, count] of Object.entries(plantCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentPlant = plant;
      }
    }
    
    setGardenStats({
      totalActivities,
      mostFrequentPlant,
      averageMood: (moodSum / surveys.length).toFixed(1)
    });
  };

  const generatePlants = (surveys) => {
    // Consider plants for each completed survey
    const plantsList = surveys.map((survey, index) => {
      // Determine plant type based on mood
      const mood = parseInt(survey.mood);
      const eligiblePlants = plantTypes.filter(plant => plant.minMood <= mood);
      const randomPlantIndex = Math.floor(Math.random() * eligiblePlants.length);
      const plantType = eligiblePlants[randomPlantIndex];

      // Calculate growth stage based on activities - more healthy activities = bigger plant
      let activities = 0;
      if (survey.trained) activities++;
      if (survey.meditated) activities++;
      if (survey.ate_healthy) activities++;
      if (survey.social_interaction) activities++;
      if (survey.spent_time_outside) activities++;
      
      // Normalize to our growth stages
      const growthIndex = Math.min(
        Math.floor((activities / 5) * growthStages.length),
        growthStages.length - 1
      );
      
      // Add a bit of randomness to position
      const position = {
        x: 100 + Math.floor(Math.random() * 600),
        y: 100 + Math.floor(Math.random() * 400)
      };

      return {
        id: surveys.length - index, // Reverse the index so newer plants have higher IDs
        type: plantType,
        growth: growthStages[growthIndex],
        date: new Date(survey.created_at),
        water: parseFloat(survey.water_liters) || 0,
        sleep: parseInt(survey.sleep_hours) || 0,
        position,
        surveyData: survey
      };
    });

    setPlants(plantsList);
    setTotalPlants(plantsList.length);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePlantClick = (plant) => {
    setSelectedPlant(plant);
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

  // Modify the plant rendering to include special animation for new plants
  const renderPlant = (plant) => (
    <motion.div
      key={plant.id}
      className="absolute cursor-pointer"
      style={{ 
        bottom: plant.growth.height * 20, 
        left: plant.position.x, 
        transform: `translateX(-50%)`
      }}
      initial={{ scale: 0, y: 50 }}
      animate={{ 
        scale: 1, 
        y: 0,
        ...(plant.isNew && {
          scale: [0, 1.2, 1],
          rotate: [0, -10, 10, -5, 5, 0]
        })
      }}
      transition={{ 
        type: 'spring', 
        damping: 12,
        delay: plant.isNew ? 0.5 : plant.id * 0.1 % 1, // Longer delay for new plants
        ...(plant.isNew && {
          duration: 1.5,
          type: 'spring',
          bounce: 0.4
        })
      }}
      onClick={() => handlePlantClick(plant)}
      whileHover={{ scale: 1.1 }}
    >
      <div className="flex flex-col items-center">
        <div 
          className={`text-4xl transform-gpu transition-transform ${plant.isNew ? 'animate-bounce' : ''}`}
          style={{ fontSize: `${1 + plant.growth.height * 0.2}rem` }}
        >
          {plant.type.icon}
        </div>
        {/* Plant stem */}
        <div 
          className="w-1 bg-green-600 rounded-full mx-auto -mt-1"
          style={{ height: `${plant.growth.height * 12}px` }}
        ></div>
      </div>
      {plant.isNew && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-emerald-500 text-white px-3 py-1 rounded-full text-sm"
        >
          New Plant! 🌱
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center p-8 text-red-600">
              <p>{error}</p>
              <button 
                onClick={fetchSurveyHistory}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <Link 
                  to="/history" 
                  className="flex items-center text-emerald-700 hover:text-emerald-800"
                >
                  <ChevronLeft size={20} className="mr-1" />
                  <span>Back to History</span>
                </Link>
                <button 
                  onClick={fetchSurveyHistory} 
                  className="p-2 text-emerald-700 hover:text-emerald-800 rounded-full hover:bg-emerald-50"
                  title="Refresh Garden"
                >
                  <RefreshCw size={20} />
                </button>
              </div>

              {/* New Plant button with conditional display */}
              <div className="flex justify-end mb-4">
                {canSubmitSurvey ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/mood-tracking')}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-md"
                  >
                    <ArrowUpCircle size={18} />
                    <span>Take New Survey</span>
                  </motion.button>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed">
                    <Clock size={18} />
                    <span>Survey Cooldown</span>
                  </div>
                )}
              </div>
              
              {/* Garden Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
                  <div className="text-emerald-700 mb-1 text-sm">Average Mood</div>
                  <div className="text-2xl font-bold flex items-center">
                    {gardenStats.averageMood || "0"} <span className="ml-2 text-xl">{getMoodEmoji(Math.round(gardenStats.averageMood || 3))}</span>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
                  <div className="text-emerald-700 mb-1 text-sm">Total Healthy Activities</div>
                  <div className="text-2xl font-bold">{gardenStats.totalActivities}</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
                  <div className="text-emerald-700 mb-1 text-sm">Most Common Plant</div>
                  <div className="text-2xl font-bold">{gardenStats.mostFrequentPlant || "None"}</div>
                </div>
              </div>

              <div className="bg-gradient-to-b from-sky-100 to-emerald-50 rounded-3xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-emerald-800">Your Wellness Garden</h2>
                    <p className="text-gray-600">Each completed survey grows a new plant</p>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-full shadow flex items-center">
                    <Leaf className="text-emerald-500 mr-2" size={18} />
                    <span className="font-semibold">{totalPlants} Plants</span>
                  </div>
                </div>

                {/* Garden view */}
                <div className="relative bg-gradient-to-b from-emerald-200/30 to-emerald-300/20 h-[500px] rounded-2xl overflow-hidden mb-6 border border-emerald-200">
                  {/* Sky elements */}
                  <div className="absolute top-4 left-10">
                    <Cloud className="text-white" size={32} />
                  </div>
                  <div className="absolute top-6 right-10">
                    <Sun className="text-yellow-400" size={36} />
                  </div>
                  
                  {/* Ground/soil texture at bottom */}
                  <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-amber-800/30 to-amber-600/10"></div>
                  
                  {/* Plants */}
                  {plants.map(plant => renderPlant(plant))}
                </div>

                {/* Plant detail panel */}
                {selectedPlant && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-6 shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="text-4xl mr-4">{selectedPlant.type.icon}</div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">{selectedPlant.type.name}</h3>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Calendar size={14} className="mr-1" />
                            Planted on {formatDate(selectedPlant.date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-2xl">{getMoodEmoji(selectedPlant.surveyData.mood)}</div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-emerald-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Growth Stage</p>
                        <p className="font-medium">{selectedPlant.growth.name}</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Water</p>
                        <p className="font-medium">{selectedPlant.water}L</p>
                      </div>
                      <div className="bg-indigo-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Sleep</p>
                        <p className="font-medium">{selectedPlant.sleep} hours</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Mood</p>
                        <p className="font-medium">{selectedPlant.surveyData.mood}/5</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedPlant.surveyData.trained && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Exercise
                        </span>
                      )}
                      {selectedPlant.surveyData.meditated && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Meditation
                        </span>
                      )}
                      {selectedPlant.surveyData.ate_healthy && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Healthy Eating
                        </span>
                      )}
                      {selectedPlant.surveyData.social_interaction && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Social Interaction
                        </span>
                      )}
                      {selectedPlant.surveyData.spent_time_outside && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          Time Outdoors
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-4 text-right">
                      <button 
                        onClick={() => setSelectedPlant(null)}
                        className="text-sm text-emerald-600 hover:text-emerald-800"
                      >
                        Close Details
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PlantGarden; 