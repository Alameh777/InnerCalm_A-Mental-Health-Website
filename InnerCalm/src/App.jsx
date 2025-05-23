import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProfilePage from './components/ProfilePage';
import PublicProfilePage from './components/PublicProfilePage';
import UserList from './components/UserList';
import LandingPage from './LandingPage';
import Auth from './Auth';
import SelfHelpResources from './SelfHelpResources';
import Navbar from './Navbar';
import './index.css';
import AdminLayout from './components/AdminLayout'; // Import AdminLayout directly
import AppRoutes from './AdminRoutes';
import MoodTracking from './components/surveypage/moodtracking';
import UserHistory from './components/UserHistory';
import Chatbot from './components/Chatbot';
import PlantGarden from './components/surveypage/PlantGarden';

// Layout component that handles the Navbar
const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected routes with navbar */}
            <Route element={<Layout />}>
              <Route path="/Chatbot" element={<Chatbot />} />
              <Route path="/selfhelpResources" element={<SelfHelpResources />} />
              <Route path="/mood-tracking" element={<MoodTracking />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/edit" element={<ProfilePage />} />
              <Route path="/profile/:userId" element={<PublicProfilePage />} />
              <Route path="/history" element={<UserHistory />} />
              <Route path="/garden" element={<PlantGarden />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin/*" element={<AdminLayout />}>
              {AppRoutes()}
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;