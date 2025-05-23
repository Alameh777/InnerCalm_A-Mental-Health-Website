import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Activity, Droplet, Coffee, Brain, Heart, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SurveyResults = ({ results, submissionTime }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!submissionTime) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const submissionDate = new Date(submissionTime);
      const nextAvailable = new Date(submissionDate.getTime() + 24 * 60 * 60 * 1000);
      const difference = nextAvailable - now;

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
    };

    // Initial calculation
    updateTimer();

    // Update every second
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [submissionTime]);

  console.log('Survey Results:', results); // Debug log

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

  const getMoodState = (mood) => {
    const moodLevel = parseInt(mood);
    switch (moodLevel) {
      case 1: return "Bad mental state";
      case 2: return "Struggling";
      case 3: return "Balanced";
      case 4: return "Positive";
      case 5: return "Cheerful";
      default: return "Unknown";
    }
  };

  // Function to generate personalized suggestions based on survey results
  const generateSuggestions = (results) => {
    const suggestions = [];

    // Sleep-related suggestions
    if (results.sleep_hours < 7) {
      suggestions.push({
        category: 'Sleep',
        icon: '😴',
        title: 'Improve Sleep Quality',
        tips: [
          'Try to maintain a consistent sleep schedule',
          'Avoid screens 1 hour before bedtime',
          'Create a relaxing bedtime routine',
          'Aim for 7-9 hours of sleep'
        ]
      });
    }

    // Mood and stress-related suggestions
    if (results.mood <= 3 || results.stress_level >= 4) {
      suggestions.push({
        category: 'Mental Wellness',
        icon: '🧘',
        title: 'Mood & Stress Management',
        tips: [
          'Practice deep breathing exercises',
          'Take regular breaks during work',
          'Spend time in nature',
          'Connect with friends or family'
        ]
      });
    }

    // Physical activity suggestions
    if (!results.trained) {
      suggestions.push({
        category: 'Physical Activity',
        icon: '🏃',
        title: 'Increase Physical Activity',
        tips: [
          'Start with a 10-minute walk',
          'Try simple stretching exercises',
          'Take the stairs instead of elevator',
          'Consider joining a fitness class'
        ]
      });
    }

    // Hydration and nutrition suggestions
    if (results.water_liters < 2 || !results.ate_healthy) {
      suggestions.push({
        category: 'Nutrition & Hydration',
        icon: '🥗',
        title: 'Improve Diet & Hydration',
        tips: [
          'Set reminders to drink water',
          'Prepare healthy snacks in advance',
          'Include more fruits and vegetables',
          'Track your water intake'
        ]
      });
    }

    // Social interaction suggestions
    if (!results.social_interaction) {
      suggestions.push({
        category: 'Social Connection',
        icon: '👥',
        title: 'Enhance Social Connections',
        tips: [
          'Reach out to a friend or family member',
          'Join a community group or club',
          'Participate in social activities',
          'Consider volunteering'
        ]
      });
    }

    // Meditation and mindfulness suggestions
    if (!results.meditated || results.mental_tiredness >= 4) {
      suggestions.push({
        category: 'Mindfulness',
        icon: '🎯',
        title: 'Practice Mindfulness',
        tips: [
          'Start with 5-minute meditation sessions',
          'Try guided meditation apps',
          'Practice mindful walking',
          'Take mindful breaks during the day'
        ]
      });
    }

    return suggestions;
  };

  // If no results, show loading or error state
  if (!results) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Loading survey results...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="text-6xl mb-4"
        >
          {getMoodEmoji(results.mood)}
        </motion.div>
        <h2 className="text-3xl font-bold text-emerald-700 mb-2">Your Wellness Summary</h2>
        <p className="text-gray-600 mb-4">Thank you for completing today's check-in!</p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl font-semibold text-emerald-600 mb-4"
        >
          Current Mood State: {getMoodState(results.mood)}
        </motion.div>
        
        {/* Enhanced Timer Display */}
        {timeLeft && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-lg mb-6 inline-flex items-center"
          >
            <Clock className="text-orange-500 mr-2" size={20} />
            <div>
              <p className="text-orange-700 font-medium">Surveys limited to once every 24 hours</p>
              <p className="text-orange-600">Next survey available in: {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sleep and Rest */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-emerald-50 p-6 rounded-xl"
        >
          <div className="flex items-center mb-4">
            <Clock className="text-emerald-600 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-emerald-800">Rest & Recovery</h3>
          </div>
          <div className="space-y-2">
            <p className="flex justify-between">
              <span className="text-gray-600">Sleep Hours:</span>
              <span className="font-semibold">{results.sleep_hours}h</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Physical Tiredness:</span>
              <span className="font-semibold">{results.physical_tiredness}/5</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Mental Tiredness:</span>
              <span className="font-semibold">{results.mental_tiredness}/5</span>
            </p>
          </div>
        </motion.div>

        {/* Mood & Stress */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-emerald-50 p-6 rounded-xl"
        >
          <div className="flex items-center mb-4">
            <Brain className="text-emerald-600 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-emerald-800">Mental State</h3>
          </div>
          <div className="space-y-2">
            <p className="flex justify-between">
              <span className="text-gray-600">Mood Level:</span>
              <span className="font-semibold">{results.mood}/5</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Stress Level:</span>
              <span className="font-semibold">{results.stress_level}/5</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Motivation:</span>
              <span className="font-semibold">{results.motivation_level}/5</span>
            </p>
          </div>
        </motion.div>

        {/* Wellness Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-emerald-50 p-6 rounded-xl"
        >
          <div className="flex items-center mb-4">
            <Heart className="text-emerald-600 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-emerald-800">Daily Activities</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${results.trained ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
              <span className="text-gray-600">Exercise</span>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${results.meditated ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
              <span className="text-gray-600">Meditation</span>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${results.ate_healthy ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
              <span className="text-gray-600">Healthy Eating</span>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${results.social_interaction ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
              <span className="text-gray-600">Social Interaction</span>
            </div>
          </div>
        </motion.div>

        {/* Consumption */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-emerald-50 p-6 rounded-xl"
        >
          <div className="flex items-center mb-4">
            <Droplet className="text-emerald-600 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-emerald-800">Consumption</h3>
          </div>
          <div className="space-y-2">
            <p className="flex justify-between">
              <span className="text-gray-600">Water Intake:</span>
              <span className="font-semibold">{results.water_liters}L</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Caffeine:</span>
              <span className="font-semibold">{results.caffeine_cups} cups</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* New Suggestions Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 border-t border-gray-100 pt-8"
      >
        <div className="flex items-center mb-6">
          <Lightbulb className="text-emerald-600 mr-2" size={24} />
          <h3 className="text-2xl font-bold text-emerald-700">Personalized Suggestions</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {generateSuggestions(results).map((suggestion, index) => (
            <motion.div
              key={suggestion.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="bg-emerald-50 rounded-xl p-6"
            >
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-2">{suggestion.icon}</span>
                <h4 className="text-lg font-semibold text-emerald-800">{suggestion.title}</h4>
              </div>
              <ul className="space-y-2">
                {suggestion.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="mt-8 flex justify-center space-x-4">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={() => {
            console.log('Navigating to history page...');
            // Navigate to history page without using replace to maintain history stack
            navigate('/history');
          }}
          className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
        >
          View History
        </motion.button>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={() => navigate('/garden')}
          className="px-6 py-3 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition-colors"
        >
          Visit Garden
        </motion.button>
      </div>
      
      {/* Information about the next available survey */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Take some time to review your suggestions and implement them in your daily routine.</p>
        <p className="mt-2">Remember to check back tomorrow to track your mental wellness journey!</p>
      </div>
    </motion.div>
  );
};

export default SurveyResults; 