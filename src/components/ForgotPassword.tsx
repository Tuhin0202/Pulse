import React, { useState } from 'react';
import { Mail, Phone, ArrowLeft, RefreshCcw, Lock, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';

interface ForgotPasswordProps {
  mode?: 'forgot-password' | 'register';
}

export function ForgotPassword({ mode = 'forgot-password' }: ForgotPasswordProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role || 'patient';
  
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [contact, setContact] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (method === 'email') {
        // Placeholder endpoint
        // await fetch('/api/v1/auth/reset-password-email', { method: 'POST', body: ... });
        navigate('/verify-email?context=reset', { state: { contact, role } });
      } else {
        // Placeholder endpoint
        // await fetch('/api/v1/auth/reset-password-phone', { method: 'POST', body: ... });
        navigate('/verify-phone?context=reset', { state: { contact, role } });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)] p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.05)] overflow-hidden p-8 md:px-10 md:py-12"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-primary-fixed mb-6">
            {mode === 'register' ? (
              <UserPlus className="w-7 h-7 text-primary" strokeWidth={2.5} />
            ) : (
              <>
                <RefreshCcw className="w-7 h-7 text-primary opacity-80" strokeWidth={2.5} />
                <Lock className="w-3.5 h-3.5 absolute text-primary bg-primary-fixed p-0.5 rounded-sm" strokeWidth={3} />
              </>
            )}
          </div>
          <h1 className="text-[32px] leading-[40px] font-bold text-on-surface mb-3 tracking-tight font-serif">
            {mode === 'register' ? 'Create Account' : 'Forgot Password?'}
          </h1>
          <p className="text-[14px] leading-[22px] text-on-surface-variant max-w-[340px]">
            {mode === 'register'
              ? 'Select a method to register and set up your health dashboard.'
              : "Don't worry, it happens. Select a method to reset your password and regain access to your health dashboard."}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex w-full bg-surface-container-low rounded-lg p-1 mb-8 border border-outline-variant/60">
          <button
            type="button"
            onClick={() => setMethod('email')}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-[12px] font-bold uppercase tracking-wider transition-colors ${
              method === 'email'
                ? 'bg-surface-container-lowest text-primary shadow-sm border border-outline-variant/30'
                : 'text-on-surface-variant hover:bg-surface-variant/50'
            }`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => setMethod('phone')}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-[12px] font-bold uppercase tracking-wider transition-colors ${
              method === 'phone'
                ? 'bg-surface-container-lowest text-primary shadow-sm border border-outline-variant/30'
                : 'text-on-surface-variant hover:bg-surface-variant/50'
            }`}
          >
            Phone
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleVerify}>
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">
              {method === 'phone' ? 'Phone Number' : 'Email Address'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                {method === 'phone' ? <Phone className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
              </div>
              <input
                type={method === 'phone' ? 'tel' : 'email'}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder={method === 'phone' ? '+1 (555) 000-0000' : 'name@pulsehealth.com'}
                className="w-full pl-11 pr-4 py-3 border border-outline-variant rounded-md bg-surface-container-low/30 focus:bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed transition-colors text-[16px] text-on-surface"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#005bb5] hover:bg-primary/90 text-on-primary py-3 rounded-md text-[16px] font-bold transition-colors mt-2 shadow-sm disabled:opacity-70"
          >
            {isLoading ? 'Verifying...' : (mode === 'register' ? 'Verify & Register' : 'Verify & Reset')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center justify-center text-[15px] font-bold text-[#005bb5] hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2.5} />
            Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
}
