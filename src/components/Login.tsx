import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Shield, ArrowRight, BriefcaseMedical, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { apiFetch } from '../utils/api';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialRole = location.state?.role || 'doctor';
  
  const [role, setRole] = useState<'doctor' | 'patient'>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailPlaceholder, setEmailPlaceholder] = useState('name@pulsehealth.com');
  const [passwordPlaceholder, setPasswordPlaceholder] = useState('••••••••');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      if (!email || !password) {
        throw new Error('Please provide both email and password.');
      }
      
      const cleanInput = email.replace(/[\s-]/g, '');
      const isPhone = /^\+?[0-9]{10,15}$/.test(cleanInput);

      if (isPhone) {
        const dummyEmail = `${email.replace(/[^0-9]/g, '')}@phone.pulsehealth.local`;
        try {
          await signInWithEmailAndPassword(auth, dummyEmail, password);
          await auth.signOut();
        } catch (err: any) {
          throw new Error('Invalid phone number or password.');
        }

        // Route to OTP verification for phone numbers
        navigate('/verify-phone', { state: { role, phone: email } });
        return;
      }
      
      // 1. Sign in with Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
      
      // 2. Call our backend to sync the user and verify role
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ role })
      });
      
      // 3. Navigate based on backend response
      if (data.redirectTo) {
        navigate(data.redirectTo);
      } else if (role === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else {
        setError(err.message || 'An error occurred during login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

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
              onClick={() => { setRole('doctor'); setError(null); }}
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
              onClick={() => { setRole('patient'); setError(null); }}
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

          <form className="space-y-5" onSubmit={handleSignIn}>
            {error && (
              <div className="p-3 text-sm text-error bg-error-container/20 border border-error-container rounded-md">
                {error}
              </div>
            )}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailPlaceholder('')}
                  onBlur={() => setEmailPlaceholder('name@pulsehealth.com')}
                  placeholder={emailPlaceholder}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordPlaceholder('')}
                  onBlur={() => setPasswordPlaceholder('••••••••')}
                  placeholder={passwordPlaceholder}
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
                onClick={() => navigate('/forgot-password', { state: { role } })}
                className="text-[14px] font-medium text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-primary hover:bg-primary/90 text-on-primary py-2.5 rounded-md text-[16px] font-medium flex items-center justify-center transition-colors disabled:opacity-70"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </button>
          </form>

          <div className="mt-8 border-t border-outline-variant pt-6 text-center">
            <p className="text-[14px] text-on-surface-variant">
              New to Pulse Health?{' '}
              <button onClick={() => navigate('/signup', { state: { role } })} className="font-bold text-primary hover:underline">
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
