import { useEffect } from 'react';
import { AtSign, Send, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';

export function EmailVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const context = searchParams.get('context');
  const email = location.state?.contact || 'user@example.com';
  const role = location.state?.role || 'patient';

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (context === 'signup') {
        try {
          // Placeholder for assigning the role after verification
          // await fetch('/api/v1/auth/assign-role', { method: 'POST', body: JSON.stringify({ role }) });
        } catch (e) {
          console.error(e);
        }
        
        if (role === 'doctor') {
          navigate('/doctor/setup', { state: { role } });
        } else {
          navigate('/patient/setup', { state: { role } });
        }
      } else if (context === 'reset') {
        navigate('/reset-password', { state: { role } });
      } else {
        // Fallback
        navigate('/login');
      }
    }, 4000); // reduced from 10s to 4s for better UX testing
    return () => clearTimeout(timer);
  }, [navigate, context, role]);

  const handleResend = async () => {
    try {
      // Placeholder endpoint
      // await fetch('/api/v1/auth/resend-email', { method: 'POST', body: JSON.stringify({ email }) });
      console.log('Resent email to', email);
    } catch (e) {
      console.error(e);
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
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </div>
        
        <h1 className="text-[32px] leading-[40px] font-bold text-on-surface mb-3 tracking-tight text-center">
          Email Verification
        </h1>
        <p className="text-[16px] leading-[24px] text-on-surface-variant text-center mb-6">
          A verification link has been sent to your email.
        </p>
        
        <Loader2 className="w-8 h-8 text-[#005bb5] animate-spin mb-8" />
        
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 w-full shadow-[0_10px_25px_rgba(0,0,0,0.05)]">
          <label className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">
            REGISTERED EMAIL
          </label>
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
              <AtSign className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              readOnly 
              value={email} 
              className="w-full pl-10 pr-3 py-3 border border-outline-variant rounded-md bg-surface-container-low text-on-surface focus:outline-none font-medium" 
            />
          </div>
          
          <button 
            onClick={handleResend}
            className="w-full bg-[#005bb5] hover:bg-primary/90 text-on-primary py-3 rounded-md text-[16px] font-bold flex items-center justify-center transition-colors shadow-sm mb-4"
          >
            Resend Verification Link <Send className="w-4 h-4 ml-2" />
          </button>
          
          <p className="text-[14px] text-on-surface-variant text-center mb-6">
            Didn't receive the email? Check your spam folder.
          </p>
          
          <div className="relative flex items-center mb-6">
            <div className="flex-grow border-t border-outline-variant"></div>
            <span className="flex-shrink-0 mx-4 text-on-surface-variant text-[12px] font-bold uppercase tracking-wider">OR</span>
            <div className="flex-grow border-t border-outline-variant"></div>
          </div>
          
          <button 
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center text-[14px] font-bold text-[#005bb5] hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
          </button>
        </div>
        
        <p className="text-[14px] text-on-surface-variant text-center mt-6">
          Need help? <a href="#" className="text-[#005bb5] font-bold hover:underline">Contact support</a>
        </p>
      </motion.div>
    </div>
  );
}
