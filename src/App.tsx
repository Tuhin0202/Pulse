/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { TopNav } from './components/TopNav';
import { Hero } from './components/Hero';
import { FeatureGrid } from './components/FeatureGrid';
import { Login } from './components/Login';
import { CreateAccount } from './components/CreateAccount';
import { ForgotPassword } from './components/ForgotPassword';
import { EmailVerification } from './components/EmailVerification';
import { MobileVerification } from './components/MobileVerification';
import { DoctorProfileSetup } from './components/DoctorProfileSetup';
import { PatientProfileSetup } from './components/PatientProfileSetup';
import { DoctorDashboard } from './components/DoctorDashboard';
import { PatientDashboard } from './components/PatientDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ScrollToTop } from './components/ScrollToTop';

export default function App() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/doctor/') || location.pathname.startsWith('/patient/') || location.pathname === '/health-assistant';
  const showUserIconsRoutes = ['/signup', '/verify-email', '/verify-phone', '/reset-password'];
  const showUserIcons = showUserIconsRoutes.includes(location.pathname);
  
  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-primary-fixed selection:text-on-primary-fixed antialiased">
      <ScrollToTop />
      {!isDashboardRoute && (
        <TopNav 
          showUserIcons={showUserIcons} 
        />
      )}
      <main className={`relative ${!isDashboardRoute ? 'pt-[72px]' : ''} min-h-screen overflow-hidden`}>
        {!isDashboardRoute && <div className="absolute inset-0 hero-gradient -z-10" />}
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <FeatureGrid />
            </>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<CreateAccount mode="register" />} />
          <Route path="/forgot-password" element={<ForgotPassword mode="forgot-password" />} />
          <Route path="/reset-password" element={<CreateAccount mode="reset-password" />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/verify-phone" element={<MobileVerification />} />
          
          <Route path="/doctor/setup" element={<ProtectedRoute><DoctorProfileSetup /></ProtectedRoute>} />
          <Route path="/patient/setup" element={<ProtectedRoute><PatientProfileSetup /></ProtectedRoute>} />
          <Route path="/patient/profile/edit" element={<ProtectedRoute><PatientProfileSetup /></ProtectedRoute>} />
          
          <Route path="/doctor/dashboard" element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/doctor/patients" element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/doctor/schedule" element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/doctor/patient/:id" element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/doctor/profile" element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/doctor/profile/edit" element={<ProtectedRoute><DoctorProfileSetup /></ProtectedRoute>} />
          
          <Route path="/patient/dashboard" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
          <Route path="/patient/appointments" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
          <Route path="/patient/prescriptions" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
          <Route path="/patient/settings" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
          <Route path="/patient/doctor/:id" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
          <Route path="/patient/book/:doctorId" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
          <Route path="/health-assistant" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isDashboardRoute && (
        <footer className="bg-surface-container-low border-t border-outline-variant h-24" />
      )}
    </div>
  );
}
