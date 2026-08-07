/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
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

export type Page = 'home' | 'login' | 'register' | 'forgot-password' | 'email-verification' | 'mobile-verification' | 'doctor-profile' | 'patient-profile' | 'reset-password' | 'dashboard';
export type Role = 'doctor' | 'patient';
export type Flow = 'register' | 'forgot-password' | 'login';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [loginRole, setLoginRole] = useState<Role>('doctor');
  const [verificationContact, setVerificationContact] = useState('');
  const [currentFlow, setCurrentFlow] = useState<Flow>('login');
  
  const [patientData, setPatientData] = useState<PatientData>({
    fullName: 'John Doe',
    dateOfBirth: '1992-05-12',
    bloodGroup: 'O+',
    address: '123 Health St, Wellness District, San Francisco, CA 94103',
    phone: '+1 (555) 123-4567',
    email: 'john.doe@email.com'
  });
  
  const [doctorData, setDoctorData] = useState<DoctorData>({
    fullName: 'Dr. Jane Smith',
    qualification: 'MBBS, MD',
    specialization: 'Cardiology',
    experience: '12',
    clinicName: 'Pulse Wellness Center',
    city: 'Mumbai',
    contactInfo: '+91 98765 43210',
    address: 'Mumbai, Maharashtra'
  });

  const handleNavigateToLogin = (role: Role) => {
    setLoginRole(role);
    setCurrentPage('login');
    setCurrentFlow('login');
  };

  const handleNavigateToHome = () => {
    setCurrentPage('home');
  };

  const handleNavigateToRegister = (role: Role) => {
    setLoginRole(role);
    setCurrentPage('register');
    setCurrentFlow('register');
  };

  const handleNavigateToForgotPassword = (role: Role) => {
    setLoginRole(role);
    setCurrentPage('forgot-password');
    setCurrentFlow('forgot-password');
  };

  const handleVerificationRequest = (type: 'email' | 'phone', contact: string) => {
    setVerificationContact(contact);
    if (type === 'email') {
      setCurrentPage('email-verification');
    } else {
      setCurrentPage('mobile-verification');
    }
  };

  const handleVerified = () => {
    if (currentFlow === 'forgot-password' || currentFlow === 'register') {
      setCurrentPage('reset-password');
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handlePatientProfileComplete = (data: Partial<PatientData>) => {
    setPatientData(prev => ({ ...prev, ...data }));
    setCurrentPage('dashboard');
  };

  const handleDoctorProfileComplete = (data: Partial<DoctorData>) => {
    setDoctorData(prev => ({ ...prev, ...data }));
    setCurrentPage('dashboard');
  };

  const handleSetPasswordComplete = () => {
    if (currentFlow === 'register') {
      if (loginRole === 'doctor') {
        setCurrentPage('doctor-profile');
      } else {
        setCurrentPage('patient-profile');
      }
    } else {
      setCurrentPage('login');
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-primary-fixed selection:text-on-primary-fixed antialiased">
      {currentPage !== 'dashboard' && (
        <TopNav 
          onHomeClick={handleNavigateToHome} 
          showUserIcons={['register', 'email-verification', 'mobile-verification'].includes(currentPage)} 
        />
      )}
      <main className={`relative ${currentPage !== 'dashboard' ? 'pt-[72px]' : ''} min-h-screen overflow-hidden`}>
        {currentPage !== 'dashboard' && <div className="absolute inset-0 hero-gradient -z-10" />}
        {currentPage === 'home' ? (
          <>
            <Hero onGetStarted={handleNavigateToLogin} />
            <FeatureGrid />
          </>
        ) : currentPage === 'dashboard' ? (
          loginRole === 'doctor' ? (
            <DoctorDashboard doctorData={doctorData} onEditProfile={() => setCurrentPage('doctor-profile')} />
          ) : (
            <PatientDashboard patientData={patientData} onEditProfile={() => setCurrentPage('patient-profile')} />
          )
        ) : currentPage === 'login' ? (
          <Login 
            initialRole={loginRole} 
            onCreateAccount={handleNavigateToRegister} 
            onForgotPassword={handleNavigateToForgotPassword}
            onSignIn={(role) => {
              setLoginRole(role);
              handleVerified();
            }}
          />
        ) : currentPage === 'forgot-password' ? (
          <ForgotPassword 
            onBack={() => setCurrentPage('login')} 
            onVerify={handleVerificationRequest}
          />
        ) : currentPage === 'email-verification' ? (
          <EmailVerification 
            email={verificationContact} 
            onBack={() => setCurrentPage('login')} 
            onVerified={handleVerified}
          />
        ) : currentPage === 'mobile-verification' ? (
          <MobileVerification 
            phone={verificationContact} 
            onBack={() => setCurrentPage('login')} 
            onVerified={handleVerified}
          />
        ) : currentPage === 'doctor-profile' ? (
          <DoctorProfileSetup initialData={doctorData} onComplete={handleDoctorProfileComplete} />
        ) : currentPage === 'patient-profile' ? (
          <PatientProfileSetup initialData={patientData} onComplete={handlePatientProfileComplete} />
        ) : currentPage === 'reset-password' ? (
          <CreateAccount 
            onBack={() => setCurrentPage('login')} 
            onUpdateCredentials={handleSetPasswordComplete}
            initialContact={verificationContact}
            mode={currentFlow === 'register' ? 'register' : 'reset-password'}
          />
        ) : (
          <ForgotPassword
            onBack={() => setCurrentPage('login')}
            onVerify={handleVerificationRequest}
            mode="register"
          />
        )}
      </main>
      {currentPage === 'home' && (
        <footer className="bg-surface-container-low border-t border-outline-variant h-24" />
      )}
    </div>
  );
}
