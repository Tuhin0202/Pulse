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
import { PatientData, DoctorData } from './types';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [patientData, setPatientData] = useState<PatientData>({
    fullName: '',
    dateOfBirth: '',
    bloodGroup: '',
    address: '',
    phone: '',
    email: '',
    bloodPressure: '',
    heartRate: '',
    height: '',
    weight: ''
  });
  
  const [doctorData, setDoctorData] = useState<DoctorData>({
    fullName: '',
    qualification: '',
    specialization: '',
    experience: '',
    clinicName: '',
    city: '',
    contactInfo: '',
    address: '',
    licenseNumber: '',
    licenseFileName: '',
    licenseStatus: 'Not Uploaded'
  });

  const isDashboardRoute = location.pathname.startsWith('/doctor/') || location.pathname.startsWith('/patient/') || location.pathname === '/health-assistant';
  const showUserIconsRoutes = ['/signup', '/verify-email', '/verify-phone', '/reset-password'];
  const showUserIcons = showUserIconsRoutes.includes(location.pathname);
  
  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-primary-fixed selection:text-on-primary-fixed antialiased">
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
          
          <Route path="/doctor/setup" element={<DoctorProfileSetup initialData={doctorData} onComplete={(data) => { setDoctorData(prev => ({ ...prev, ...data })); navigate('/doctor/dashboard'); }} />} />
          <Route path="/patient/setup" element={<PatientProfileSetup initialData={patientData} onComplete={(data) => { setPatientData(prev => ({ ...prev, ...data })); navigate('/patient/dashboard'); }} />} />
          <Route path="/patient/profile/edit" element={<PatientProfileSetup initialData={patientData} onComplete={(data) => { setPatientData(prev => ({ ...prev, ...data })); navigate('/patient/dashboard'); }} />} />
          
          <Route path="/doctor/dashboard" element={<DoctorDashboard doctorData={doctorData} patientData={patientData} onUpdatePatientData={(data) => setPatientData(prev => ({ ...prev, ...data }))} />} />
          <Route path="/doctor/patients" element={<DoctorDashboard doctorData={doctorData} patientData={patientData} onUpdatePatientData={(data) => setPatientData(prev => ({ ...prev, ...data }))} />} />
          <Route path="/doctor/schedule" element={<DoctorDashboard doctorData={doctorData} patientData={patientData} onUpdatePatientData={(data) => setPatientData(prev => ({ ...prev, ...data }))} />} />
          <Route path="/doctor/patient/:id" element={<DoctorDashboard doctorData={doctorData} patientData={patientData} onUpdatePatientData={(data) => setPatientData(prev => ({ ...prev, ...data }))} />} />
          <Route path="/doctor/profile" element={<DoctorDashboard doctorData={doctorData} patientData={patientData} onUpdatePatientData={(data) => setPatientData(prev => ({ ...prev, ...data }))} />} />
          <Route path="/doctor/profile/edit" element={<DoctorProfileSetup initialData={doctorData} onComplete={(data) => { setDoctorData(prev => ({ ...prev, ...data })); navigate('/doctor/dashboard'); }} />} />
          
          <Route path="/patient/dashboard" element={<PatientDashboard patientData={patientData} />} />
          <Route path="/patient/appointments" element={<PatientDashboard patientData={patientData} />} />
          <Route path="/patient/prescriptions" element={<PatientDashboard patientData={patientData} />} />
          <Route path="/patient/settings" element={<PatientDashboard patientData={patientData} />} />
          <Route path="/patient/doctor/:id" element={<PatientDashboard patientData={patientData} />} />
          <Route path="/patient/book/:doctorId" element={<PatientDashboard patientData={patientData} />} />
          <Route path="/health-assistant" element={<PatientDashboard patientData={patientData} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isDashboardRoute && (
        <footer className="bg-surface-container-low border-t border-outline-variant h-24" />
      )}
    </div>
  );
}
