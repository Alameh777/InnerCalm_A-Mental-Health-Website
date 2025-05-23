import React, { useState, useEffect } from 'react';

// Props expected by the component:
// - userName: string (The name of the user, fetched from Laravel)
// - chatbotPageUrl: string (The URL of the chatbot page, e.g., '/chatbot' or 'chatbot.jsx')
// - onDismiss: function (Optional: A function to call when the popup is dismissed if you want to manage visibility state in the parent)

const ChatbotPopup = ({ userName, chatbotPageUrl, onDismiss }) => {
  // State to control the visibility of the popup
  const [isVisible, setIsVisible] = useState(false);

  // Effect to show the popup after a short delay when the component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500); // Show popup after 1.5 seconds

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  // Handler for clicking the main popup message
  const handlePopupClick = () => {
    // Redirect to the chatbot page
    window.location.href = chatbotPageUrl;
  };

  // Handler for the close button
  const handleCloseClick = (e) => {
    e.stopPropagation(); // Prevent the popup click event from firing
    setIsVisible(false);
    if (onDismiss) {
      onDismiss(); // Notify parent component if a dismiss handler is provided
    }
  };

  // If the popup is not visible, don't render anything
  if (!isVisible) {
    return null;
  }

  // Render the popup
  return (
    // Outer container for positioning
    // Fixed position at bottom-right, with z-index to ensure it's on top
    <div className="fixed bottom-6 right-6 z-50 flex items-end justify-end">
      {/* Popup message card with white background and subtle shadow */}
      <div
        className="bg-white text-emerald-900 p-6 rounded-xl shadow-lg max-w-sm cursor-pointer transform transition-all duration-300 ease-out hover:scale-105 active:scale-95 border border-emerald-300"
        onClick={handlePopupClick}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        {/* Close button - emerald color */}
        <button
          onClick={handleCloseClick}
          className="absolute top-2 right-2 text-emerald-500 hover:text-emerald-900 transition-colors"
          aria-label="Close popup"
        >
          {/* Simple SVG X icon for close button */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Popup content */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold mb-2 text-emerald-900">
            👋 Hey {userName || 'there'}! {/* Display username or a fallback */}
          </h3>
          <p className="text-sm mb-3 text-emerald-700">
            Feeling like chatting or need a friendly ear? Our chatbot is here to help you navigate your thoughts and feelings.
          </p>
          <p className="text-xs font-medium text-emerald-600 hover:text-emerald-900 transition-colors">
            Click here to start a conversation!
          </p>
        </div>
      </div>
    </div>
  );
};

// To use this component in your mood tracking page:
// 1. Save this code as ChatbotPopup.jsx (or similar) in your components folder.
// 2. Import it into your mood tracking page file:
//    import ChatbotPopup from './path/to/ChatbotPopup';
// 3. Render it within your mood tracking page's component, passing the required props:
//    <ChatbotPopup
//      userName={yourUserNameVariable}      // e.g., from Laravel
//      chatbotPageUrl="/your-chatbot-route" // e.g., "/chatbot.jsx" or "/chat"
//      onDismiss={() => console.log("Popup dismissed")} // Optional: handle dismiss
//    />

export default ChatbotPopup; // Exporting the component for use in other files-