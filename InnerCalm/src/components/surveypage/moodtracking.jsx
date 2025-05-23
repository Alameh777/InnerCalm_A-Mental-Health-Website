import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import WelcomeScreen from './welcomemood';
import SurveyResults from './SurveyResults';
import ChatbotPopup from '../ChatbotPopup';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:8000'; // Laravel backend URL
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const questions = [
  {
    title: 'Sleep Hours',
    type: 'number',
    question: 'How many hours did you sleep last night?',
    min: 0,
    max: 24
  },
  {
    title: 'Trained',
    type: 'boolean',
    question: 'Did you exercise today?',
    default: false
  },
  {
    title: 'Mood',
    type: 'scale',
    question: 'Rate your overall mood today (1-5)',
    min: 1,
    max: 5,
    default: 3
  },
  {
    title: 'Stress Level',
    type: 'scale',
    question: 'Rate your stress level today (1-5)',
    min: 1,
    max: 5,
    default: 3
  },
  {
    title: 'Water Liters',
    type: 'number',
    question: 'How many liters of water did you drink?',
    min: 0,
    max: 10,
    step: 0.1
  },
  {
    title: 'Caffeine Cups',
    type: 'number',
    question: 'How many cups of caffeine did you consume?',
    min: 0,
    max: 10
  },
  {
    title: 'Social Interaction',
    type: 'boolean',
    question: 'Did you have positive social interactions today?',
    default: false
  },
  {
    title: 'Screen Hours',
    type: 'number',
    question: 'Hours spent on screens today?',
    min: 0,
    max: 24
  },
  {
    title: 'Ate Healthy',
    type: 'boolean',
    question: 'Did you eat healthy meals today?',
    default: false
  },
  {
    title: 'Spent Time Outside',
    type: 'boolean',
    question: 'Did you spend time outdoors today?',
    default: false
  },
  {
    title: 'Meditated',
    type: 'boolean',
    question: 'Did you meditate today?',
    default: false
  },
  {
    title: 'Work Study Hours',
    type: 'number',
    question: 'Hours spent working/studying?',
    min: 0,
    max: 16
  },
  {
    title: 'Enough Sleep Week',
    type: 'boolean',
    question: 'Did you get enough sleep this week?',
    default: false
  },
  {
    title: 'Physical Tiredness',
    type: 'scale',
    question: 'Physical tiredness level (1-5)',
    min: 1,
    max: 5,
    default: 3
  },
  {
    title: 'Mental Tiredness',
    type: 'scale',
    question: 'Mental tiredness level (1-5)',
    min: 1,
    max: 5,
    default: 3
  },
  {
    title: 'Motivation Level',
    type: 'scale',
    question: 'Motivation level today (1-5)',
    min: 1,
    max: 5,
    default: 3
  },
  {
    title: 'Suicidal Thoughts',
    type: 'boolean',
    question: 'Had any suicidal thoughts today?',
    default: false
  }
];

function MoodTracking() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [canSubmit, setCanSubmit] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [surveyResults, setSurveyResults] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [userName, setUserName] = useState("");
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [submissionTime, setSubmissionTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('MoodTracking component initialized');
    // Get user info from localStorage and API
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token found, fetching user data');
      axios.get('/api/user')
        .then(response => {
          const user = response.data;
          console.log('User data received:', user);
          setUserName(user.name);
          localStorage.setItem('userName', user.name);
          // Store the user ID
          localStorage.setItem('userId', user.id);
          setIsFirstTime(!localStorage.getItem('hasVisitedBefore'));
          localStorage.setItem('hasVisitedBefore', 'true');
          // Check submission status after getting user data
          checkSubmissionStatus(user.id);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          const storedUserName = localStorage.getItem('userName');
          if (storedUserName) {
            setUserName(storedUserName);
            setIsFirstTime(false);
          }
          // Still check submission status with stored userId
          const userId = localStorage.getItem('userId');
          if (userId) {
            checkSubmissionStatus(userId);
          }
        });
    } else {
      console.log('No token found, user not logged in');
    }
  }, []);

  // Add effect to recheck submission status when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const userId = localStorage.getItem('userId');
        if (userId) {
          checkSubmissionStatus(userId);
        }
      }
    };

    // Check when the page becomes visible again
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Check immediately in case we're returning from another page
    const userId = localStorage.getItem('userId');
    if (userId) {
      checkSubmissionStatus(userId);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const checkSubmissionStatus = async (userId) => {
    try {
      if (userId) {
        const lastSubmissionTime = localStorage.getItem(`lastSubmission_${userId}`);
        if (lastSubmissionTime) {
          const lastSubmission = new Date(lastSubmissionTime);
          const now = new Date();
          const timeDiff = now - lastSubmission;
          const hoursDiff = timeDiff / (1000 * 60 * 60);

          if (hoursDiff < 24) {
            setCanSubmit(false);
            setSubmissionTime(lastSubmissionTime);
            // Calculate and set the time left immediately
            const nextAvailable = new Date(lastSubmission.getTime() + 24 * 60 * 60 * 1000);
            const difference = nextAvailable - now;
            if (difference > 0) {
              const hours = Math.floor(difference / (1000 * 60 * 60));
              const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
              setTimeLeft({ hours, minutes });
            }
            return;
          }
        }

        // Also check the API for the last submission time
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const response = await axios.get('/api/can-submit', {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!response.data.can_submit && response.data.last_submission) {
              setCanSubmit(false);
              setSubmissionTime(response.data.last_submission);
              if (response.data.next_available_time) {
                const nextAvailable = new Date(response.data.next_available_time);
                const now = new Date();
                const difference = nextAvailable - now;
                if (difference > 0) {
                  const hours = Math.floor(difference / (1000 * 60 * 60));
                  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                  setTimeLeft({ hours, minutes });
                }
              }
              return;
            }
          }
        } catch (apiError) {
          console.error('Error checking submission status from API:', apiError);
          // Continue with local storage check if API fails
        }
      }
      
      setCanSubmit(true);
      setSubmissionTime(null);
      setTimeLeft(null);
    } catch (error) {
      console.error('Error checking submission status:', error);
      // In case of error, default to not allowing submission
      setCanSubmit(false);
      setTimeLeft({ hours: 24, minutes: 0 });
    }
  };

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
        return { hours, minutes };
      }
      return null;
    };

    const updateTimer = () => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      if (newTimeLeft === null) {
        // Time is up, user can submit again
        setCanSubmit(true);
        setSubmissionTime(null);
      }
    };

    // Initial calculation
    updateTimer();

    // Update every minute
    const timer = setInterval(updateTimer, 60000);

    return () => clearInterval(timer);
  }, [submissionTime]);

  useEffect(() => {
    // Initialize answers with default values
    const defaultAnswers = {};
    questions.forEach(q => {
      if (q.type === 'number') {
        defaultAnswers[q.title] = q.min || 0;
      } else if (q.type === 'boolean') {
        defaultAnswers[q.title] = false;
      } else if (q.type === 'scale') {
        defaultAnswers[q.title] = 3;
      }
    });
    setAnswers(prev => ({...defaultAnswers, ...prev}));
  }, []);

  const handleStartSurvey = () => {
    setShowWelcome(false);
  };

  const handleInputChange = (questionTitle, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionTitle]: value
    }));
  };

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      await handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      // Create survey data object with correct keys matching the questions array
      const surveyData = {
        sleep_hours: answers['Sleep Hours'] || 0,
        trained: answers['Trained'] || false,
        mood: answers['Mood'] || 3,
        stress_level: answers['Stress Level'] || 3,
        water_liters: answers['Water Liters'] || 0,
        caffeine_cups: answers['Caffeine Cups'] || 0,
        social_interaction: answers['Social Interaction'] || false,
        screen_hours: answers['Screen Hours'] || 0,
        ate_healthy: answers['Ate Healthy'] || false,
        spent_time_outside: answers['Spent Time Outside'] || false,
        meditated: answers['Meditated'] || false,
        work_study_hours: answers['Work Study Hours'] || 0,
        enough_sleep_week: answers['Enough Sleep Week'] || false,
        physical_tiredness: answers['Physical Tiredness'] || 3,
        mental_tiredness: answers['Mental Tiredness'] || 3,
        motivation_level: answers['Motivation Level'] || 3,
        suicidal_thoughts: answers['Suicidal Thoughts'] || false
      };

      // Add metadata
      const surveyWithMetadata = {
        ...surveyData,
        id: Date.now().toString(), // Unique ID for the survey
        created_at: new Date().toISOString(),
        user_id: userId
      };

      console.log('Submitting survey with data:', surveyWithMetadata);

      // Try to submit to API first
      if (token) {
        try {
          const response = await axios.post('/api/survey-submit', surveyData, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('Survey submitted to API successfully:', response.data);
        } catch (apiError) {
          console.error('API submission failed:', apiError);
          // Continue with local storage even if API fails
        }
      }

      // Store in localStorage
      if (userId) {
        const userSurveysKey = `surveys_${userId}`;
        const existingSurveys = JSON.parse(localStorage.getItem(userSurveysKey) || '[]');
        localStorage.setItem(userSurveysKey, JSON.stringify([surveyWithMetadata, ...existingSurveys]));
        localStorage.setItem(`lastSubmission_${userId}`, surveyWithMetadata.created_at);
      }

      // Set results and submission time for display
      setSurveyResults(surveyWithMetadata);
      setSubmissionTime(surveyWithMetadata.created_at);
      setLoading(false);

    } catch (error) {
      console.error('Error submitting mood tracking:', error);
      setError('Error submitting the survey. Please try again or contact support.');
      setLoading(false);
    }
  };

  if (!canSubmit) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-white via-emerald-50 to-emerald-100">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-emerald-700 mb-4">Survey Not Available Yet</h2>
          <p className="text-gray-600 mb-6">You can submit a new survey after 24 hours from your last submission.</p>
          {timeLeft && (
            <div className="text-lg text-orange-600 font-medium mb-6">
              Next survey available in: {timeLeft.hours}h {timeLeft.minutes}m
            </div>
          )}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/history')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg text-lg transition-all duration-300"
            >
              View Survey History
            </button>
            <button
              onClick={() => navigate('/garden')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg text-lg transition-all duration-300"
            >
              View Your Garden
            </button>
          </div>
        </div>
        <ChatbotPopup 
          userName={userName}
          chatbotPageUrl="/chatbot"
          onDismiss={() => {}}
        />
      </div>
    );
  }

  if (surveyResults) {
    return (
      <>
        <div className="min-h-screen p-6 bg-gradient-to-br from-white via-emerald-50 to-emerald-100">
          <SurveyResults results={surveyResults} submissionTime={submissionTime} />
        </div>
      </>
    );
  }

  if (showWelcome) {
    return (
      <>
        <WelcomeScreen 
          userName={userName} 
          onStart={handleStartSurvey}
        />
      </>
    );
  }

  const currentQuestion = questions[currentStep];

  const renderInput = () => {
    switch (currentQuestion.type) {
      case 'number':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative"
          >
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => {
                  const currentValue = answers[currentQuestion.title];
                  if (currentValue === undefined || currentValue === '') return;
                  const newValue = Math.max(currentValue - (currentQuestion.step || 1), currentQuestion.min);
                  handleInputChange(currentQuestion.title, newValue);
                }}
                className="w-14 h-14 rounded-full bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center text-emerald-700 text-2xl font-bold transition-colors"
              >
                -
              </button>
              <input
                type="number"
                min={currentQuestion.min}
                max={currentQuestion.max}
                step={currentQuestion.step || 1}
                value={answers[currentQuestion.title] === undefined ? '' : answers[currentQuestion.title]}
                onChange={e => handleInputChange(currentQuestion.title, e.target.value === '' ? undefined : parseFloat(e.target.value))}
                className="w-32 text-center text-4xl font-bold p-4 border-2 border-emerald-200 rounded-2xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0"
              />
              <button
                onClick={() => {
                  const currentValue = answers[currentQuestion.title];
                  const startValue = currentValue === undefined || currentValue === '' ? 0 : currentValue;
                  const newValue = Math.min(startValue + (currentQuestion.step || 1), currentQuestion.max);
                  handleInputChange(currentQuestion.title, newValue);
                }}
                className="w-14 h-14 rounded-full bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center text-emerald-700 text-2xl font-bold transition-colors"
              >
                +
              </button>
            </div>
            <div className="text-center mt-4 text-gray-500">
              Min: {currentQuestion.min} | Max: {currentQuestion.max}
            </div>
          </motion.div>
        );

      case 'boolean':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-2 gap-4 max-w-md mx-auto"
          >
            {['Yes', 'No'].map(option => (
              <button
                key={option}
                onClick={() => handleInputChange(currentQuestion.title, option === 'Yes')}
                className={`p-6 rounded-2xl text-xl font-medium transition-all transform hover:scale-105 ${
                  answers[currentQuestion.title] === (option === 'Yes')
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {option}
              </button>
            ))}
          </motion.div>
        );

      case 'scale':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 max-w-md mx-auto"
          >
            <div className="flex justify-between px-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleInputChange(currentQuestion.title, value)}
                  className={`w-16 h-16 rounded-2xl text-xl font-medium transition-all transform hover:scale-105 ${
                    answers[currentQuestion.title] === value
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-500 px-2">
              <span>Not at all</span>
              <span>Very much</span>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-white via-emerald-50 to-emerald-100">
        <motion.div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8 md:p-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-500">Question {currentStep + 1} of {questions.length}</span>
              <span className="text-sm font-medium text-emerald-600">{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Navigation Pills */}
          <div className="mb-8 flex flex-wrap gap-2 justify-center">
            {questions.map((q, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  currentStep === index
                    ? 'bg-emerald-500 w-6'
                    : answers[q.title] !== undefined
                    ? 'bg-emerald-200'
                    : 'bg-gray-200'
                }`}
                title={`Question ${index + 1}`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  {currentQuestion.title}
                </h2>
                <p className="text-xl text-gray-600">
                  {currentQuestion.question}
                </p>
              </div>
              
              <div className="py-8">
                {renderInput()}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 0 || loading}
                  className={`px-6 py-3 rounded-xl text-white text-lg font-semibold transition-all ${
                    currentStep === 0 || loading
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={answers[currentQuestion.title] === undefined || loading}
                  className={`px-6 py-3 rounded-xl text-white text-lg font-semibold transition-all ${
                    answers[currentQuestion.title] === undefined || loading
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg'
                  }`}
                >
                  {loading ? 'Submitting...' : currentStep === questions.length - 1 ? 'Submit' : 'Next'}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}

export default MoodTracking;