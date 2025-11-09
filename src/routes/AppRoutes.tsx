import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth';
import { CommunityAccessGuard } from '@/components/community/CommunityAccessGuard';
import LandingPage from '@/pages/LandingPage';
import Dashboard from '@/pages/Dashboard';
import GoalsPage from '@/pages/GoalsPage';
import WellbeingPage from '@/pages/WellbeingPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import InsightsPage from '@/pages/InsightsPage';
import CommunityPage from '@/pages/CommunityPage';
import SettingsPage from '@/pages/SettingsPage';
import NotificationsPage from '@/pages/NotificationsPage';
import TestAuthPage from '@/TestAuthPage';
import TestLogin from '@/TestLogin';


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/test-auth" element={<TestAuthPage />} />
      <Route path="/test-login" element={<TestLogin />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/goals" 
        element={
          <ProtectedRoute>
            <GoalsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/wellbeing" 
        element={
          <ProtectedRoute>
            <WellbeingPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/insights" 
        element={
          <ProtectedRoute>
            <InsightsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/community" 
        element={
          <ProtectedRoute>
            <CommunityAccessGuard>
              <CommunityPage />
            </CommunityAccessGuard>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/notifications" 
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;