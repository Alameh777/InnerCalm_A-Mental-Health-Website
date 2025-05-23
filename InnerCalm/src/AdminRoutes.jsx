import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import DashboardContent from './components/DashboardContent';
import UsersContent from './components/UsersContent';
import VideosContent from './components/VideosContent';
import SettingsContent from './components/SettingsContent';

const AppRoutes = () => {
  return (
    <>
      <Route index element={<DashboardContent />} />
      <Route path="dashboard" element={<DashboardContent />} />
      <Route path="users" element={<UsersContent />} />
      <Route path="videos" element={<VideosContent />} />
      <Route path="settings" element={<SettingsContent />} />
    </>
  );
};

export default AppRoutes;