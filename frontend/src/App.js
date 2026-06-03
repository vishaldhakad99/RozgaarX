import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import VoiceCommand from './components/VoiceCommand';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import WorkerDetailPage from './pages/WorkerDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PostJobPage from './pages/PostJobPage';
import JobsPage from './pages/JobsPage';
import BulkHirePage from './pages/BulkHirePage';
import WorkerProfileSetup from './pages/WorkerProfileSetup';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="app">
            <Navbar />
            <VoiceCommand />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/worker/:id" element={<WorkerDetailPage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute><DashboardPage /></ProtectedRoute>
                } />
                <Route path="/post-job" element={
                  <ProtectedRoute><PostJobPage /></ProtectedRoute>
                } />
                <Route path="/bulk-hire" element={
                  <ProtectedRoute><BulkHirePage /></ProtectedRoute>
                } />
                <Route path="/worker-setup" element={
                  <ProtectedRoute><WorkerProfileSetup /></ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: { fontFamily: "'Baloo 2', sans-serif", fontSize: '14px' }
            }}
          />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
