import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Shield, ArrowRight, ArrowLeft, RectangleEllipsis, BriefcaseMedical, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPhoneNumber, RecaptchaVerifier, linkWithPhoneNumber } from 'firebase/auth';

interface CreateAccountProps {
  mode?: 'register' | 'reset-password';
}

export function CreateAccount({ mode = 'reset-password' }: CreateAccountProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const initialRole = location.state?.role || 'patient';
  const [role, setRole] = useState<'doctor' | 'patient'>(initialRole);
  
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [contactError, setContactError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { label: 'One number', met: /[0-9]/.test(password) },
    { label: 'One special character', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const strength = checks.filter(c => c.met).length;
  const strengthPercentage = (strength / 5) * 100;

  const handleUpdate = async () => {
    const cleanContact = contact.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanContact);
    const isPhone = /^[\d\+\-\s\(\)]{7,20}$/.test(cleanContact);

    if (isEmail || isPhone) {
      setContactError(false);
      setIsLoading(true);
      
      try {
        if (mode === 'register') {
          if (isEmail) {
            // Register with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, cleanContact, password);
            
            // Send Email Verification
            const actionCodeSettings = {
              url: window.location.origin + '/verify-email?context=signup&role=' + role,
              handleCodeInApp: true,
            };
            await sendEmailVerification(userCredential.user, actionCodeSettings);
            
            navigate('/verify-email?context=signup', { state: { role, contact: cleanContact } });
          } else {
            // Register with phone number
            const testPhone = import.meta.env.VITE_TEST_PHONE_NUMBER;
            const testOtp = import.meta.env.VITE_TEST_OTP;
            
            if (cleanContact === testPhone && testOtp) {
              navigate('/verify-phone?context=signup', { state: { role, contact: cleanContact, bypass: true } });
              return;
            }

            const dummyEmail = `${cleanContact.replace(/[^0-9]/g, '')}@phone.pulsehealth.local`;
            try {
              await createUserWithEmailAndPassword(auth, dummyEmail, password);
            } catch (err: any) {
              if (err.code === 'auth/email-already-in-use') {
                throw new Error("Phone number already registered. Please login.");
              }
              throw err;
            }

            if (window.recaptchaVerifier) {
              try { window.recaptchaVerifier.clear(); } catch(e){}
              window.recaptchaVerifier = undefined;
            }

            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
              'size': 'invisible'
            });

            const appVerifier = window.recaptchaVerifier;
            const confirmationResult = await linkWithPhoneNumber(auth.currentUser!, cleanContact, appVerifier);
            window.confirmationResult = confirmationResult;

            navigate('/verify-phone?context=signup', { state: { role, contact: cleanContact } });
          }
        } else {
          // Placeholder for updating password
          navigate('/login');
        }
      } catch (e: any) {
        console.error("Auth Error:", e);
        // Clean up recaptcha on error so user can try again
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = undefined;
        }
        alert("Authentication failed: " + e.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setContactError(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)] p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[540px] bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.05)] overflow-hidden"
      >
        {mode === 'register' && (
          <div className="flex p-4 bg-surface-container-lowest border-b border-outline-variant">
            <div className="flex w-full bg-surface-container-low rounded-lg p-1">
              <button
                onClick={() => setRole('doctor')}
                className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-[14px] leading-[20px] font-medium transition-colors ${
                  role === 'doctor'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-variant/50'
                }`}
              >
                <BriefcaseMedical className="w-4 h-4 mr-2" />
                Doctor
              </button>
              <button
                onClick={() => setRole('patient')}
                className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-[14px] leading-[20px] font-medium transition-colors ${
                  role === 'patient'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-variant/50'
                }`}
              >
                <UserIcon className="w-4 h-4 mr-2" />
                Patient
              </button>
            </div>
          </div>
        )}

        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-center text-primary mb-4">
              <Shield className="w-8 h-8 mr-3" fill="currentColor" />
              <h1 className="text-[28px] leading-[36px] font-bold text-on-surface">
                {mode === 'register' ? 'Set Password' : 'Account Credentials'}
              </h1>
            </div>
            <p className="text-[16px] leading-[24px] text-on-surface-variant">
              {mode === 'register'
                ? 'Create a secure password to protect your medical records.'
                : 'Update your security settings to keep your medical records safe and secure.'}
            </p>
          </div>

          <div className="border-t border-outline-variant/50 pt-8 space-y-6">
            <div className="space-y-1">
              <label className="text-[14px] leading-[16px] font-medium text-on-surface">
                Email or Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="j.doe@medical-portal.com"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-md bg-surface-container-highest focus:outline-none focus:ring-2 transition-colors ${
                    contactError 
                      ? 'border-error focus:border-error focus:ring-error/20' 
                      : 'border-outline-variant focus:border-primary focus:ring-primary-fixed text-on-surface-variant'
                  }`}
                />
              </div>
              {contactError && (
                <p className="text-[12px] font-medium text-error mt-1">
                  Invalid email or phone number
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[14px] leading-[16px] font-medium text-on-surface">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-outline-variant rounded-md bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed transition-colors text-[16px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              <div className="mt-2">
                <div className="flex justify-between text-[12px] font-semibold text-on-surface-variant mb-1">
                  <span>Strength: {strength === 0 ? 'Not set' : strength < 3 ? 'Weak' : strength < 5 ? 'Good' : 'Strong'}</span>
                  <span>{strengthPercentage}%</span>
                </div>
                <div className="h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${strengthPercentage}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-2 mt-4">
                {checks.map((check, i) => (
                  <div key={i} className="flex items-center text-[12px] text-on-surface-variant">
                    <div className={`w-3 h-3 rounded-full border mr-2 flex items-center justify-center flex-shrink-0 ${check.met ? 'bg-primary border-primary' : 'border-outline-variant'}`}>
                      {check.met && (
                        <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-white fill-current">
                          <path d="M4.5 8.5L2 6L2.7 5.3L4.5 7.1L9.3 2.3L10 3L4.5 8.5Z" />
                        </svg>
                      )}
                    </div>
                    {check.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[14px] leading-[16px] font-medium text-on-surface">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <RectangleEllipsis className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 border border-outline-variant rounded-md bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed transition-colors text-[16px]"
                />
              </div>
            </div>

            <div className="pt-6 flex flex-col items-center space-y-4">
              <div id="recaptcha-container"></div>
              <button
                onClick={handleUpdate}
                disabled={isLoading}
                className={`w-full text-on-primary py-2.5 rounded-md text-[16px] font-medium flex items-center justify-center transition-colors ${strength < 5 ? 'bg-[#82a6ea]' : 'bg-primary hover:bg-primary/90'} disabled:opacity-70`}
              >
                {mode === 'register' ? 'Complete Setup' : 'Save Credentials'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              
              <button
                onClick={() => navigate('/login')}
                className="flex items-center text-[14px] font-medium text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cancel and go back
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Add TS types for window object properties we added
declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}
