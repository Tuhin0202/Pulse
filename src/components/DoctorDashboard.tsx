import React, { useState, useRef } from 'react';
import { Bell, Edit2, MapPin, Search, User, ClipboardList, Users, CheckCircle, Activity, Video, Calendar, FileText, PlusSquare, FileUp, ChevronDown, RotateCcw, Check, X, Printer, TrendingUp, Clock, RefreshCw, Camera, LogOut, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { DoctorData } from '../types';
import { PulseLogo } from './PulseLogo';

interface DoctorDashboardProps {
  onEditProfile?: () => void;
  doctorData?: DoctorData;
}

export function DoctorDashboard({ onEditProfile, doctorData }: DoctorDashboardProps) {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [consultationPatient, setConsultationPatient] = useState<string | null>(null);
  const [consultationTab, setConsultationTab] = useState('Current Consultation');
  const [isScheduleDrawerOpen, setIsScheduleDrawerOpen] = useState(true);
  const [scheduleFilter, setScheduleFilter] = useState<'all' | 'rescheduled'>('all');
  const [rescheduleModalPatient, setRescheduleModalPatient] = useState<string | null>(null);
  const [rescheduledAppts, setRescheduledAppts] = useState<any[]>([
    {
      id: '#PT-12345',
      name: 'Jameson Carter',
      type: 'General Oncology Consultation',
      oldDate: 'Oct 2, 10:30 AM',
      newDate: 'Oct 3, 2023',
      time: '09:15 AM',
      status: 'approved'
    }
  ]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([
    { name: 'David Wilson', id: '#PH-5512', date: 'Oct 30, 2023', time: '10:00 AM', initial: 'DW', bgColor: 'bg-[#005bb5]', textColor: 'text-white', status: 'Upcoming' },
    { name: 'Emma Green', id: '#PH-3349', date: 'Oct 30, 2023', time: '03:45 PM', initial: 'EG', bgColor: 'bg-[#dbeafe]', textColor: 'text-[#1e40af]', status: 'Upcoming' },
  ]);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isEditingVitals, setIsEditingVitals] = useState(false);
  const [isEditingTiming, setIsEditingTiming] = useState(false);
  const [timings, setTimings] = useState([
    { day: 'Monday', start: '09:00 AM', end: '05:00 PM', isWorking: true },
    { day: 'Tuesday', start: '09:00 AM', end: '05:00 PM', isWorking: true },
    { day: 'Wednesday', start: '09:00 AM', end: '05:00 PM', isWorking: true },
    { day: 'Thursday', start: '09:00 AM', end: '05:00 PM', isWorking: true },
    { day: 'Friday', start: '09:00 AM', end: '05:00 PM', isWorking: true },
    { day: 'Saturday', start: '10:00 AM', end: '02:00 PM', isWorking: true },
    { day: 'Sunday', start: '', end: '', isWorking: false },
  ]);

  const [currentDate, setCurrentDate] = useState(new Date(2023, 9, 1)); // Oct 2023 for demo
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const selectedDateStr = selectedDate ? `${monthNames[currentDate.getMonth()].substring(0, 3)} ${selectedDate}, ${currentDate.getFullYear()}` : null;
  
  const currentDrawerAppts = [
    ...(rescheduledAppts.filter(a => selectedDateStr ? a.newDate === selectedDateStr : true)),
    ...(upcomingAppointments.filter(a => a.status === 'Approved' && (selectedDateStr ? a.date === selectedDateStr : true)).map(a => ({
      id: a.id,
      name: a.name,
      type: 'General Consultation',
      oldDate: '',
      newDate: a.date,
      time: a.time,
      status: 'approved',
      isUpcoming: true
    })))
  ];

  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [aboutText, setAboutText] = useState('Experienced Cardiologist with over 12 years of clinical experience. Specializes in preventive cardiology, heart failure management, and non-invasive cardiovascular imaging. Dedicated to providing patient-centered care with the latest evidence-based treatments.');
  const [patientVitals, setPatientVitals] = useState({
    name: 'Sarah Johnson',
    age: '28 Years',
    gender: 'Female',
    bloodType: 'O-Positive',
    contact: '+1 (555) 012-3456',
    bloodPressure: '120/80',
    heartRate: '72',
    height: '170',
    weight: '64.5',
    summary: 'Patient presented with mild insulin resistance in 2021. Managed via dietary control and Metformin. Regular screenings show stable glycemic levels. No known drug allergies.'
  });
  const profilePicInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNavClick = (item: string) => {
    setActiveTab(item);
    setConsultationPatient(null);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const navItems = ['Dashboard', 'Patients', 'Schedule'];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="fixed top-0 left-0 right-0 h-[72px] bg-white border-b border-outline-variant z-50 flex items-center justify-between px-6">
        <div className="flex items-center space-x-12">
          <PulseLogo />
          <nav className="hidden md:flex space-x-8">
            {navItems.map(item => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className={`text-[14px] font-medium h-[72px] relative flex items-center ${
                  activeTab === item ? 'text-[#005bb5]' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {item}
                {activeTab === item && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#005bb5]" />
                )}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-6">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input 
              type="text" 
              placeholder="Search Patients..." 
              className="w-[240px] pl-9 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-full text-[13px] focus:outline-none focus:border-[#005bb5]"
            />
          </div>
          <button className="text-on-surface-variant hover:text-on-surface transition-colors relative">
            <Bell className="w-5 h-5" />
          </button>
          <div className="relative">
            <button 
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="w-8 h-8 rounded-full bg-[#e2e8f0] flex items-center justify-center overflow-hidden border border-outline-variant focus:outline-none focus:ring-2 focus:ring-[#005bb5]"
            >
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px] font-bold text-on-surface-variant">
                  {doctorData?.fullName ? doctorData.fullName.charAt(0).toUpperCase() : 'img'}
                </span>
              )}
            </button>
            
            {isProfileDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileDropdownOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-outline-variant py-1 z-50">
                  <button 
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      setActiveTab('Profile');
                    }}
                    className="w-full text-left px-4 py-2 text-[14px] text-on-surface hover:bg-surface-container-lowest flex items-center transition-colors"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </button>
                  <button 
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      // In a real app, go to settings
                    }}
                    className="w-full text-left px-4 py-2 text-[14px] text-on-surface hover:bg-surface-container-lowest flex items-center transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </button>
                  <div className="h-[1px] bg-outline-variant my-1 w-full" />
                  <button 
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      // In a real app, you would handle logout logic here, like clearing tokens or redirecting
                      window.location.reload(); 
                    }}
                    className="w-full text-left px-4 py-2 text-[14px] text-error hover:bg-surface-container-lowest flex items-center transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
      
      {!consultationPatient ? (
        <main className="pt-[104px] pb-12 px-6 max-w-5xl mx-auto space-y-8">
          {activeTab === 'Profile' ? (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-outline-variant p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-6">
                  <div className="relative group cursor-pointer" onClick={() => profilePicInputRef.current?.click()}>
                    <input 
                      type="file" 
                      ref={profilePicInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const url = URL.createObjectURL(e.target.files[0]);
                          setProfilePic(url);
                        }
                      }} 
                    />
                    <img 
                      src={profilePic || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=faces"} 
                      alt={doctorData?.fullName || "Dr. Jane Smith"} 
                      className="w-[100px] h-[100px] rounded-full object-cover border-[3px] border-white shadow-md group-hover:opacity-75 transition-opacity"
                    />
                    <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-[32px] font-bold text-on-surface leading-tight mb-2">{doctorData?.fullName || 'Dr. Jane Smith'}</h1>
                    <div className="text-[16px] text-on-surface-variant font-medium mb-3">{doctorData?.qualification || 'MBBS, MD'} - {doctorData?.specialization || 'Cardiology'}</div>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center px-3 py-1 bg-[#f1f5f9] rounded-full text-[13px] font-medium text-on-surface-variant">
                        {doctorData?.experience || '12'} Years Experience
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={onEditProfile}
                  className="flex items-center justify-center px-5 py-2 bg-[#005bb5] text-white rounded-md text-[14px] font-bold hover:bg-primary/90 transition-colors shadow-sm self-start md:self-center"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[18px] font-bold text-on-surface">About Me</h2>
                <button 
                  onClick={() => setIsEditingAbout(!isEditingAbout)}
                  className="text-[#005bb5] text-[14px] font-bold hover:underline flex items-center"
                >
                  {isEditingAbout ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </>
                  )}
                </button>
              </div>
              {isEditingAbout ? (
                <textarea
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  className="w-full h-32 p-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-[15px] text-on-surface focus:outline-none focus:border-[#005bb5] resize-none"
                  placeholder="Tell your patients about your experience, specialties, and approach to care..."
                />
              ) : (
                <p className="text-[15px] text-on-surface-variant leading-relaxed">
                  {aboutText}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
                <h2 className="text-[18px] font-bold text-on-surface mb-6">Clinic Information</h2>
                <div className="space-y-6">
                  <div>
                    <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Clinic Name</div>
                    <div className="text-[15px] text-on-surface">{doctorData?.clinicName || 'Pulse Wellness Center'}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Location</div>
                    <div className="flex items-start text-[15px] text-on-surface">
                      <MapPin className="w-4 h-4 mr-2 text-[#005bb5] shrink-0 mt-0.5" />
                      {doctorData?.address || 'Mumbai, Maharashtra'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Contact Info</div>
                    <div className="text-[15px] text-on-surface">{doctorData?.contactInfo || '+91 98765 43210'}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[18px] font-bold text-on-surface">Timing & Availability</h2>
                  <button 
                    onClick={() => setIsEditingTiming(!isEditingTiming)}
                    className="text-[#005bb5] text-[14px] font-bold hover:underline flex items-center"
                  >
                    {isEditingTiming ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-4 h-4 mr-1" />
                        Edit
                      </>
                    )}
                  </button>
                </div>
                <div className="space-y-4">
                  {timings.map((timing, index) => (
                    <div key={timing.day} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 w-1/3">
                        {isEditingTiming ? (
                          <input 
                            type="checkbox" 
                            checked={timing.isWorking}
                            onChange={(e) => {
                              const newTimings = [...timings];
                              newTimings[index].isWorking = e.target.checked;
                              if (!e.target.checked) {
                                newTimings[index].start = '';
                                newTimings[index].end = '';
                              } else {
                                newTimings[index].start = '09:00 AM';
                                newTimings[index].end = '05:00 PM';
                              }
                              setTimings(newTimings);
                            }}
                            className="w-4 h-4 text-[#005bb5] border-outline-variant rounded focus:ring-[#005bb5]"
                          />
                        ) : (
                          <div className={`w-2 h-2 rounded-full ${timing.isWorking ? 'bg-[#059669]' : 'bg-outline-variant'}`} />
                        )}
                        <span className={`text-[15px] ${timing.isWorking ? 'text-on-surface font-medium' : 'text-on-surface-variant'}`}>
                          {timing.day}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 w-2/3 justify-end">
                        {timing.isWorking ? (
                          isEditingTiming ? (
                            <>
                              <input 
                                type="time" 
                                value={
                                  timing.start.includes('PM') 
                                    ? String((parseInt(timing.start.split(':')[0]) % 12) + 12).padStart(2, '0') + ':' + timing.start.split(':')[1].split(' ')[0]
                                    : timing.start.includes('AM') 
                                      ? String(parseInt(timing.start.split(':')[0]) % 12).padStart(2, '0') + ':' + timing.start.split(':')[1].split(' ')[0]
                                      : timing.start
                                }
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (!val) return;
                                  const [h, m] = val.split(':');
                                  const ampm = parseInt(h) >= 12 ? 'PM' : 'AM';
                                  const hour12 = parseInt(h) % 12 || 12;
                                  const newTimings = [...timings];
                                  newTimings[index].start = `${String(hour12).padStart(2, '0')}:${m} ${ampm}`;
                                  setTimings(newTimings);
                                }}
                                className="w-28 px-2 py-1 bg-surface-container-lowest border border-outline-variant rounded text-[13px] focus:outline-none focus:border-[#005bb5]"
                              />
                              <span className="text-on-surface-variant text-[12px] font-medium">to</span>
                              <input 
                                type="time" 
                                value={
                                  timing.end.includes('PM') 
                                    ? String((parseInt(timing.end.split(':')[0]) % 12) + 12).padStart(2, '0') + ':' + timing.end.split(':')[1].split(' ')[0]
                                    : timing.end.includes('AM') 
                                      ? String(parseInt(timing.end.split(':')[0]) % 12).padStart(2, '0') + ':' + timing.end.split(':')[1].split(' ')[0]
                                      : timing.end
                                }
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (!val) return;
                                  const [h, m] = val.split(':');
                                  const ampm = parseInt(h) >= 12 ? 'PM' : 'AM';
                                  const hour12 = parseInt(h) % 12 || 12;
                                  const newTimings = [...timings];
                                  newTimings[index].end = `${String(hour12).padStart(2, '0')}:${m} ${ampm}`;
                                  setTimings(newTimings);
                                }}
                                className="w-28 px-2 py-1 bg-surface-container-lowest border border-outline-variant rounded text-[13px] focus:outline-none focus:border-[#005bb5]"
                              />
                            </>
                          ) : (
                            <div className="flex items-center text-[14px] text-on-surface bg-[#f8fafc] px-3 py-1.5 rounded-md border border-outline-variant font-medium">
                              <Clock className="w-3.5 h-3.5 mr-1.5 text-on-surface-variant" />
                              {timing.start} - {timing.end}
                            </div>
                          )
                        ) : (
                          <span className="text-[13px] font-medium text-on-surface-variant italic px-3 py-1.5">Closed</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'Dashboard' ? (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-[32px] font-bold text-on-surface mb-1">
                Welcome back, {doctorData?.fullName || 'Dr. Miller'}
              </h1>
              <p className="text-[15px] text-on-surface-variant">
                Here is your schedule for <span className="font-semibold text-[#005bb5]">Tomorrow, Thursday, July 30</span>.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm mb-8">
              <div className="px-6 py-5 border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest">
                <h2 className="text-[18px] font-bold text-on-surface">Today's Appointments</h2>
                <div className="flex items-center px-3 py-1 bg-[#eff6ff] rounded-full text-[12px] font-bold text-[#005bb5]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#005bb5] mr-2" />
                  Live Sync Active
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant">
                      <th className="px-6 py-4 text-[12px] font-bold text-on-surface-variant uppercase tracking-wider w-[120px]">Patient ID</th>
                      <th className="px-6 py-4 text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-[12px] font-bold text-on-surface-variant uppercase tracking-wider w-[120px]">Type</th>
                      <th className="px-6 py-4 text-[12px] font-bold text-on-surface-variant uppercase tracking-wider w-[150px]">Scheduled</th>
                      <th className="px-6 py-4 text-[12px] font-bold text-on-surface-variant uppercase tracking-wider w-[240px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 'PX-999', name: 'Future Patient', initial: 'FP', type: 'TEST', time: '09:00 AM' },
                      { id: 'PX-1002', name: 'Sarah Mitchell', initial: 'SM', type: 'FOLLOW UP', time: '10:30 AM' },
                      { id: 'PX-1005', name: 'David Wilson', initial: 'DW', type: 'ROUTINE', time: '01:15 PM' },
                    ].map((pt, index) => (
                      <tr 
                        key={index} 
                        onClick={() => setConsultationPatient(pt.id)}
                        className="hover:bg-surface-container-lowest transition-colors border-b border-outline-variant last:border-0 cursor-pointer"
                      >
                        <td className="px-6 py-4 text-[14px] text-on-surface-variant font-medium">{pt.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[10px] font-bold text-on-surface-variant">{pt.initial}</div>
                            <span className="text-[14px] font-medium text-on-surface">{pt.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-[#f1f5f9] text-on-surface-variant text-[11px] font-bold rounded-full uppercase tracking-wide">{pt.type}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-[13px] text-on-surface-variant">Today</div>
                          <div className="text-[14px] font-bold text-[#005bb5]">{pt.time}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setConsultationPatient(pt.id); }}
                              className="px-4 py-2 bg-[#005bb5] text-white text-[13px] font-bold rounded-md hover:bg-primary/90 transition-colors"
                            >
                              View Profile
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setRescheduleModalPatient(pt.name); }}
                              className="px-4 py-2 bg-white border border-outline-variant text-on-surface text-[13px] font-bold rounded-md hover:bg-surface-container-lowest transition-colors"
                            >
                              Reschedule
                            </button>
                            <button 
                              onClick={(e) => e.stopPropagation()}
                              className="w-9 h-9 flex items-center justify-center text-[#059669] hover:bg-[#ecfdf5] rounded-full transition-colors"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative rounded-xl overflow-hidden h-[240px] shadow-sm flex items-end p-6 border border-outline-variant">
                <img 
                  src="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=400&fit=crop" 
                  alt="Medical equipment" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#005bb5]/90 to-transparent" />
                <div className="relative z-10 text-white max-w-sm">
                  <h3 className="text-[24px] font-bold mb-2">Patient Analytics</h3>
                  <p className="text-[14px] text-white/90">
                    Review monthly trends and diagnostic success rates in the new data center.
                  </p>
                </div>
              </div>

              <div className="bg-[#f1f5f9] rounded-xl border border-outline-variant p-8 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="w-32 h-32 absolute -right-8 -bottom-8 opacity-10">
                  <svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="40" />
                    <circle cx="20" cy="20" r="15" />
                    <circle cx="80" cy="80" r="15" />
                    <circle cx="20" cy="80" r="15" />
                    <circle cx="80" cy="20" r="15" />
                  </svg>
                </div>
                <div className="w-12 h-12 mb-4 text-[#005bb5]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    <path d="M12 11v4"></path>
                    <path d="M10 13h4"></path>
                  </svg>
                </div>
                <h3 className="text-[20px] font-bold text-on-surface mb-3 relative z-10">Telehealth Integration</h3>
                <p className="text-[14px] text-on-surface-variant mb-6 max-w-xs relative z-10">
                  Connect with remote patients via secure HD video calls directly from your portal.
                </p>
                <button className="px-8 py-2 bg-transparent border-2 border-[#005bb5] text-[#005bb5] text-[14px] font-bold rounded-md hover:bg-[#005bb5] hover:text-white transition-colors relative z-10">
                  Launch Portal
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === 'Patients' ? (
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className="text-[32px] font-bold text-on-surface mb-1">
                Patients Overview
              </h1>
              <p className="text-[15px] text-on-surface-variant">
                Manage your patient profiles and view key metrics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm flex items-center space-x-5">
                <div className="w-14 h-14 rounded-full bg-[#eff6ff] flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-[#005bb5]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Patients Seen Today</div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-[28px] font-bold text-on-surface leading-none">12</span>
                    <span className="text-[12px] font-medium text-[#059669]">+2 from yesterday</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm flex items-center space-x-5">
                <div className="w-14 h-14 rounded-full bg-[#f1f5f9] flex items-center justify-center shrink-0">
                  <ClipboardList className="w-6 h-6 text-on-surface-variant" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Pending Requests</div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-[28px] font-bold text-on-surface leading-none">04</span>
                    <span className="text-[12px] font-medium text-[#dc2626]">Requires Action</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm flex items-center space-x-5">
                <div className="w-14 h-14 rounded-full bg-[#ecfdf5] flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-[#059669]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total Patients</div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-[28px] font-bold text-on-surface leading-none">1,248</span>
                    <span className="text-[12px] font-medium text-on-surface-variant">Active Profiles</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Past Appointments */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-[18px] font-bold text-on-surface flex items-center">
                    <RotateCcw className="w-5 h-5 mr-2 text-[#005bb5]" />
                    Past Appointments
                  </h2>
                  <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-[12px] font-medium rounded-md">Read-only</span>
                </div>

                {[
                  { name: 'Jane Smith', id: '#PH-9821', date: 'Oct 24, 2023', time: '09:30 AM', initial: 'JS', bgColor: 'bg-[#e0e7ff]', textColor: 'text-[#3730a3]' },
                  { name: 'Robert Miller', id: '#PH-7740', date: 'Oct 22, 2023', time: '02:15 PM', initial: 'RM', bgColor: 'bg-[#e2e8f0]', textColor: 'text-[#475569]' },
                  { name: 'Alice Lawson', id: '#PH-2109', date: 'Oct 20, 2023', time: '11:00 AM', initial: 'AL', bgColor: 'bg-[#e2e8f0]', textColor: 'text-[#475569]' },
                ].map((apt, i) => (
                  <div 
                    key={i} 
                    onClick={() => setConsultationPatient(apt.id)}
                    className="bg-white rounded-xl border border-outline-variant p-5 shadow-sm cursor-pointer hover:border-[#005bb5] transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg ${apt.bgColor} ${apt.textColor} flex items-center justify-center text-[16px] font-bold`}>
                          {apt.initial}
                        </div>
                        <div>
                          <div className="text-[15px] font-bold text-on-surface">{apt.name}</div>
                          <div className="text-[13px] text-on-surface-variant">ID: {apt.id}</div>
                        </div>
                      </div>
                      <div className="flex items-center px-2.5 py-1 bg-[#ccfbf1] text-[#0f766e] text-[12px] font-bold rounded-full">
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        Attended
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-[14px] text-on-surface-variant">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {apt.date}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {apt.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upcoming Appointments */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-[18px] font-bold text-on-surface flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-[#005bb5]" />
                    Upcoming Appointments
                  </h2>
                </div>

                {upcomingAppointments.map((apt, i) => (
                  <div 
                    key={i} 
                    onClick={() => setConsultationPatient(apt.id)}
                    className="bg-white rounded-xl border border-outline-variant p-5 shadow-sm relative overflow-hidden cursor-pointer hover:border-[#005bb5] transition-colors"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#005bb5]" />
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg ${apt.bgColor} ${apt.textColor} flex items-center justify-center text-[16px] font-bold`}>
                          {apt.initial}
                        </div>
                        <div>
                          <div className="text-[15px] font-bold text-on-surface">{apt.name}</div>
                          <div className="text-[13px] text-on-surface-variant">ID: {apt.id}</div>
                        </div>
                      </div>
                      <div className={`flex items-center px-2.5 py-1 text-[12px] font-bold rounded-full ${
                        apt.status === 'Approved' ? 'bg-[#ecfdf5] text-[#059669]' : 'bg-[#e0e7ff] text-[#4f46e5]'
                      }`}>
                        {apt.status === 'Approved' && <CheckCircle className="w-3.5 h-3.5 mr-1" />}
                        {apt.status}
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-[14px] text-on-surface-variant mb-6">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {apt.date}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {apt.time}
                      </div>
                    </div>
                    
                    {apt.status !== 'Approved' && (
                      <div className="flex gap-3">
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation();
                            setUpcomingAppointments(prev => prev.map((a, idx) => idx === i ? { ...a, status: 'Approved' } : a));
                          }}
                          className="flex-1 px-4 py-2 bg-[#005bb5] text-white text-[14px] font-bold rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center"
                        >
                          <Check className="w-4 h-4 mr-1.5" strokeWidth={3} />
                          Approve
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setRescheduleModalPatient(apt.name); }}
                          className="flex-1 px-4 py-2 bg-white border border-outline-variant text-on-surface text-[14px] font-bold rounded-md hover:bg-surface-container-lowest transition-colors flex items-center justify-center"
                        >
                          <Calendar className="w-4 h-4 mr-1.5" />
                          Reschedule
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === 'Schedule' ? (
          <div className="relative -mx-6 -mt-8">
            {/* Main Content (Blurred if drawer is open) */}
            <div className={`p-6 transition-all duration-300 min-h-screen ${isScheduleDrawerOpen ? 'blur-[4px] pointer-events-none' : ''}`}>
              <div className="flex gap-8 max-w-6xl mx-auto mt-8">
                {/* Left Sidebar */}
                <div className="w-[260px] shrink-0 space-y-6">
                   <div className="bg-white rounded-xl border border-outline-variant p-5 shadow-sm">
                      <h3 className="text-[14px] font-bold text-on-surface mb-4">Quick Filters</h3>
                      <div className="space-y-2">
                         <button 
                            onClick={() => setScheduleFilter('all')}
                            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${scheduleFilter === 'all' ? 'bg-[#005bb5] text-white' : 'bg-transparent text-on-surface-variant hover:bg-surface-container-lowest'}`}
                         >
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              All Appointments
                            </div>
                         </button>
                         <button 
                            onClick={() => setScheduleFilter('rescheduled')}
                            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${scheduleFilter === 'rescheduled' ? 'bg-[#005bb5] text-white' : 'bg-transparent text-on-surface-variant hover:bg-surface-container-lowest'}`}
                         >
                            <div className="flex items-center">
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Rescheduled Only
                            </div>
                         </button>
                      </div>
                   </div>
                   
                   <div className="bg-white rounded-xl border border-outline-variant p-5 shadow-sm">
                      <h3 className="text-[14px] font-bold text-on-surface mb-4">Status Legend</h3>
                      <div className="space-y-3">
                         <div className="flex items-center text-[14px] text-on-surface">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#059669] mr-3" />
                            Confirmed
                         </div>
                         <div className="flex items-center text-[14px] text-on-surface">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#f97316] mr-3" />
                            Pending
                         </div>
                         <div className="flex items-center text-[14px] text-on-surface">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#005bb5] mr-3" />
                            Rescheduled
                         </div>
                      </div>
                   </div>
                   
                   <div className="bg-white rounded-xl border border-outline-variant p-5 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                         <h3 className="text-[14px] font-bold text-on-surface">Daily Insight</h3>
                         <TrendingUp className="w-4 h-4 text-outline" />
                      </div>
                      <div className="text-[32px] font-bold text-[#005bb5] mb-2">4</div>
                      <p className="text-[13px] text-on-surface-variant leading-relaxed mb-4">
                         Appointments rescheduled for today. High priority attention required for patient #PT-0821.
                      </p>
                      <button className="text-[13px] font-bold text-[#005bb5] hover:underline">
                         View Details ↑
                      </button>
                   </div>
                </div>
                
                {/* Calendar Area */}
                <div className="flex-1 bg-white rounded-xl border border-outline-variant p-6 shadow-sm min-h-[600px] flex flex-col">
                   <div className="mb-6 flex items-end justify-between">
                      <div className="relative">
                        <div 
                          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                        >
                          <h2 className="text-[20px] font-bold text-on-surface mb-1 flex items-center">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            <ChevronDown className="w-5 h-5 ml-2 text-on-surface" />
                          </h2>
                        </div>
                        <p className="text-[14px] text-on-surface-variant">Manage and track medical appointments.</p>
                        
                        {isDatePickerOpen && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsDatePickerOpen(false)} />
                            <div className="absolute top-full left-0 mt-2 p-4 bg-white rounded-xl shadow-lg border border-outline-variant z-50 min-w-[300px]">
                              <div className="flex justify-between items-center mb-4 relative z-50">
                                <button 
                                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1))}
                                  className="p-1.5 hover:bg-surface-container-lowest rounded-md text-on-surface-variant transition-colors"
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="font-bold text-[15px] text-on-surface">{currentDate.getFullYear()}</span>
                                <button 
                                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1))}
                                  className="p-1.5 hover:bg-surface-container-lowest rounded-md text-on-surface-variant transition-colors"
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="grid grid-cols-3 gap-2 relative z-50">
                                {monthNames.map((month, idx) => (
                                  <button
                                    key={month}
                                    onClick={() => {
                                      setCurrentDate(new Date(currentDate.getFullYear(), idx, 1));
                                      setIsDatePickerOpen(false);
                                      setSelectedDate(null);
                                    }}
                                    className={`py-2 px-1 text-[13px] font-bold rounded-lg transition-colors ${currentDate.getMonth() === idx ? 'bg-[#005bb5] text-white' : 'hover:bg-[#eff6ff] hover:text-[#005bb5] text-on-surface-variant'}`}
                                  >
                                    {month.substring(0, 3)}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={handlePrevMonth} className="p-2 border border-outline-variant rounded-md hover:bg-surface-container-lowest text-on-surface transition-colors">
                          <ChevronLeft className="w-5 h-5 text-on-surface" />
                        </button>
                        <button onClick={handleNextMonth} className="p-2 border border-outline-variant rounded-md hover:bg-surface-container-lowest text-on-surface transition-colors">
                          <ChevronRight className="w-5 h-5 text-on-surface" />
                        </button>
                      </div>
                   </div>
                   <div className="flex-1 border border-outline-variant rounded-lg overflow-hidden flex flex-col">
                     <div className="grid grid-cols-7 bg-surface-container-lowest border-b border-outline-variant text-center">
                       {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                         <div key={day} className="py-3 text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">{day}</div>
                       ))}
                     </div>
                     <div className="grid grid-cols-7 flex-1">
                       {Array.from({ length: 42 }).map((_, idx) => {
                         const date = idx - firstDay + 1;
                         const isCurrentMonth = date > 0 && date <= daysInMonth;
                         const cellDate = isCurrentMonth ? date : null;
                         const isSelected = selectedDate === cellDate;
                         
                         // Mock data logic based on date
                         let isRescheduled = false;
                         let isConfirmed = false;
                         let isPending = false;
                         
                         if (cellDate) {
                           // Example mock logic matching month
                           if (currentDate.getMonth() === 9 && currentDate.getFullYear() === 2023) {
                             if (cellDate === 11) isRescheduled = true;
                             if (cellDate === 2 || cellDate === 15) isConfirmed = true;
                             if (cellDate === 4 || cellDate === 11) isPending = true;
                             if (cellDate === 20) { isConfirmed = true; isPending = true; }
                           } else {
                             // Randomly populate a few dates for other months
                             if (cellDate === 5) isConfirmed = true;
                             if (cellDate === 12) isPending = true;
                           }
                           
                           // Dynamically check rescheduled appointments
                           const monthStr = monthNames[currentDate.getMonth()].substring(0, 3);
                           const cellDateStr = `${monthStr} ${cellDate}, ${currentDate.getFullYear()}`;
                           if (rescheduledAppts.some(apt => apt.newDate === cellDateStr)) {
                             isRescheduled = true;
                           }
                           
                           // Check approved upcoming appointments
                           if (upcomingAppointments.some(apt => apt.date === cellDateStr && apt.status === 'Approved')) {
                             isConfirmed = true;
                           }
                         }

                         const hasAppt = isRescheduled || isConfirmed || isPending;
                         const isColEnd = (idx + 1) % 7 === 0;
                         const isRowEnd = idx >= 35;
                         
                         return (
                           <div 
                             key={idx}
                             onClick={() => {
                               if (cellDate) {
                                 setSelectedDate(isSelected ? null : cellDate);
                               }
                             }}
                             className={`p-2 min-h-[120px] bg-white ${hasAppt && isCurrentMonth ? 'cursor-pointer hover:bg-surface-container-lowest transition-colors' : ''} ${!isColEnd ? 'border-r' : ''} ${!isRowEnd ? 'border-b' : ''} border-outline-variant ${isSelected ? 'ring-2 ring-inset ring-[#005bb5] bg-[#eff6ff]' : ''}`}
                           >
                             <span className={`text-[14px] font-medium ${isCurrentMonth ? 'text-on-surface' : 'text-transparent'}`}>
                               {cellDate || idx}
                             </span>
                             {isCurrentMonth && scheduleFilter === 'all' && (
                               <div className="mt-2 space-y-1.5 w-full px-1">
                                 {isConfirmed && <div className="w-full h-1.5 bg-[#059669] rounded-full"></div>}
                                 {isPending && <div className="w-full h-1.5 bg-[#f97316] rounded-full"></div>}
                                 {isRescheduled && <div className="w-full h-1.5 bg-[#005bb5] rounded-full"></div>}
                               </div>
                             )}
                             {isCurrentMonth && hasAppt && scheduleFilter === 'rescheduled' && (
                               <div className="mt-2 space-y-1.5 w-full px-1">
                                 {isRescheduled && <div className="w-full h-1.5 bg-[#005bb5] rounded-full"></div>}
                               </div>
                             )}
                             {isSelected && cellDate && hasAppt && (
                               <div className="mt-3 text-[11px] font-medium text-on-surface-variant flex flex-col gap-1 leading-tight">
                                 {isConfirmed && <div className="flex items-center"><span className="text-[#059669] mr-1.5 text-[14px]">•</span> 2 Confirmed</div>}
                                 {isPending && <div className="flex items-center"><span className="text-[#f97316] mr-1.5 text-[14px]">•</span> 1 Pending</div>}
                                 {isRescheduled && <div className="flex items-center"><span className="text-[#005bb5] mr-1.5 text-[14px]">•</span> 1 Rescheduled</div>}
                                 {hasAppt && (
                                   <button 
                                     onClick={(e) => { e.stopPropagation(); setIsScheduleDrawerOpen(true); }}
                                     className="mt-1 text-[#005bb5] hover:underline text-left text-[11px] font-bold"
                                   >
                                     View Details →
                                   </button>
                                 )}
                               </div>
                             )}
                           </div>
                         );
                       })}
                     </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Drawer Overlay */}
            {isScheduleDrawerOpen && (
              <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsScheduleDrawerOpen(false)} />
            )}
            
            {/* Drawer */}
            <div className={`fixed top-0 right-0 bottom-0 w-[420px] bg-white border-l border-outline-variant shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${isScheduleDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
               <div className="p-6 border-b border-outline-variant flex items-start justify-between bg-white">
                  <div>
                     <h2 className="text-[18px] font-bold text-on-surface">Appointment Details</h2>
                     <p className="text-[14px] text-on-surface-variant mt-1">{selectedDateStr || 'No date selected'}</p>
                  </div>
                  <button onClick={() => setIsScheduleDrawerOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-lowest text-on-surface-variant transition-colors">
                     <X className="w-5 h-5" />
                  </button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
                  {currentDrawerAppts.length === 0 && (
                    <div className="text-center py-8 text-on-surface-variant text-[14px]">
                      No appointments for this date.
                    </div>
                  )}
                  {currentDrawerAppts.filter(apt => apt.status !== 'declined').map((apt, index) => (
                    <div key={index} className={`border rounded-xl p-5 relative overflow-hidden bg-white shadow-sm ${apt.status === 'approved' ? 'border-[#bfdbfe]' : 'border-[#fed7aa]'}`}>
                       <div className={`absolute top-0 right-0 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg flex items-center ${apt.status === 'approved' ? 'bg-[#005bb5]' : 'bg-[#f97316]'}`}>
                          {apt.status === 'approved' ? (
                            <>
                              <Check className="w-3 h-3 mr-1" />
                              {apt.isUpcoming ? 'Confirmed' : 'Rescheduled'}
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Pending
                            </>
                          )}
                       </div>
                       
                       <div className="flex items-start space-x-4 mb-5 mt-2">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${apt.status === 'approved' ? 'bg-[#eff6ff]' : 'bg-[#ffedd5]'}`}>
                             <User className={`w-6 h-6 ${apt.status === 'approved' ? 'text-[#005bb5]' : 'text-[#f97316]'}`} />
                          </div>
                          <div>
                             <div className={`text-[12px] font-medium mb-0.5 ${apt.status === 'approved' ? 'text-[#005bb5]' : 'text-[#f97316]'}`}>{apt.id}</div>
                             <h3 className="text-[16px] font-bold text-on-surface leading-tight">{apt.name}</h3>
                             <p className="text-[13px] text-on-surface-variant">{apt.type}</p>
                          </div>
                       </div>
                       
                       <div className={`rounded-lg p-3 flex justify-between items-center border ${apt.status === 'approved' ? 'bg-[#f8fafc] border-outline-variant' : 'bg-[#fff7ed] border-[#ffedd5]'}`}>
                          {apt.oldDate ? (
                            <>
                              <div>
                                 <div className="text-[11px] font-medium text-on-surface-variant mb-0.5">Original Schedule</div>
                                 <div className="text-[13px] text-on-surface-variant line-through">{apt.oldDate}</div>
                              </div>
                              <div className={`w-[1px] h-8 ${apt.status === 'approved' ? 'bg-outline-variant' : 'bg-[#fed7aa]'}`} />
                            </>
                          ) : null}
                          <div>
                             <div className={`text-[11px] font-bold mb-0.5 ${apt.status === 'approved' ? 'text-[#005bb5]' : 'text-[#ea580c]'}`}>{apt.oldDate ? 'New Schedule' : 'Schedule'}</div>
                             <div className={`text-[13px] font-bold ${apt.status === 'approved' ? 'text-[#005bb5]' : 'text-[#c2410c]'}`}>{apt.newDate}, {apt.time}</div>
                          </div>
                       </div>
                       
                       {apt.status === 'pending' && (
                         <div className="flex gap-3 mt-5">
                            <button 
                              onClick={() => {
                                const newAppts = [...rescheduledAppts];
                                const originalIndex = rescheduledAppts.findIndex(a => a.id === apt.id);
                                if (originalIndex !== -1) {
                                  newAppts[originalIndex].status = 'approved';
                                  setRescheduledAppts(newAppts);
                                }
                              }}
                              className="flex-1 py-2 bg-[#005bb5] text-white text-[14px] font-bold rounded-lg hover:bg-primary/90 transition-colors"
                            >
                               Accept Change
                            </button>
                            <button 
                              onClick={() => {
                                const newAppts = [...rescheduledAppts];
                                const originalIndex = rescheduledAppts.findIndex(a => a.id === apt.id);
                                if (originalIndex !== -1) {
                                  newAppts[originalIndex].status = 'declined';
                                  setRescheduledAppts(newAppts);
                                }
                              }}
                              className="flex-1 py-2 bg-white border border-outline-variant text-on-surface text-[14px] font-bold rounded-lg hover:bg-surface-container-lowest transition-colors"
                            >
                               Decline
                            </button>
                         </div>
                       )}
                    </div>
                  ))}
               </div>
               
               <div className="p-6 border-t border-outline-variant bg-surface-container-lowest">
                  <button className="w-full py-3 bg-[#e2e8f0] text-[#0f172a] text-[14px] font-bold rounded-lg hover:bg-[#cbd5e1] transition-colors flex items-center justify-center">
                     <Printer className="w-4 h-4 mr-2" />
                     Download Day Summary
                  </button>
               </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
            <p>This tab is not implemented yet.</p>
          </div>
        )}
        </main>
      ) : (
        <div className="pt-[72px] flex min-h-screen bg-[#f8fafc]">
          <div className="w-[240px] border-r border-outline-variant bg-[#f8fafc] flex flex-col justify-between shrink-0 fixed top-[72px] bottom-0 left-0">
             <div className="p-4 space-y-2 mt-4">
                {['Current Consultation', 'Lab Results', 'Medical History'].map(item => (
                  <button
                    key={item}
                    onClick={() => setConsultationTab(item)}
                    className={`w-full flex items-center px-4 py-3 rounded-md text-[14px] font-medium transition-colors ${
                      consultationTab === item
                        ? 'bg-[#e2e8f0] text-[#0f172a]'
                        : 'text-on-surface-variant hover:bg-surface-container-lowest'
                    }`}
                  >
                    {item === 'Current Consultation' && <Calendar className="w-4 h-4 mr-3" />}
                    {item === 'Lab Results' && <Activity className="w-4 h-4 mr-3" />}
                    {item === 'Medical History' && <ClipboardList className="w-4 h-4 mr-3" />}
                    {item}
                  </button>
                ))}
             </div>
             <div className="p-4">
                <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-center space-x-3 shadow-sm">
                   <div className="w-8 h-8 bg-[#005bb5] rounded-md flex items-center justify-center text-white shrink-0">
                      <PlusSquare className="w-5 h-5" />
                   </div>
                   <div>
                     <div className="text-[14px] font-bold text-[#005bb5]">Pulse Health</div>
                     <div className="text-[11px] text-on-surface-variant">Clinical Portal v2.4</div>
                   </div>
                </div>
             </div>
          </div>
          
          <div className="flex-1 ml-[240px] p-8">
             <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
                   <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-full bg-[#dbeafe] flex items-center justify-center text-[18px] font-bold text-[#1e40af]">
                          SJ
                        </div>
                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <h2 className="text-[20px] font-bold text-on-surface">{patientVitals.name}</h2>
                            <span className="px-2 py-0.5 bg-[#f1f5f9] text-on-surface-variant text-[12px] font-medium rounded-md">#PT-88219</span>
                          </div>
                          <div className="text-[14px] text-on-surface-variant font-medium flex items-center gap-2 mt-2">
                            <>{patientVitals.age} • {patientVitals.gender} • {patientVitals.bloodType}</>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-8">
                        <div className="text-right">
                          <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">CONTACT</div>
                          <div className="text-[14px] text-on-surface font-medium">{patientVitals.contact}</div>
                        </div>
                        <div className="w-[1px] h-10 bg-outline-variant" />
                        <div className="text-right">
                          <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">STATUS</div>
                          <div className="inline-flex items-center px-3 py-1 bg-[#ccfbf1] text-[#0f766e] text-[12px] font-bold rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#0f766e] mr-1.5" />
                            Active Care
                          </div>
                        </div>
                      </div>
                   </div>
                   
                   <div className="w-full h-[1px] bg-outline-variant mb-6" />
                   
                   <div className="flex justify-between items-center mb-4">
                     <h3 className="text-[16px] font-bold text-on-surface">Patient Details & Vitals</h3>
                     <button
                       onClick={() => setIsEditingVitals(!isEditingVitals)}
                       className="text-[14px] font-medium text-[#005bb5] hover:underline flex items-center"
                     >
                       {isEditingVitals ? <><Check className="w-4 h-4 mr-1" /> Save Details</> : <><Edit2 className="w-4 h-4 mr-1" /> Edit Details</>}
                     </button>
                   </div>
                   
                   <div className="grid grid-cols-4 gap-4 mb-6">
                     <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4">
                       <div className="text-[12px] font-medium text-on-surface-variant mb-1">Blood Pressure</div>
                       {isEditingVitals ? (
                         <div className="flex items-center">
                           <input type="text" className="w-full text-[20px] font-bold text-[#005bb5] bg-white border border-outline-variant rounded px-2 py-1 mr-2" value={patientVitals.bloodPressure} onChange={(e) => setPatientVitals({...patientVitals, bloodPressure: e.target.value})} />
                           <span className="text-[14px] font-medium text-on-surface-variant shrink-0">mmHg</span>
                         </div>
                       ) : (
                         <div className="text-[20px] font-bold text-[#005bb5]">{patientVitals.bloodPressure} <span className="text-[14px] font-medium text-on-surface-variant">mmHg</span></div>
                       )}
                     </div>
                     <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4">
                       <div className="text-[12px] font-medium text-on-surface-variant mb-1">Heart Rate</div>
                       {isEditingVitals ? (
                         <div className="flex items-center">
                           <input type="text" className="w-full text-[20px] font-bold text-[#005bb5] bg-white border border-outline-variant rounded px-2 py-1 mr-2" value={patientVitals.heartRate} onChange={(e) => setPatientVitals({...patientVitals, heartRate: e.target.value})} />
                           <span className="text-[14px] font-medium text-on-surface-variant shrink-0">bpm</span>
                         </div>
                       ) : (
                         <div className="text-[20px] font-bold text-[#005bb5]">{patientVitals.heartRate} <span className="text-[14px] font-medium text-on-surface-variant">bpm</span></div>
                       )}
                     </div>
                     <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4">
                       <div className="text-[12px] font-medium text-on-surface-variant mb-1">Height</div>
                       {isEditingVitals ? (
                         <div className="flex items-center">
                           <input type="text" className="w-full text-[20px] font-bold text-[#005bb5] bg-white border border-outline-variant rounded px-2 py-1 mr-2" value={patientVitals.height} onChange={(e) => setPatientVitals({...patientVitals, height: e.target.value})} />
                           <span className="text-[14px] font-medium text-on-surface-variant shrink-0">cm</span>
                         </div>
                       ) : (
                         <div className="text-[20px] font-bold text-[#005bb5]">{patientVitals.height} <span className="text-[14px] font-medium text-on-surface-variant">cm</span></div>
                       )}
                     </div>
                     <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4">
                       <div className="text-[12px] font-medium text-on-surface-variant mb-1">Weight</div>
                       {isEditingVitals ? (
                         <div className="flex items-center">
                           <input type="text" className="w-full text-[20px] font-bold text-[#005bb5] bg-white border border-outline-variant rounded px-2 py-1 mr-2" value={patientVitals.weight} onChange={(e) => setPatientVitals({...patientVitals, weight: e.target.value})} />
                           <span className="text-[14px] font-medium text-on-surface-variant shrink-0">kg</span>
                         </div>
                       ) : (
                         <div className="text-[20px] font-bold text-[#005bb5]">{patientVitals.weight} <span className="text-[14px] font-medium text-on-surface-variant">kg</span></div>
                       )}
                     </div>
                   </div>
                   
                   <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 relative">
                     {isEditingVitals ? (
                       <div>
                         <span className="text-[14px] font-bold not-italic block mb-2">Summary:</span>
                         <textarea 
                           className="w-full text-[14px] text-on-surface italic leading-relaxed bg-white border border-outline-variant rounded p-2 min-h-[80px]"
                           value={patientVitals.summary}
                           onChange={(e) => setPatientVitals({...patientVitals, summary: e.target.value})}
                         />
                       </div>
                     ) : (
                       <p className="text-[14px] text-on-surface italic leading-relaxed">
                         <span className="font-bold not-italic">Summary:</span> {patientVitals.summary}
                       </p>
                     )}
                   </div>
                </div>
                
               {consultationTab === 'Current Consultation' && (
                 <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
                   <div className="flex justify-between items-center mb-6">
                     <h3 className="text-[16px] font-bold text-on-surface">Upload Documents</h3>
                     <span className="text-[12px] font-medium text-on-surface-variant">Max file size: 10MB</span>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                     <div className="space-y-1.5">
                       <label className="text-[13px] font-medium text-on-surface">Document Type</label>
                       <div className="relative">
                         <select className="w-full px-3 py-2.5 border border-outline-variant rounded-md text-[14px] focus:outline-none focus:border-[#005bb5] appearance-none bg-transparent font-medium text-on-surface">
                           <option value="">Select document type</option>
                           <option value="report">Lab / Medical Report</option>
                           <option value="prescription">Prescription</option>
                         </select>
                         <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-outline pointer-events-none" />
                       </div>
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-[13px] font-medium text-on-surface">Upload Format</label>
                       <div className="relative">
                         <select className="w-full px-3 py-2.5 border border-outline-variant rounded-md text-[14px] focus:outline-none focus:border-[#005bb5] appearance-none bg-transparent font-medium text-on-surface">
                           <option value="">Select format</option>
                           <option value="pdf">PDF Document (.pdf)</option>
                           <option value="jpg">JPEG Image (.jpg)</option>
                           <option value="jpeg">JPEG Image (.jpeg)</option>
                           <option value="png">PNG Image (.png)</option>
                         </select>
                         <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-outline pointer-events-none" />
                       </div>
                     </div>
                   </div>
                   
                   <div 
                     onClick={handleBrowseClick}
                     className="border-2 border-dashed border-outline-variant rounded-xl bg-surface-container-lowest flex flex-col items-center justify-center py-12 px-6 hover:bg-[#f8fafc] transition-colors cursor-pointer"
                   >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <div className="w-12 h-12 bg-[#e2e8f0] rounded-lg flex items-center justify-center text-[#005bb5] mb-4">
                        <FileUp className="w-6 h-6" />
                      </div>
                      <div className="text-[16px] font-medium text-on-surface mb-2">
                        Drag & drop or <span className="text-[#005bb5] font-bold hover:underline">browse</span>
                      </div>
                      <div className="text-[12px] text-on-surface-variant font-medium">
                        Supported formats: PDF, JPG, JPEG, PNG
                      </div>
                   </div>
                 </div>
               )}

               {consultationTab === 'Lab Results' && (
                 <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
                   <h3 className="text-[16px] font-bold text-on-surface mb-6">Past Lab Results</h3>
                   
                   <div className="space-y-4">
                     {[
                       { date: 'Jul 15, 2026', name: 'Complete Blood Count (CBC)', doctor: 'Dr. Miller', type: 'PDF' },
                       { date: 'Jun 02, 2026', name: 'Lipid Panel', doctor: 'Dr. Jane Smith', type: 'PDF' },
                       { date: 'Jan 10, 2026', name: 'HbA1c Test', doctor: 'Dr. Miller', type: 'JPG' }
                     ].map((doc, i) => (
                       <div key={i} className="flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant rounded-lg">
                         <div className="flex items-center space-x-4">
                           <div className="w-10 h-10 bg-[#e2e8f0] rounded-lg flex items-center justify-center text-on-surface-variant shrink-0">
                             <FileText className="w-5 h-5" />
                           </div>
                           <div>
                             <div className="text-[14px] font-bold text-on-surface">{doc.name}</div>
                             <div className="text-[12px] text-on-surface-variant">{doc.date} • Ordered by {doc.doctor}</div>
                           </div>
                         </div>
                         <div className="flex items-center space-x-3">
                           <button className="px-3 py-1.5 bg-white border border-outline-variant text-[#005bb5] text-[13px] font-bold rounded-md hover:bg-surface-container-lowest transition-colors flex items-center">
                             View {doc.type}
                           </button>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               {consultationTab === 'Medical History' && (
                 <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
                   <h3 className="text-[16px] font-bold text-on-surface mb-6">Previous Prescriptions & Reports</h3>
                   
                   <div className="space-y-4">
                     {[
                       { date: 'May 20, 2026', title: 'Consultation Note', diag: 'Mild Hypertension', doctor: 'Dr. Jane Smith' },
                       { date: 'Feb 14, 2026', title: 'Prescription: Metformin', diag: 'Insulin Resistance', doctor: 'Dr. Miller' },
                       { date: 'Nov 05, 2025', title: 'Annual Physical Report', diag: 'Healthy', doctor: 'Dr. Jane Smith' }
                     ].map((history, i) => (
                       <div key={i} className="flex items-start justify-between p-4 border-b border-outline-variant last:border-0">
                         <div>
                           <div className="flex items-center space-x-3 mb-1">
                             <div className="text-[14px] font-bold text-on-surface">{history.title}</div>
                             <span className="px-2 py-0.5 bg-[#f1f5f9] text-on-surface-variant text-[11px] font-medium rounded-md uppercase">{history.date}</span>
                           </div>
                           <div className="text-[13px] text-on-surface-variant mb-2">Diagnosis: {history.diag}</div>
                           <div className="text-[12px] font-medium text-on-surface-variant">Attending: {history.doctor}</div>
                         </div>
                         <button className="px-3 py-1.5 bg-[#eff6ff] text-[#005bb5] text-[13px] font-bold rounded-md hover:bg-[#dbeafe] transition-colors">
                           View Details
                         </button>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
             </div>
          </div>
        </div>
      )}

      {rescheduleModalPatient && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[400px] overflow-hidden">
            <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
              <h3 className="text-[16px] font-bold text-on-surface">Reschedule Appointment</h3>
              <button onClick={() => setRescheduleModalPatient(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-lowest text-on-surface-variant transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-on-surface-variant mb-4">Select new date for <strong>{rescheduleModalPatient}</strong></p>
              
              <div className="border border-outline-variant rounded-lg p-3 bg-white">
                <div className="flex justify-between items-center mb-3 px-2">
                  <span className="font-bold text-[14px] text-on-surface">October 2023</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {['S','M','T','W','T','F','S'].map((d, i) => (
                    <div key={`${d}-${i}`} className="text-[12px] font-bold text-on-surface-variant p-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {[24,25,26,27,28,29,30, 1,2,3,4,5,6,7].map((date, i) => (
                    <button 
                      key={i} 
                      onClick={() => {
                         const newApt = {
                           id: `#PT-${Math.floor(10000 + Math.random() * 90000)}`,
                           name: rescheduleModalPatient,
                           type: 'Rescheduled Consultation',
                           oldDate: 'Today, 09:00 AM',
                           newDate: `Oct ${date}, 2023`,
                           time: '11:30 AM',
                           status: 'approved'
                         };
                         setRescheduledAppts([...rescheduledAppts, newApt]);
                         setRescheduleModalPatient(null);
                      }}
                      className={`h-10 w-10 flex items-center justify-center text-[14px] rounded-full mx-auto hover:bg-[#eff6ff] hover:text-[#005bb5] transition-colors ${date === 3 ? 'bg-[#005bb5] text-white hover:bg-[#005bb5] hover:text-white' : 'text-on-surface'}`}
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

