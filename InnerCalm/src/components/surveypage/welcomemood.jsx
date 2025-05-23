import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FloatingShape = ({ className }) => (
  <motion.div
    className={`absolute rounded-full ${className}`}
    animate={{
      y: ["0%", "-50%", "0%"],
      x: ["0%", "30%", "0%"],
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: Math.random() * 5 + 10,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const WelcomeScreen = ({ userName = "User", onStart }) => {
  const [typedText, setTypedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTypedText('');
    const displayName = userName && userName.trim() !== "" ? userName : "User";
    const fullMessage = `WWelcome to InnerCalm, ${displayName}!`;
    
    let index = 0;
    const interval = setInterval(() => {
      if (index === fullMessage.length) {
        clearInterval(interval);
        setIsTypingComplete(true);
        return;
      }
      setTypedText(prev => prev + fullMessage.charAt(index));
      index++;
    }, 40);

    return () => {
      clearInterval(interval);
      setIsTypingComplete(false);
    };
  }, [userName]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Main background with animated background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/assets/animated_background_color_shift.gif')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Content container with glass effect */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-white/40 backdrop-blur-sm rounded-3xl shadow-2xl p-12 max-w-2xl w-full mx-4 border border-white/20"
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-emerald-700 mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {typedText}
        </motion.h1>

        <motion.p 
          className="text-xl text-gray-600 text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: isTypingComplete ? 1 : 0 }}
          transition={{ delay: 0.5 }}
        >
          Let's begin your wellness journey
        </motion.p>

        <motion.p 
          className="text-lg text-gray-600 mb-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isTypingComplete ? 1 : 0 }}
          transition={{ delay: 0.7 }}
        >
          Welcome to your personal mood tracking journey. Monitoring your mood can help you understand patterns and improve your well-being.
        </motion.p>

        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isTypingComplete ? 1 : 0 }}
          transition={{ delay: 0.9 }}
        >
          <button
            onClick={onStart}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Start Daily Check-in
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
