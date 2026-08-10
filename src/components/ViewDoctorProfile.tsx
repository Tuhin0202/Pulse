import React from 'react';
import { Star, MapPin, Phone, Clock, User, Award, Globe, Navigation, Calendar as CalendarIcon, CheckCircle2, ChevronRight, ArrowLeft, ShieldCheck } from 'lucide-react';

interface Doctor {
  id: number;
  name: string;
  category: string;
  city: string;
  rating: number;
  image: string;
  experience: string;
  clinicName?: string;
  address?: string;
  contactInfo?: string;
}

interface ViewDoctorProfileProps {
  doctor: Doctor;
  onBack: () => void;
}

export function ViewDoctorProfile({ doctor, onBack }: ViewDoctorProfileProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto w-full">
      {/* Left Sidebar - Quick Links */}
      <div className="w-full md:w-64 shrink-0">
        <div className="bg-[#f8fafc] rounded-xl p-4 shadow-sm border border-outline-variant sticky top-24">
          <h3 className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-4 px-3">Quick Links</h3>
          <nav className="space-y-1">
            <button className="w-full flex items-center px-3 py-2.5 bg-[#e2e8f0] text-[#005bb5] font-medium rounded-lg text-[14px]">
              <User className="w-4 h-4 mr-3" />
              Details
            </button>
            <button className="w-full flex items-center px-3 py-2.5 text-on-surface-variant hover:bg-white hover:text-on-surface font-medium rounded-lg text-[14px] transition-colors">
              <Star className="w-4 h-4 mr-3" />
              Reviews
            </button>
            <button className="w-full flex items-center px-3 py-2.5 text-on-surface-variant hover:bg-white hover:text-on-surface font-medium rounded-lg text-[14px] transition-colors">
              <Phone className="w-4 h-4 mr-3" />
              Contact
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden">
          {/* Top Banner */}
          <div className="h-32 bg-[#005bb5] relative"></div>
          
          {/* Profile Header section */}
          <div className="px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="-mt-16 relative z-10 shrink-0">
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  className="w-32 h-32 rounded-xl object-cover border-4 border-white shadow-md bg-white"
                />
              </div>
              <div className="pt-2 md:pt-4">
                <h1 className="text-[28px] font-bold text-on-surface flex items-center gap-3">
                  {doctor.name}
                  <span className="px-2.5 py-0.5 bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] rounded-full text-[12px] font-bold flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    Verified License
                  </span>
                </h1>
                <p className="text-[16px] text-on-surface-variant">{doctor.category} Specialist</p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-[#f8fafc] rounded-lg p-4 text-center border border-outline-variant">
                <Award className="w-5 h-5 text-[#005bb5] mx-auto mb-2" />
                <div className="text-[11px] font-bold text-on-surface-variant uppercase mb-1">Education</div>
                <div className="text-[14px] font-bold text-on-surface">MBBS, MD</div>
              </div>
              <div className="bg-[#f8fafc] rounded-lg p-4 text-center border border-outline-variant">
                <Clock className="w-5 h-5 text-[#005bb5] mx-auto mb-2" />
                <div className="text-[11px] font-bold text-on-surface-variant uppercase mb-1">Experience</div>
                <div className="text-[14px] font-bold text-on-surface">{doctor.experience}</div>
              </div>
              <div className="bg-[#f8fafc] rounded-lg p-4 text-center border border-outline-variant">
                <Globe className="w-5 h-5 text-[#005bb5] mx-auto mb-2" />
                <div className="text-[11px] font-bold text-on-surface-variant uppercase mb-1">Languages</div>
                <div className="text-[14px] font-bold text-on-surface">English, Spanish</div>
              </div>
              <div className="bg-[#f8fafc] rounded-lg p-4 text-center border border-outline-variant">
                <Star className="w-5 h-5 text-[#005bb5] mx-auto mb-2" />
                <div className="text-[11px] font-bold text-on-surface-variant uppercase mb-1">Ratings</div>
                <div className="text-[14px] font-bold text-on-surface">{doctor.rating} (120)</div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 mt-10">
              <div className="flex-1 space-y-10">
                {/* About */}
                <section>
                  <h2 className="text-[20px] font-bold text-on-surface mb-4">About</h2>
                  <p className="text-[15px] text-on-surface-variant leading-relaxed">
                    {doctor.name} is a highly acclaimed specialist specializing in {doctor.category.toLowerCase()}. With over {doctor.experience} of practice at leading medical institutions, they provide comprehensive care, focusing on preventive health and state-of-the-art diagnostic procedures.
                  </p>
                </section>

                {/* Clinic Information */}
                <section>
                  <h2 className="text-[20px] font-bold text-on-surface mb-4">Clinic Information</h2>
                  <div className="border border-outline-variant rounded-xl p-5 flex flex-col sm:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start">
                         <MapPin className="w-5 h-5 text-[#005bb5] mr-3 mt-0.5 shrink-0" />
                         <div>
                           <div className="font-bold text-[15px] text-[#005bb5]">{doctor.clinicName || 'Pulse Wellness Center'}</div>
                           <div className="text-[14px] text-on-surface-variant mt-1">
                             {doctor.address || doctor.city}
                           </div>
                         </div>
                      </div>
                      <div className="flex items-center text-[14px] font-medium text-[#005bb5]">
                        <Phone className="w-4 h-4 mr-3 shrink-0" />
                        {doctor.contactInfo || ''}
                      </div>
                    </div>
                    <div className="w-full sm:w-40 h-32 bg-[#f1f5f9] rounded-lg flex items-center justify-center text-on-surface-variant text-[12px] border border-outline-variant">
                      <Navigation className="w-4 h-4 mr-2" />
                      Interactive Map
                    </div>
                  </div>
                </section>
              </div>

              {/* Right internal sidebar elements */}
              <div className="w-full lg:w-72 space-y-6">
                <div className="bg-[#f8fafc] rounded-xl p-6 border border-outline-variant">
                  <div className="flex items-center mb-4">
                    <Clock className="w-5 h-5 text-[#005bb5] mr-2" />
                    <h3 className="text-[16px] font-bold text-on-surface">Working Hours</h3>
                  </div>
                  <div className="space-y-3 text-[14px]">
                    <div className="flex justify-between items-center text-on-surface-variant pb-3 border-b border-outline-variant">
                      <span>Mon - Sat</span>
                      <span className="font-medium text-on-surface">09:00 AM - 05:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center text-error">
                      <span>Sunday</span>
                      <span className="font-medium">Closed</span>
                    </div>
                  </div>
                  <div className="mt-4 bg-[#e2e8f0]/50 rounded-lg p-3 flex items-start text-[12px] text-[#0f172a]">
                    <CheckCircle2 className="w-4 h-4 text-[#059669] mr-2 shrink-0 mt-0.5" />
                    Appointments are typically confirmed within 2 hours during business hours.
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-outline-variant">
                  <h3 className="text-[16px] font-bold text-on-surface mb-4">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {['General Checkup', doctor.category, 'Consultation'].map((spec, i) => (
                      <span key={i} className="px-3 py-1.5 bg-[#eff6ff] text-[#005bb5] rounded-full text-[12px] font-medium border border-[#bfdbfe]">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Reviews & Rating boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 pt-8 border-t border-outline-variant">
              <div className="bg-white border border-outline-variant rounded-xl p-6">
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-orange-400 fill-orange-400" />
                  ))}
                </div>
                <p className="text-[14px] text-on-surface-variant italic mb-4">
                  "Dr. {doctor.name.split(' ').pop()} was incredibly thorough and patient. They explained everything clearly and made me feel at ease throughout the consultation."
                </p>
                <div className="text-[12px] text-on-surface-variant">— Patient, Jan 2024</div>
              </div>
              <div className="bg-[#f8fafc] border border-outline-variant rounded-xl p-6 flex flex-col items-center justify-center text-center">
                <div className="text-[32px] font-bold text-on-surface mb-1">{doctor.rating} / 5.0</div>
                <div className="text-[12px] text-on-surface-variant mb-4">Based on 120 verified reviews</div>
                <button className="text-[#005bb5] text-[14px] font-bold hover:underline">View All Reviews</button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-between mt-8 pt-4 pb-8">
          <button 
            onClick={onBack}
            className="px-6 py-2.5 bg-white border border-[#005bb5] text-[#005bb5] rounded-full text-[14px] font-bold hover:bg-[#eff6ff] transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
