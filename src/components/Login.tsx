import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Shield, ArrowRight, BriefcaseMedical, User } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  initialRole?: 'doctor' | 'patient';
  onCreateAccount?: (role: 'doctor' | 'patient') => void;
  onForgotPassword?: (role: 'doctor' | 'patient') => void;
  onSignIn?: (role: 'doctor' | 'patient') => void;
}

export function Login({ initialRole = 'doctor', onCreateAccount, onForgotPassword, onSignIn }: LoginProps) {
  const [role, setRole] = useState<'doctor' | 'patient'>(initialRole);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)] p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.05)] overflow-hidden"
      >
        {/* Role Toggle */}
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
              <User className="w-4 h-4 mr-2" />
              Patient
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-[28px] leading-[36px] font-bold text-on-surface mb-2">
              Welcome Back
            </h1>
            <p className="text-[16px] leading-[24px] text-on-surface-variant">
              Sign in to your {role === 'doctor' ? 'practitioner' : 'patient'} portal
            </p>
          </div>

          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onSignIn?.(role); }}>
            <div className="space-y-1">
              <label className="text-[14px] leading-[16px] font-medium text-on-surface">
                Email Address / Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  defaultValue="name@pulsehealth.com"
                  placeholder="name@pulsehealth.com"
                  className="w-full pl-10 pr-3 py-2.5 border border-outline-variant rounded-md bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[14px] leading-[16px] font-medium text-on-surface">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  defaultValue="122"
                  placeholder="••••••••"
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
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <span className="ml-2 text-[14px] text-on-surface-variant">
                  Remember me
                </span>
              </label>
              <button 
                type="button" 
                onClick={() => onForgotPassword?.(role)}
                className="text-[14px] font-medium text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-primary hover:bg-primary/90 text-on-primary py-2.5 rounded-md text-[16px] font-medium flex items-center justify-center transition-colors"
            >
              Sign In
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </form>

          <div className="mt-8 border-t border-outline-variant pt-6 text-center">
            <p className="text-[14px] text-on-surface-variant">
              New to Pulse Health?{' '}
              <button onClick={() => onCreateAccount?.(role)} className="font-bold text-primary hover:underline">
                Create an account
              </button>
            </p>
          </div>
        </div>
      </motion.div>
      
      <div className="mt-6 flex items-center text-on-surface-variant text-[12px] font-medium">
        <Shield className="w-3.5 h-3.5 mr-1.5" />
        Secure, encrypted 256-bit healthcare login
      </div>
    </div>
  );
}
