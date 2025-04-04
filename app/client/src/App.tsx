import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from './core/context/ThemeContext';
import { AuthProvider } from './core/context/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProfilePage from './components/profile/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import MessagesPage from './pages/MessagesPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ScrollToTop from './components/utils/ScrollToTop';
import ErrorBoundary from './components/error/ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
