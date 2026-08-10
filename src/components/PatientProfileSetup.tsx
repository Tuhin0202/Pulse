import { User, Calendar, MapPin, Droplet, Save, ShieldCheck, Activity, Heart, Ruler, Scale } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientData } from '../types';

interface PatientProfileSetupProps {
  onComplete: (data: Partial<PatientData>) => void;
  initialData?: PatientData;
}

export function PatientProfileSetup({ onComplete, initialData }: PatientProfileSetupProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<PatientData>>({
    fullName: initialData?.fullName || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    bloodGroup: initialData?.bloodGroup || '',
    address: initialData?.address || '',
    bloodPressure: initialData?.bloodPressure || '',
    heartRate: initialData?.heartRate || '',
    height: initialData?.height || '',
    weight: initialData?.weight || '',
  });

  const handleChange = (field: keyof PatientData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)] p-4 bg-background">
      <div className="w-full max-w-[500px] mb-6">
        <div className="flex justify-between items-center text-[10px] font-bold text-primary uppercase tracking-wider mb-2">
          <span>STEP 1 OF 1</span>
          <span className="text-on-surface-variant">Profile Setup</span>
        </div>
        <div className="w-full h-1 bg-outline-variant/30 rounded-full overflow-hidden">
          <div className="w-full h-full bg-primary" />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[500px] bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.05)] overflow-hidden p-8"
      >
        <h1 className="text-[28px] leading-[36px] font-bold text-on-surface mb-2 font-serif">
          Welcome to Pulse Health
        </h1>
        <p className="text-[14px] leading-[20px] text-on-surface-variant mb-8">
          Please complete your patient profile to help us provide you with personalized healthcare experiences.
        </p>

        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-on-surface">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                <User className="w-4 h-4" />
              </div>
              <input type="text" value={formData.fullName} onChange={handleChange('fullName')} className="w-full pl-9 pr-3 py-2 border border-outline-variant rounded-md text-[14px] focus:outline-none focus:border-primary" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-on-surface">Date of Birth</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <Calendar className="w-4 h-4" />
                </div>
                <input type="text" placeholder="YYYY-MM-DD" value={formData.dateOfBirth} onChange={handleChange('dateOfBirth')} className="w-full pl-9 pr-3 py-2 border border-outline-variant rounded-md text-[14px] focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-on-surface">Calculated Age</label>
              <input type="text" readOnly placeholder="" className="w-full px-3 py-2 border border-outline-variant rounded-md text-[14px] bg-surface-container-low text-primary font-medium focus:outline-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-on-surface">Blood Group</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                <Droplet className="w-4 h-4" />
              </div>
              <select value={formData.bloodGroup} onChange={handleChange('bloodGroup')} className="w-full pl-9 pr-8 py-2 border border-outline-variant rounded-md text-[14px] focus:outline-none focus:border-primary appearance-none bg-transparent">
                <option value="">Select blood group</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>O+</option>
                <option>O-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-outline">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-outline-variant">
            <div className="p-3 bg-[#eff6ff] border border-[#bfdbfe] rounded-lg flex items-center text-[12px] text-[#1e40af] font-medium">
              <ShieldCheck className="w-4 h-4 mr-2 shrink-0 text-[#005bb5]" />
              Health vitals (Blood Pressure, Heart Rate, Height, Weight) are updated by attending doctors during clinical consultations.
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-on-surface">Residential Address</label>
            <div className="relative">
              <div className="absolute top-2.5 left-3 pointer-events-none text-outline">
                <MapPin className="w-4 h-4" />
              </div>
              <textarea rows={3} value={formData.address} onChange={handleChange('address')} className="w-full pl-9 pr-3 py-2 border border-outline-variant rounded-md text-[14px] focus:outline-none focus:border-primary resize-none" />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button 
              type="button"
              onClick={() => navigate('/patient/dashboard')}
              className="w-1/2 border border-outline-variant text-on-surface hover:bg-surface-container-lowest py-2.5 rounded-md text-[14px] font-bold transition-colors"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={() => onComplete(formData)}
              className="w-1/2 bg-[#005bb5] hover:bg-primary/90 text-white py-2.5 rounded-md text-[14px] font-bold flex items-center justify-center transition-colors shadow-sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </button>
          </div>
        </div>
      </motion.div>
      
      <div className="mt-6 flex items-center text-on-surface-variant text-[12px] font-medium">
        <ShieldCheck className="w-4 h-4 mr-1.5" />
        Your data is encrypted and stored securely.
      </div>
    </div>
  );
}
