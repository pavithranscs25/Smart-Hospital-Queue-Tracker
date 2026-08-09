import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import { RoleSwitcher } from './components/RoleSwitcher.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';

import { LandingPage } from './pages/LandingPage.jsx';
import { PatientDashboard } from './pages/patient/PatientDashboard.jsx';
import { GetTokenPage } from './pages/patient/GetTokenPage.jsx';
import { TrackQueuePage } from './pages/patient/TrackQueuePage.jsx';
import { PatientHistoryPage } from './pages/patient/PatientHistoryPage.jsx';
import { PatientProfilePage } from './pages/patient/PatientProfilePage.jsx';

import { DoctorDashboardPage } from './pages/doctor/DoctorDashboardPage.jsx';
import { DoctorQueuePage } from './pages/doctor/DoctorQueuePage.jsx';

import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.jsx';
import { LoginPage } from './pages/auth/LoginPage.jsx';

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => {
    return window.location.hash ? window.location.hash.replace('#', '') : '/';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentPath(hash || '/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/':
        return <LandingPage onNavigate={navigate} />;

      // Patient Routes
      case '/patient/dashboard':
        return (
          <ProtectedRoute allowedRoles={['patient', 'admin']}>
            <PatientDashboard onNavigate={navigate} />
          </ProtectedRoute>
        );

      case '/patient/get-token':
        return <GetTokenPage onNavigate={navigate} />;

      case '/patient/track':
        return <TrackQueuePage onNavigate={navigate} />;

      case '/patient/history':
        return (
          <ProtectedRoute allowedRoles={['patient', 'admin']}>
            <PatientHistoryPage onNavigate={navigate} />
          </ProtectedRoute>
        );

      case '/patient/profile':
        return (
          <ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']}>
            <PatientProfilePage />
          </ProtectedRoute>
        );

      // Doctor Routes
      case '/doctor/dashboard':
        return (
          <ProtectedRoute allowedRoles={['doctor', 'admin']}>
            <DoctorDashboardPage />
          </ProtectedRoute>
        );

      case '/doctor/queue':
        return (
          <ProtectedRoute allowedRoles={['doctor', 'admin']}>
            <DoctorQueuePage />
          </ProtectedRoute>
        );

      // Admin Routes
      case '/admin/dashboard':
        return (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        );

      case '/login':
        return <LoginPage onNavigate={navigate} />;

      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
        {/* Top Demo Role Switcher Bar */}
        <RoleSwitcher />

        {/* Header Navigation Bar */}
        <Navbar currentPath={currentPath} onNavigate={navigate} />

        {/* Main Content View */}
        <main className="flex-grow">{renderCurrentPage()}</main>

        {/* Footer */}
        <Footer />
      </div>
    </AuthProvider>
  );
}
