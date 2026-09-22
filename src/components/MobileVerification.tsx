import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Lock, RefreshCcw, ArrowLeft, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { apiFetch } from '../utils/api';

export function MobileVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const context = searchParams.get('context');
  const phone = location.state?.contact || location.state?.phone || '+1 (555) 000-0000';
  const role = location.state?.role || 'patient';

  const bypass = location.state?.bypass || false;

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Automatically submit test OTP if bypassed, or send initial OTP
  useEffect(() => {
    if (bypass) {
      const testOtp = import.meta.env.VITE_TEST_OTP || '';
      if (testOtp.length === 6) {
        setCode(testOtp.split(''));
        // Slight delay for UI transition effect
        setTimeout(() => {
          handleVerification(testOtp);
        }, 1000);
      }
    } else if (!window.confirmationResult && phone && phone !== '+1 (555) 000-0000') {
      // Automatically send OTP on mount if missing
      const sendInitialOtp = async () => {
        try {
          if (window.recaptchaVerifier) {
            try { window.recaptchaVerifier.clear(); } catch(e) {}
            window.recaptchaVerifier = undefined;
          }
          window.recaptchaVerifier = new RecaptchaVerifier(auth, 'resend-recaptcha', {
            'size': 'invisible'
          });
          const appVerifier = window.recaptchaVerifier;
          const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
          window.confirmationResult = confirmationResult;
          console.log('Sent initial OTP to', phone);
        } catch (e: any) {
          console.error('Failed to send initial OTP', e);
          setError(true);
        }
      };
      sendInitialOtp();
    }
  }, [bypass, phone]);

  const handleCodeChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;
    if (value.length > 1) value = value.slice(-1);

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (error) setError(false);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerification = async (fullCode: string) => {
    setError(false);
    setIsLoading(true);

    try {
      if (bypass) {
        // Since we skipped Recaptcha, we can just pretend it's verified for the UI flow 
        // In reality, to authenticate with Firebase using a test number, we still need 
        // a RecaptchaVerifier but since it's a test number, Firebase handles it smoothly 
        // when called. For this bypass, we will just call our backend endpoint directly or 
        // set up a dummy signInWithPhoneNumber here. 
        // Let's actually execute the real test flow:
        if (!window.recaptchaVerifier) {
          window.recaptchaVerifier = new RecaptchaVerifier(auth, 'resend-recaptcha', {
            'size': 'invisible'
          });
        }
        const appVerifier = window.recaptchaVerifier;
        const result = await signInWithPhoneNumber(auth, phone, appVerifier);
        await result.confirm(fullCode);
      } else {
        if (!window.confirmationResult) {
          throw new Error("No confirmation result available. Please try resending the code.");
        }
        await window.confirmationResult.confirm(fullCode);
      }

      if (context === 'signup' && auth.currentUser) {
        try {
          await apiFetch('/auth/assign-role', {
            method: 'POST',
            body: JSON.stringify({ userId: auth.currentUser.uid, role })
          });
        } catch (err) {
          console.error("Failed to assign role", err);
        }
      }

      if (context === 'signup') {
        if (role === 'doctor') {
          navigate('/doctor/setup', { state: { role } });
        } else {
          navigate('/patient/setup', { state: { role } });
        }
      } else if (context === 'reset') {
        navigate('/reset-password', { state: { role } });
      } else {
        try {
          const data = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ role })
          });
          
          if (data.redirectTo) {
            navigate(data.redirectTo);
          } else if (role === 'doctor') {
            navigate('/doctor/dashboard');
          } else {
            navigate('/patient/dashboard');
          }
        } catch (err) {
          console.error('Login sync failed', err);
          if (role === 'doctor') {
            navigate('/doctor/dashboard');
          } else {
            navigate('/patient/dashboard');
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(true);
      alert("Verification failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    const fullCode = code.join('');
    if (fullCode.length === 6) {
      handleVerification(fullCode);
    } else {
      setError(true);
    }
  };

  const handleResend = async () => {
    try {
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch(e) {}
        window.recaptchaVerifier = undefined;
      }
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'resend-recaptcha', {
        'size': 'invisible'
      });
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
      window.confirmationResult = confirmationResult;
      console.log('Resent OTP to', phone);
      alert("A new verification code has been sent.");
    } catch (e: any) {
      console.error(e);
      alert("Failed to resend code: " + e.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center w-full max-w-[480px]"
      >
        <div className="w-16 h-16 rounded-full bg-[#e3ebf6] flex items-center justify-center mb-6">
          <ShieldCheck className="w-8 h-8 text-primary" fill="currentColor" stroke="white" strokeWidth={1} />
        </div>

        <h1 className="text-[32px] leading-[40px] font-bold text-on-surface mb-3 tracking-tight text-center">
          Mobile Verification
        </h1>
        <p className="text-[16px] leading-[24px] text-on-surface-variant text-center mb-8">
          A verification code has been sent to your messenger.
        </p>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 w-full shadow-[0_10px_25px_rgba(0,0,0,0.05)]">
          <label className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">
            SENDING CODE TO
          </label>
          <div className="relative mb-6">
            <input
              type="text"
              readOnly
              value={phone}
              className="w-full pl-4 pr-10 py-3 border border-outline-variant rounded-md bg-surface-container-low text-on-surface focus:outline-none font-medium"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-outline">
              <Lock className="w-5 h-5" />
            </div>
          </div>

          <label className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">
            VERIFICATION CODE
          </label>
          <div className="flex justify-between gap-2 mb-2">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={e => handleCodeChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className={`w-12 h-14 border rounded-md bg-surface-container-lowest focus:outline-none focus:ring-2 transition-colors text-center text-[20px] font-medium text-on-surface ${error ? 'border-error focus:border-error focus:ring-error/20' : 'border-outline-variant focus:border-primary focus:ring-primary-fixed'
                  }`}
              />
            ))}
          </div>
          {error && (
            <p className="text-[12px] font-medium text-error mb-4">Invalid code. Please try again.</p>
          )}
          <div className={`${error ? '' : 'mb-8'}`} />

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-[#005bb5] hover:bg-primary/90 text-on-primary py-3 rounded-md text-[16px] font-bold flex items-center justify-center transition-colors mb-4 shadow-sm disabled:opacity-70"
          >
            {isLoading ? 'Verifying...' : 'Submit Code'}
          </button>

          <button
            onClick={handleResend}
            className="w-full flex items-center justify-center text-[14px] font-bold text-[#005bb5] hover:underline mb-4"
          >
            <RefreshCcw className="w-4 h-4 mr-2" /> Resend Code
          </button>

          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center text-[14px] font-medium text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
          </button>
        </div>

        <div className="mt-8 flex items-center text-on-surface-variant text-[12px] font-medium text-center px-4 max-w-sm">
          <Shield className="w-4 h-4 mr-1.5 flex-shrink-0" />
          Secured by Pulse Encryption. We will never ask for your password.
        </div>
        <div id="resend-recaptcha"></div>
      </motion.div>
    </div>
  );
}
