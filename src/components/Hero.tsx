import { User, BriefcaseMedical, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface HeroProps {
  onGetStarted: (role: 'patient' | 'doctor') => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-xl md:py-24 flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold md:text-[56px] md:leading-[64px] text-on-surface max-w-3xl mx-auto mb-gutter">
          Welcome to Pulse Health
        </h1>
        <p className="text-[18px] leading-[28px] text-on-surface-variant max-w-2xl mx-auto mb-lg">
          Clarity through Calm. Manage your healthcare journey with confidence, backed by a clinical interface designed for precision and care.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-gutter mt-lg"
      >
        <button 
          onClick={() => onGetStarted('patient')}
          className="group relative flex flex-col items-start p-lg bg-surface-container-lowest border border-outline-variant rounded-xl text-left hover:shadow-lg hover:border-primary transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center mb-md group-hover:scale-110 transition-transform duration-300">
            <User className="text-primary w-7 h-7" />
          </div>
          <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface mb-xs">Login as Patient</h3>
          <p className="text-[16px] leading-[24px] text-on-surface-variant">
            Access your health records, schedule appointments, and connect with your care team.
          </p>
          <div className="mt-md flex items-center text-primary text-[14px] leading-[16px] tracking-[0.01em] font-medium">
            <span>Get Started</span>
            <ArrowRight className="ml-xs w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button 
          onClick={() => onGetStarted('doctor')}
          className="group relative flex flex-col items-start p-lg bg-surface-container-lowest border border-outline-variant rounded-xl text-left hover:shadow-lg hover:border-primary transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center mb-md group-hover:scale-110 transition-transform duration-300">
            <BriefcaseMedical className="text-on-secondary-fixed-variant w-7 h-7" />
          </div>
          <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface mb-xs">Login as Doctor</h3>
          <p className="text-[16px] leading-[24px] text-on-surface-variant">
            Streamline your practice workflow, manage patients, and coordinate care effortlessly.
          </p>
          <div className="mt-md flex items-center text-primary text-[14px] leading-[16px] tracking-[0.01em] font-medium">
            <span>Get started</span>
            <ArrowRight className="ml-xs w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </motion.div>
    </section>
  );
}
