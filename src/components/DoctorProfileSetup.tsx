import { BriefcaseMedical, Building2, ChevronDown, FileCheck, UploadCloud, ShieldCheck, FileText, X } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DoctorData } from '../types';
import { apiFetch } from '../utils/api';

export function DoctorProfileSetup() {
  const navigate = useNavigate();
  const licenseFileInputRef = useRef<HTMLInputElement>(null);
  const photoFileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<DoctorData>>({
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
    licenseFileUrl: '',
    licenseStatus: 'Not Uploaded',
    aboutText: '',
    profilePicUrl: ''
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await apiFetch('/doctor/profile');
        setFormData(prev => ({ ...prev, ...data }));
      } catch (err: any) {
        // Ignore, means new profile or not found
      }
    }
    fetchProfile();
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too large. Max 2MB.");
        e.target.value = '';
        return;
      }
      setIsLoading(true);
      try {
        const fileData = new FormData();
        fileData.append('file', file);
        const res = await apiFetch('/doctor/profile/upload-photo', {
          method: 'POST',
          body: fileData
        });
        setFormData(prev => ({ ...prev, profilePicUrl: res.profilePicUrl }));
      } catch (err: any) {
        setError(err.message || "Failed to upload photo");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeletePhoto = async () => {
    setIsLoading(true);
    try {
      await apiFetch('/doctor/profile/photo', { method: 'DELETE' });
      setFormData(prev => ({ ...prev, profilePicUrl: '' }));
    } catch (err: any) {
      setError(err.message || "Failed to delete photo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLicenseUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 200 * 1024) {
        alert("File is too large. Max 200KB.");
        e.target.value = '';
        return;
      }
      setIsLoading(true);
      try {
        const fileData = new FormData();
        fileData.append('file', file);
        const res = await apiFetch('/doctor/profile/upload-license', {
          method: 'POST',
          body: fileData
        });
        setFormData(prev => ({ 
          ...prev, 
          licenseFileUrl: res.licenseFileUrl,
          licenseFileName: res.licenseFileName,
          licenseStatus: res.licenseStatus
        }));
      } catch (err: any) {
        setError(err.message || "Failed to upload license");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteLicense = async () => {
    setIsLoading(true);
    try {
      await apiFetch('/doctor/profile/license', { method: 'DELETE' });
      setFormData(prev => ({ ...prev, licenseFileUrl: '', licenseFileName: '', licenseStatus: 'Not Uploaded' }));
    } catch (err: any) {
      setError(err.message || "Failed to delete license");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof DoctorData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setError(null);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Save profile
      try {
        await apiFetch('/doctor/profile', {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } catch (e: any) {
        if (e.message.includes('not found') || e.message === 'NOT_FOUND') {
          await apiFetch('/doctor/profile', {
            method: 'POST',
            body: JSON.stringify(formData)
          });
        } else {
          throw e;
        }
      }
      
      navigate('/doctor/profile');
    } catch (err: any) {
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)] p-4 bg-background">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[600px] bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.05)] overflow-hidden"
      >
        <div className="p-8 border-b border-outline-variant">
          <h1 className="text-[28px] leading-[36px] font-bold text-on-surface mb-2 font-serif">
            Welcome, Doctor
          </h1>
          <p className="text-[14px] leading-[20px] text-on-surface-variant mb-6">
            Let's set up your professional profile to begin providing care.
          </p>

          {error && (
            <div className="mb-4 p-3 text-sm text-error bg-error-container/20 border border-error-container rounded-md">
              {error}
            </div>
          )}

          <div className="flex items-center space-x-2 text-[12px] font-medium">
            <div className="flex items-center text-primary">
              <div className="w-2 h-2 rounded-full bg-primary mr-1.5" />
              Personal
            </div>
            <div className="w-8 h-[1px] bg-outline-variant/50" />
            <div className="flex items-center text-on-surface-variant">
              <div className="w-2 h-2 rounded-full bg-outline-variant mr-1.5" />
              Clinic
            </div>
            <div className="w-8 h-[1px] bg-outline-variant/50" />
            <div className="flex items-center text-on-surface-variant">
              <div className="w-2 h-2 rounded-full bg-outline-variant mr-1.5" />
              Verification
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <section>
            <div className="flex items-center text-[16px] font-bold text-on-surface mb-4">
              <BriefcaseMedical className="w-5 h-5 mr-2 text-primary" />
              Professional Identity
            </div>
            
            <div className="mb-6 flex flex-col md:flex-row gap-6 items-start">
              <div className="shrink-0 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-surface-container border-2 border-dashed border-outline-variant flex items-center justify-center overflow-hidden mb-3 relative group">
                  {formData.profilePicUrl ? (
                    <img src={formData.profilePicUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UploadCloud className="w-8 h-8 text-outline" />
                  )}
                  <div 
                    onClick={() => photoFileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-white text-[12px] font-bold"
                  >
                    Change
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={photoFileInputRef} 
                  onChange={handlePhotoUpload} 
                  accept=".jpg,.jpeg,.png" 
                  className="hidden" 
                />
                {formData.profilePicUrl && (
                  <button 
                    onClick={handleDeletePhoto}
                    className="text-error text-[12px] font-bold hover:underline"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
              <div className="flex-1 space-y-1.5 w-full">
                <label className="text-[13px] font-medium text-on-surface-variant">About (Short Bio)</label>
                <textarea 
                  rows={4}
                  value={formData.aboutText || ''} 
                  onChange={(e) => setFormData(prev => ({ ...prev, aboutText: e.target.value }))} 
                  className="w-full px-3 py-2 border border-outline-variant rounded-md text-[14px] focus:outline-none focus:border-primary resize-none"
                  placeholder="Briefly describe your experience and approach to patient care..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-on-surface-variant">Full Name</label>
                <input type="text" value={formData.fullName || ''} onChange={handleChange('fullName')} className="w-full px-3 py-2 border border-outline-variant rounded-md text-[14px] focus:outline-none focus:border-primary" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-on-surface-variant">Education Qualification</label>
                <input type="text" value={formData.qualification || ''} onChange={handleChange('qualification')} className="w-full px-3 py-2 border border-outline-variant rounded-md text-[14px] focus:outline-none focus:border-primary" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-on-surface-variant">Specialization</label>
                <div className="relative">
                  <select value={formData.specialization || ''} onChange={handleChange('specialization')} className="w-full px-3 py-2 border border-outline-variant rounded-md text-[14px] focus:outline-none focus:border-primary appearance-none bg-transparent">
                    <option value="" disabled>Select Specialization</option>
                    <option>Cardiology</option>
                    <option>Dermatology</option>
                    <option>Endocrinology</option>
                    <option>Gastroenterology</option>
                    <option>General Practice</option>
                    <option>General Surgery</option>
                    <option>Internal Medicine</option>
                    <option>Neurology</option>
                    <option>Obstetrics and Gynecology</option>
                    <option>Oncology</option>
                    <option>Ophthalmology</option>
                    <option>Orthopedics</option>
                    <option>Pediatrics</option>
                    <option>Psychiatry</option>
                    <option>Pulmonology</option>
                    <option>Radiology</option>
                    <option>Urology</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-outline" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-on-surface-variant">Years of Experience</label>
                <input type="text" placeholder="" value={formData.experience || ''} onChange={handleChange('experience')} className="w-full px-3 py-2 border border-outline-variant rounded-md text-[14px] focus:outline-none focus:border-primary" />
              </div>
            </div>
          </section>

          <div className="h-[1px] bg-outline-variant/30" />

          <section>
            <div className="flex items-center text-[16px] font-bold text-on-surface mb-4">
              <Building2 className="w-5 h-5 mr-2 text-primary" />
              Clinic Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[13px] font-medium text-on-surface-variant">Clinic/Hospital Name</label>
                <input type="text" value={formData.clinicName || ''} onChange={handleChange('clinicName')} className="w-full px-3 py-2 border border-outline-variant rounded-md text-[14px] focus:outline-none focus:border-primary" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-on-surface-variant">City</label>
                <div className="relative">
                  <select value={formData.city || ''} onChange={handleChange('city')} className="w-full px-3 py-2 border border-outline-variant rounded-md text-[14px] focus:outline-none focus:border-primary appearance-none bg-transparent">
                    <option value="" disabled>Select City</option>
                    <option>Ahmedabad</option>
                    <option>Bengaluru</option>
                    <option>Bhopal</option>
                    <option>Chennai</option>
                    <option>Delhi</option>
                    <option>Hyderabad</option>
                    <option>Indore</option>
                    <option>Jaipur</option>
                    <option>Kanpur</option>
                    <option>Kochi</option>
                    <option>Kolkata</option>
                    <option>Lucknow</option>
                    <option>Ludhiana</option>
                    <option>Mumbai</option>
                    <option>Nagpur</option>
                    <option>Nashik</option>
                    <option>Patna</option>
                    <option>Pune</option>
                    <option>Surat</option>
                    <option>Vadodara</option>
                    <option>Visakhapatnam</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-outline" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-on-surface-variant">Contact Info</label>
                <input type="text" value={formData.contactInfo || ''} onChange={handleChange('contactInfo')} className="w-full px-3 py-2 border border-outline-variant rounded-md text-[14px] focus:outline-none focus:border-primary" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[13px] font-medium text-on-surface-variant">Address</label>
                <input type="text" value={formData.address || ''} onChange={handleChange('address')} className="w-full px-3 py-2 border border-outline-variant rounded-md text-[14px] focus:outline-none focus:border-primary" />
              </div>
            </div>
          </section>

          <div className="h-[1px] bg-outline-variant/30" />

          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-[16px] font-bold text-on-surface">
                <FileCheck className="w-5 h-5 mr-2 text-primary" />
                Medical License & Verification
              </div>
              <span className="flex items-center text-[12px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                {formData.licenseStatus || 'Pending Verification'}
              </span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-on-surface-variant">Medical Registration / License Number</label>
                <input 
                  type="text" 
                  placeholder="" 
                  value={formData.licenseNumber || ''} 
                  onChange={handleChange('licenseNumber')} 
                  className="w-full px-3 py-2 border border-outline-variant rounded-md text-[14px] focus:outline-none focus:border-primary font-mono" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-on-surface-variant">Upload Medical License Document (Max 200KB)</label>
                <input 
                  type="file" 
                  ref={licenseFileInputRef} 
                  onChange={handleLicenseUpload} 
                  accept=".pdf,.jpg,.jpeg,.png" 
                  className="hidden" 
                />

                {formData.licenseFileName ? (
                  <div className="flex items-center justify-between p-4 bg-[#eff6ff] border border-[#bfdbfe] rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-[#005bb5] text-white flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-on-surface">{formData.licenseFileName}</div>
                        <div className="text-[12px] text-[#005bb5] font-medium">Uploaded Medical Certificate</div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        type="button"
                        onClick={() => licenseFileInputRef.current?.click()} 
                        className="px-3 py-1.5 bg-white border border-[#005bb5] text-[#005bb5] text-[13px] font-bold rounded-lg hover:bg-[#eff6ff] transition-colors"
                      >
                        Replace
                      </button>
                      <button 
                        type="button"
                        onClick={handleDeleteLicense} 
                        className="px-3 py-1.5 bg-white border border-error text-error text-[13px] font-bold rounded-lg hover:bg-error-container/20 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => licenseFileInputRef.current?.click()}
                    className="border-2 border-dashed border-outline-variant rounded-xl p-6 bg-surface-container-lowest flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-[#f8fafc] transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#eff6ff] text-[#005bb5] flex items-center justify-center mb-3">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div className="text-[14px] font-bold text-on-surface mb-1">
                      Click to upload medical license
                    </div>
                    <div className="text-[12px] text-on-surface-variant">
                      Supports PDF, JPG, PNG (Max 200KB)
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="p-4 border-t border-outline-variant flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[13px] italic text-on-surface-variant max-w-[280px]">
            All information is securely stored according to medical privacy laws.
          </p>
          <button 
            onClick={handleSave}
            disabled={isLoading}
            className="w-full md:w-auto px-8 py-2.5 bg-[#005bb5] hover:bg-primary/90 text-white rounded-md text-[14px] font-bold uppercase tracking-wide transition-colors disabled:opacity-70"
          >
            {isLoading ? 'SAVING...' : 'SAVE PROFILE'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
