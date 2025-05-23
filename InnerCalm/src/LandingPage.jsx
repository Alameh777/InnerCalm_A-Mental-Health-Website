import forestpic from './assets/thefirstbg.jpg';
import steps from './assets/stepsforest.jpg';
import mentalhealth from './assets/mental-health.jpg';
import React, { useState, useEffect } from 'react';

import { useNavigate } from "react-router-dom";

import { User, MessageSquare, Video, Lock, ArrowRight, Menu, X, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  
  // Function to handle scrolling to sections
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false); 
  };

  // FIXED: Don't pass event object to navigate state
  const navigateToAuth = (mode = 'signin') => {
    // Just pass the mode string, not the event object
    navigate('/auth', { state: { mode } }); 
    setIsMenuOpen(false);
  };

 
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up'); // Add animation class when element enters viewport
          }
         
        });
      },
      {
        threshold: 0.1, // Trigger animation when 10% of the element is visible
      }
    );

    // Select all elements that should be animated on scroll
    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => observer.observe(el));

    // Cleanup: Unobserve elements when the component unmounts
    return () => elements.forEach((el) => observer.unobserve(el));
  }, []); 


  return (
    <div className="bg-emerald-50 min-h-screen font-sans text-gray-800">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="flex justify-between items-center py-3">
          <h1 className="text-2xl font-bold text-emerald-700 pl-8">InnerCalm</h1>
          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-6 items-center pr-6">
            <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-emerald-600 transition duration-300">Features</button>
            <button onClick={() => scrollToSection('about')} className="text-gray-600 hover:text-emerald-600 transition duration-300">About</button>
            <button onClick={() => scrollToSection('privacy')} className="text-gray-600 hover:text-emerald-600 transition duration-300">Privacy</button>
            {/*Sign In Button */}
            <button 
              onClick={() => navigateToAuth('signin')} 
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-5 rounded-full transition duration-300 shadow-md"
            >
              Sign In
            </button>
          </nav>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 focus:outline-none">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 z-40">
            <div className="flex flex-col px-6 py-4 space-y-3">
              <button onClick={() => scrollToSection('features')} className="block text-gray-600 hover:text-emerald-600 transition duration-300 text-left">Features</button>
              <button onClick={() => scrollToSection('about')} className="block text-gray-600 hover:text-emerald-600 transition duration-300 text-left">About</button>
              <button onClick={() => scrollToSection('privacy')} className="block text-gray-600 hover:text-emerald-600 transition duration-300 text-left">Privacy</button>
              <button 
                onClick={() => navigateToAuth('signin')} 
                className="mt-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 shadow-md"
              >
                Sign In
              </button>   
            </div>
          </nav>  
        )}
      </header>

      {/*Main section*/}
      <section className="relative h-[90vh] md:h-screen pt-20 pb-32 flex items-center justify-center text-center bg-gradient-to-b from-white to-emerald-100 overflow-hidden"
      >
         {/* Background Image */}
         <img
            src={forestpic}
            alt="Calming forest background"
            className="absolute inset-0 w-full h-full object-cover opacity-50 z-0" 
            onError={(e) => e.target.style.display='none'} 
          />
        <div className="container mx-auto px-6 z-10 relative"> {/* Ensure content is above background */}
          <h2 className="text-4xl md:text-6xl font-bold text-emerald-800 mb-4 leading-tight animate-fade-in-up animation-delay-200">
            Your Journey to Mental Wellness Starts Here.
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-400"> {/* Adjusted text color for contrast */}
            Track your progress, connect with support, and access resources—all in one safe, private space. Take control of your mental health, day by day.
          </p>
          <button onClick={() => scrollToSection('features')} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg transform hover:scale-105 animate-fade-in-up animation-delay-600">
            Explore Features <ArrowRight className="inline ml-2" size={20} />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-center text-emerald-700 mb-16 scroll-animate">
            Tools for Your Wellbeing
          </h3>
          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1: Check-ins */}
            <div className="bg-emerald-50 p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 scroll-animate">
              <div className="flex items-center justify-center bg-emerald-200 rounded-full w-16 h-16 mb-6 mx-auto">
                <User size={32} className="text-emerald-700" />
              </div>
              <h4 className="text-xl font-semibold text-center text-emerald-800 mb-3">Daily Check-ins</h4>
              <p className="text-gray-600 text-center">
                Take a few moments each day to reflect on your mood and progress. Our simple surveys help you track your mental health journey over time.
              </p>
            </div>
            {/* Feature 2: AI Chatbot */}
            <div className="bg-emerald-50 p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 scroll-animate animation-delay-200">
              <div className="flex items-center justify-center bg-emerald-200 rounded-full w-16 h-16 mb-6 mx-auto">
                <MessageSquare size={32} className="text-emerald-700" />
              </div>
              <h4 className="text-xl font-semibold text-center text-emerald-800 mb-3">Supportive Chatbot</h4>
              <p className="text-gray-600 text-center">
                Feeling overwhelmed? Our AI companion is here to listen, offer coping strategies, provide a non-judgmental space to talk, and even connect users directly to therapists.
              </p>
            </div>
            {/* Feature 3: Resource Library */}
            <div className="bg-emerald-50 p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 scroll-animate animation-delay-400">
              <div className="flex items-center justify-center bg-emerald-200 rounded-full w-16 h-16 mb-6 mx-auto">
                <Video size={32} className="text-emerald-700" />
              </div>
              <h4 className="text-xl font-semibold text-center text-emerald-800 mb-3">Resource Library</h4>
              <p className="text-gray-600 text-center">
                Access a curated collection of videos on mindfulness, stress management, coping techniques, and expert advice. Learn at your own pace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-emerald-50">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-center text-emerald-700 mb-12 scroll-animate">
            Simple Steps to a Better You
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="md:w-1/2 scroll-animate">
              <img
                src={steps}
                alt="Illustration showing steps on a path"
                className="rounded-lg shadow-lg w-full opacity-80" // Added opacity
                onError={(e) => e.target.style.display='none'} // Hide if image fails
              />
            </div>
            <div className="md:w-1/2 space-y-6 scroll-animate animation-delay-200">
              {/* Step 1 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mt-1">1</div>
                <div>
                  <h4 className="text-xl font-semibold text-emerald-800 mb-1">Sign Up Securely</h4>
                  <p className="text-gray-600">Create your private account in minutes. Your journey is personal and protected.</p>
                </div>
              </div>
              {/* Step 2 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mt-1">2</div>
                <div>
                  <h4 className="text-xl font-semibold text-emerald-800 mb-1">Check In Daily</h4>
                  <p className="text-gray-600">Use the simple survey to log your mood and thoughts. Consistency is key to understanding patterns.</p>
                </div>
              </div>
              {/* Step 3 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mt-1">3</div>
                <div>
                  <h4 className="text-xl font-semibold text-emerald-800 mb-1">Explore Resources</h4>
                  <p className="text-gray-600">Engage with the chatbot when you need support, watch helpful videos, and learn coping strategies.</p>
                </div>
              </div>
              {/* Step 4 */}
               <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mt-1">4</div>
                <div>
                  <h4 className="text-xl font-semibold text-emerald-800 mb-1">See Your Progress</h4>
                  <p className="text-gray-600">Visualize your mental health trends over time and celebrate your growth.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Mental Health Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-6">
           <div className="flex flex-col md:flex-row items-center justify-between gap-10">
             <div className="md:w-1/2 scroll-animate">
               <h3 className="text-3xl md:text-4xl font-bold text-emerald-700 mb-6">
                   Understanding Mental Health
               </h3>
               <p className="text-gray-600 mb-4 leading-relaxed">
                   Mental health is just as important as physical health. It affects how we think, feel, and act. Nurturing your mental wellbeing can lead to improved mood, better relationships, and increased resilience to life's challenges.
               </p>
               <p className="text-gray-600 mb-4 leading-relaxed">
                   It's okay not to be okay, and seeking help is a sign of strength. Many effective strategies can be practiced for free, right from the comfort of your home.
               </p>
               <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                   <li>Mindfulness and meditation practices</li>
                   <li>Maintaining a balanced diet and sleep schedule</li>
                   <li>Connecting with supportive friends or family</li>
                   <li>Journaling to process thoughts and emotions</li>
                   <li>Setting realistic goals and celebrating small wins</li>
               </ul>
               <p className="text-gray-600 leading-relaxed">
                   Our platform provides tools and resources to support you in incorporating these practices into your daily life.
               </p>
             </div>
             <div className="md:w-1/2 scroll-animate animation-delay-200">
               <img
                   src={mentalhealth}
                   alt="Person practicing mindfulness in a calm setting"
                   className="rounded-lg shadow-lg w-full opacity-90" // Added opacity
                   onError={(e) => e.target.style.display='none'} // Hide if image fails
               />
             </div>
           </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section id="privacy" className="py-20 bg-emerald-100">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-6 scroll-animate">
             <Lock size={48} className="text-emerald-600" />
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-emerald-700 mb-4 scroll-animate">
            Your Privacy Matters
          </h3>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8 scroll-animate animation-delay-200">
            We are committed to protecting your personal information. Your data is encrypted, stored securely, and is never shared with third parties. Your journey on InnerCalm is confidential and safe. Focus on your wellbeing, knowing your privacy is our priority.
          </p>
          
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-white text-center">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-emerald-700 mb-4 scroll-animate">
            Ready to Start Your Journey?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto scroll-animate animation-delay-200">
            Join InnerCalm today and take the first step towards a healthier, happier you. It's free to sign up.
          </p>
          {/* Updated Sign Up Button */}
          <button 
            onClick={() => navigateToAuth('signup')} 
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg transform hover:scale-105 scroll-animate animation-delay-400"
          >
            Sign Up for Free
          </button>
        </div>
      </section>
           {/* Footer */}
           <footer className="bg-emerald-800 text-emerald-100 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

            {/* Column 1: Brand and About */}
            <div>
              <h4 className="text-xl font-bold mb-3 text-white">InnerCalm</h4>
              <p className="text-sm text-emerald-200 leading-relaxed">
                Your supportive companion for tracking mental wellness and accessing helpful resources.
              </p>
            </div>

            {/* Column 2: Resources & Quote (Replaced Disclaimer) */}
            <div>
              <h5 className="text-lg font-semibold mb-3 text-white">Additional Resources</h5>
              <div className="space-y-2">
                 
                 <a href="https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response" target="_blank" rel="noopener noreferrer" className="block text-emerald-200 hover:text-white transition duration-300 text-sm">WHO - Mental Health</a>
                 <a href="https://www.nimh.nih.gov/health/find-help" target="_blank" rel="noopener noreferrer" className="block text-emerald-200 hover:text-white transition duration-300 text-sm">NIMH - Find Help</a>
                 <a href="https://findahelpline.com/" target="_blank" rel="noopener noreferrer" className="block text-emerald-200 hover:text-white transition duration-300 text-sm">Find a Helpline</a>
                 
              </div>
               
               <p className="text-xs text-emerald-300 mt-4">
                 "You don't have to struggle in silence. Always seek support."
               </p>
            </div>

            {/* Column 3: Social Media */}
            <div>
              <h5 className="text-lg font-semibold mb-3 text-white">Connect With Us</h5>
              <div className="flex space-x-4">
                
                <a href="#" target="_blank" rel="noopener noreferrer" title="Facebook" className="text-emerald-200 hover:text-white transition duration-300">
                  <Facebook size={24} />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" title="Instagram" className="text-emerald-200 hover:text-white transition duration-300">
                  <Instagram size={24} />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" title="Twitter" className="text-emerald-200 hover:text-white transition duration-300">
                  <Twitter size={24} />
                </a>
                 <a href="#" target="_blank" rel="noopener noreferrer" title="LinkedIn" className="text-emerald-200 hover:text-white transition duration-300">
                  <Linkedin size={24} />
                </a>
                
              </div>
            </div>

          </div>

          {/* Bottom Bar: Copyright */}
          <div className="border-t border-emerald-700 pt-8 text-center text-sm text-emerald-300">
            <p>&copy; {new Date().getFullYear()} InnerCalm. All rights reserved.</p>
          </div>
        </div>
      </footer>




      {/* CSS for Animations (Using Styled-JSX as provided) */}
      {/* Note: For standard CRA/Vite, place these styles in your global CSS file (e.g., index.css) */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        /* Staggered animation delays */
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }

        /* Class added by Intersection Observer */
        .scroll-animate {
          opacity: 0; /* Start hidden */
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
          transform: translateY(20px); /* Optional: slight upward move */
        }

        .scroll-animate.fade-in-up {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}