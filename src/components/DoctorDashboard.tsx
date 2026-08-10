import React, { useState, useRef, useEffect } from 'react';
import { Bell, Edit2, MapPin, Search, User, ClipboardList, Users, CheckCircle, Activity, Video, Calendar, FileText, PlusSquare, FileUp, ChevronDown, RotateCcw, Check, X, Printer, TrendingUp, Clock, RefreshCw, Camera, LogOut, Settings, ChevronLeft, ChevronRight, ShieldCheck, FileCheck, UploadCloud, Eye } from 'lucide-react';
import { DoctorData, PatientData } from '../types';
import { PulseLogo } from './PulseLogo';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

interface DoctorDashboardProps {
  doctorData?: DoctorData;
  patientData?: PatientData;
  onUpdatePatientData?: (data: Partial<PatientData>) => void;
}

export function DoctorDashboard({ doctorData, patientData, onUpdatePatientData }: DoctorDashboardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  let activeTab = 'Dashboard';
  if (location.pathname.includes('/doctor/patients')) activeTab = 'Patients';
  else if (location.pathname.includes('/doctor/schedule')) activeTab = 'Schedule';
  else if (location.pathname === '/doctor/profile') activeTab = 'Profile';

  const [consultationPatient, setConsultationPatient] = useState<string | null>(id || null);
  const [consultationTab, setConsultationTab] = useState('Current Consultation');

  useEffect(() => {
    if (id) {
      setConsultationPatient(id);
    } else {
      setConsultationPatient(null);
    }
  }, [id]);

  useEffect(() => {
    // API Placeholder for Dashboard Stats
    if (activeTab === 'Dashboard' && !id) {
      fetch('/api/v1/doctor/dashboard-stats').catch(e => console.error(e));
    }
  }, [activeTab, id]);

  useEffect(() => {
    // API Placeholder for Schedule
    if (activeTab === 'Schedule') {
      const dateStr = new Date().toISOString().split('T')[0];
      fetch(`/api/v1/doctor/schedule?date=${dateStr}`).catch(e => console.error(e));
    }
  }, [activeTab]);
  const [isScheduleDrawerOpen, setIsScheduleDrawerOpen] = useState(true);
  const [scheduleFilter, setScheduleFilter] = useState<'all' | 'rescheduled'>('all');
  const [rescheduleModalPatient, setRescheduleModalPatient] = useState<string | null>(null);
  const [rescheduledAppts, setRescheduledAppts] = useState<any[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isEditingVitals, setIsEditingVitals] = useState(false);
  const [isEditingTiming, setIsEditingTiming] = useState(false);
  const [timings, setTimings] = useState([
    { day: 'Monday', start: '', end: '', isWorking: false },
    { day: 'Tuesday', start: '', end: '', isWorking: false },
    { day: 'Wednesday', start: '', end: '', isWorking: false },
    { day: 'Thursday', start: '', end: '', isWorking: false },
    { day: 'Friday', start: '', end: '', isWorking: false },
    { day: 'Saturday', start: '', end: '', isWorking: false },
    { day: 'Sunday', start: '', end: '', isWorking: false },
  ]);

  const [currentDate, setCurrentDate] = useState(new Date());
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
  const [aboutText, setAboutText] = useState('');
  const [patientVitals, setPatientVitals] = useState({
    name: patientData?.fullName || '',
    age: '',
    gender: '',
    bloodType: patientData?.bloodGroup || '',
    contact: patientData?.phone || '',
    bloodPressure: patientData?.bloodPressure ? patientData.bloodPressure.replace(' mmHg', '') : '',
    heartRate: patientData?.heartRate ? patientData.heartRate.replace(' bpm', '') : '',
    height: patientData?.height ? patientData.height.replace(' cm', '') : '',
    weight: patientData?.weight ? patientData.weight.replace(' kg', '') : '',
    summary: ''
  });

  useEffect(() => {
    if (patientData) {
      setPatientVitals(prev => ({
        ...prev,
        name: patientData.fullName || prev.name,
        bloodType: patientData.bloodGroup || prev.bloodType,
        contact: patientData.phone || prev.contact,
        bloodPressure: patientData.bloodPressure ? patientData.bloodPressure.replace(' mmHg', '') : prev.bloodPressure,
        heartRate: patientData.heartRate ? patientData.heartRate.replace(' bpm', '') : prev.heartRate,
        height: patientData.height ? patientData.height.replace(' cm', '') : prev.height,
        weight: patientData.weight ? patientData.weight.replace(' kg', '') : prev.weight,
      }));
    }
  }, [patientData]);
  const profilePicInputRef = useRef<HTMLInputElement>(null);
  const licenseFileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [licenseData, setLicenseData] = useState({
    number: doctorData?.licenseNumber || '',
    fileName: doctorData?.licenseFileName || '',
    fileUrl: doctorData?.licenseFileUrl || '',
    status: doctorData?.licenseStatus || 'Verified'
  });
  const [uploadDocType, setUploadDocType] = useState<string>('');
  const [uploadFileName, setUploadFileName] = useState<string>('');
  const [uploadedReports, setUploadedReports] = useState<{name: string, date: string, doctor: string, type: string, fileUrl?: string}[]>([]);
  const [uploadedPrescriptions, setUploadedPrescriptions] = useState<{name: string, date: string, doctor: string, fileUrl?: string}[]>([]);
  const [viewingDocument, setViewingDocument] = useState<{
    title: string;
    type: string;
    date: string;
    doctor: string;
    details?: string;
    format?: string;
    fileUrl?: string;
  } | null>(null);

  const handleNavClick = (item: string) => {
    if (item === 'Dashboard') navigate('/doctor/dashboard');
    else if (item === 'Patients') navigate('/doctor/patients');
    else if (item === 'Schedule') navigate('/doctor/schedule');
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
                      navigate('/doctor/profile');
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
                      navigate('/'); 
                    }}
                    className="w-full text-left px-4 py-2 text-[14px] text-red-600 hover:bg-surface-container-lowest flex items-center transition-colors"
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
                      src={profilePic || ''} 
                      alt={doctorData?.fullName || ""} 
                      className="w-[100px] h-[100px] rounded-full object-cover border-[3px] border-white shadow-md group-hover:opacity-75 transition-opacity"
                    />
                    <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-[32px] font-bold text-on-surface leading-tight mb-2">{doctorData?.fullName || ''}</h1>
                    <div className="text-[16px] text-on-surface-variant font-medium mb-3">
                      {doctorData?.qualification || ''} {doctorData?.qualification && doctorData?.specialization ? '- ' : ''}{doctorData?.specialization || ''}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {doctorData?.experience && (
                        <div className="flex items-center px-3 py-1 bg-[#f1f5f9] rounded-full text-[13px] font-medium text-on-surface-variant">
                          {doctorData.experience} Years Experience
                        </div>
                      )}
                      <div className="flex items-center px-3 py-1 bg-[#ecfdf5] border border-[#a7f3d0] rounded-full text-[13px] font-medium text-[#059669]">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                        Verified License {licenseData.number ? `(${licenseData.number})` : ''}
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/doctor/profile/edit')}
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

            {/* Medical License & Verification Card */}
            <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-[#eff6ff] text-[#005bb5] flex items-center justify-center">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-[18px] font-bold text-on-surface">Medical License & Registration</h2>
                    <p className="text-[13px] text-on-surface-variant">Verified credentials and clinical practitioner registration</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] rounded-full text-[12px] font-bold flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                    {licenseData.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Registration / License Number</div>
                    <div className="text-[16px] font-bold font-mono text-on-surface bg-[#f8fafc] px-3 py-2 rounded-md border border-outline-variant inline-block">
                      {licenseData.number}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Issuing Medical Board</div>
                    <div className="text-[14px] text-on-surface font-medium"></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Uploaded License Document</div>
                  <input 
                    type="file" 
                    ref={licenseFileInputRef} 
                    className="hidden" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const url = URL.createObjectURL(file);
                        setLicenseData(prev => ({ ...prev, fileName: file.name, fileUrl: url, status: 'Verified' }));
                      }
                    }}
                  />
                  <div className="p-4 bg-[#f8fafc] border border-outline-variant rounded-xl flex items-center justify-between">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-[#005bb5] text-white flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[14px] font-bold text-on-surface truncate" title={licenseData.fileName}>{licenseData.fileName}</div>
                        <div className="text-[12px] text-[#005bb5] font-medium">Verified Certificate Document</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => licenseFileInputRef.current?.click()}
                      className="ml-3 px-3.5 py-1.5 bg-[#005bb5] text-white text-[13px] font-bold rounded-lg hover:bg-primary/90 transition-colors shrink-0 flex items-center shadow-sm"
                    >
                      <UploadCloud className="w-4 h-4 mr-1.5" /> Re-upload
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
                <h2 className="text-[18px] font-bold text-on-surface mb-6">Clinic Information</h2>
                <div className="space-y-6">
                  <div>
                    <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Clinic Name</div>
                    <div className="text-[15px] text-on-surface">{doctorData?.clinicName || ''}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Location</div>
                    <div className="flex items-start text-[15px] text-on-surface">
                      <MapPin className="w-4 h-4 mr-2 text-[#005bb5] shrink-0 mt-0.5" />
                      {doctorData?.address || ''}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Contact Info</div>
                    <div className="text-[15px] text-on-surface">{doctorData?.contactInfo || ''}</div>
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
                Welcome back, {doctorData?.fullName || ''}
              </h1>
              <p className="text-[15px] text-on-surface-variant">
                Here is your schedule for today.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm mb-8">
              <div className="px-6 py-5 border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest">
                <h2 className="text-[18px] font-bold text-on-surface">Today's Appointments</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant">
                      <th className="px-6 py-4 text-[12px] font-bold text-on-surface-variant uppercase tracking-wider w-1/4">Patient ID</th>
                      <th className="px-6 py-4 text-[12px] font-bold text-on-surface-variant uppercase tracking-wider w-1/4">Name</th>
                      <th className="px-6 py-4 text-[12px] font-bold text-on-surface-variant uppercase tracking-wider w-1/4">Scheduled</th>
                      <th className="px-6 py-4 text-[12px] font-bold text-on-surface-variant uppercase tracking-wider w-1/4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingAppointments.filter(apt => {
                      const today = new Date();
                      const aptDate = new Date(apt.date);
                      return aptDate.toDateString() === today.toDateString();
                    }).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-on-surface-variant text-[14px]">No appointments scheduled for today.</td>
                      </tr>
                    ) : upcomingAppointments.filter(apt => {
                      const today = new Date();
                      const aptDate = new Date(apt.date);
                      return aptDate.toDateString() === today.toDateString();
                    }).map((pt, index) => (
                      <tr 
                        key={index} 
                        onClick={() => navigate(`/doctor/patient/${pt.id}`)}
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
                          <div className="text-[13px] text-on-surface-variant">Today</div>
                          <div className="text-[14px] font-bold text-[#005bb5]">{pt.time}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <button 
                              onClick={(e) => { e.stopPropagation(); navigate(`/doctor/patient/${pt.id}`); }}
                              className="w-[110px] h-[38px] flex items-center justify-center bg-[#005bb5] text-white text-[13px] font-bold rounded-md hover:bg-primary/90 transition-colors"
                            >
                              View
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setRescheduleModalPatient(pt.name); }}
                              className="w-[110px] h-[38px] flex items-center justify-center bg-white border border-outline-variant text-on-surface text-[13px] font-bold rounded-md hover:bg-surface-container-lowest transition-colors"
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
                    <span className="text-[28px] font-bold text-on-surface leading-none">—</span>
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
                    <span className="text-[28px] font-bold text-on-surface leading-none">—</span>
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
                    <span className="text-[28px] font-bold text-on-surface leading-none">—</span>
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

                {upcomingAppointments.filter(apt => {
                  const today = new Date();
                  const aptDate = new Date(apt.date);
                  return aptDate < today;
                }).length === 0 ? (
                  <div className="bg-white rounded-xl border border-outline-variant p-6 text-center text-on-surface-variant text-[14px]">
                    No past appointments.
                  </div>
                ) : upcomingAppointments.filter(apt => {
                  const today = new Date();
                  const aptDate = new Date(apt.date);
                  return aptDate < today;
                }).map((apt, i) => (
                  <div 
                    key={i} 
                    onClick={() => navigate(`/doctor/patient/${apt.id.replace('#', '')}`)}
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
                    onClick={() => navigate(`/doctor/patient/${apt.id.replace('#', '')}`)}
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
                            fetch(`/api/v1/appointments/${encodeURIComponent(apt.id)}/approve`, { method: 'PUT' }).catch(err => console.error(err));
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
                         
                         // Check appointment dots dynamically
                         let isRescheduled = false;
                         let isConfirmed = false;
                         let isPending = false;
                         
                         if (cellDate) {
                           const monthStr = monthNames[currentDate.getMonth()].substring(0, 3);
                           const cellDateStr = `${monthStr} ${cellDate}, ${currentDate.getFullYear()}`;
                           
                           if (rescheduledAppts.some(apt => apt.newDate === cellDateStr)) {
                             isRescheduled = true;
                           }
                           if (upcomingAppointments.some(apt => apt.date === cellDateStr && apt.status === 'Approved')) {
                             isConfirmed = true;
                           }
                           if (upcomingAppointments.some(apt => apt.date === cellDateStr && apt.status === 'Upcoming')) {
                             isPending = true;
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
                       
                       <div className={`rounded-lg p-3 flex justify-between items-center border ${apt.status === 'approved' ? 'bg-[#f8fafc] border-outline-variant' : 'bg-[#fff7ed] border-[#fed7aa]'}`}>
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
                       onClick={() => {
                         if (isEditingVitals) {
                           fetch(`/api/v1/doctor/patient/${id}/vitals`, { method: 'PUT', body: JSON.stringify(patientVitals) }).catch(err => console.error(err));
                           if (onUpdatePatientData) {
                             onUpdatePatientData({
                               bloodPressure: patientVitals.bloodPressure.includes('mmHg') ? patientVitals.bloodPressure : `${patientVitals.bloodPressure} mmHg`,
                               heartRate: patientVitals.heartRate.includes('bpm') ? patientVitals.heartRate : `${patientVitals.heartRate} bpm`,
                               height: patientVitals.height.includes('cm') ? patientVitals.height : `${patientVitals.height} cm`,
                               weight: patientVitals.weight.includes('kg') ? patientVitals.weight : `${patientVitals.weight} kg`,
                             });
                           }
                         }
                         setIsEditingVitals(!isEditingVitals);
                       }}
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
                         <select 
                           value={uploadDocType}
                           onChange={(e) => setUploadDocType(e.target.value)}
                           className="w-full px-3 py-2.5 border border-outline-variant rounded-md text-[14px] focus:outline-none focus:border-[#005bb5] appearance-none bg-transparent font-medium text-on-surface"
                         >
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
                     className={`border-2 border-dashed rounded-xl bg-surface-container-lowest flex flex-col items-center justify-center py-12 px-6 hover:bg-[#f8fafc] transition-colors cursor-pointer ${!uploadDocType ? 'border-red-300 opacity-60' : 'border-outline-variant'}`}
                   >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept={uploadDocType === 'report' ? '.pdf,.jpg,.jpeg,.png' : uploadDocType === 'prescription' ? '.pdf,.jpg,.jpeg,.png' : ''}
                        onChange={() => {
                          if (fileInputRef.current?.files?.length) {
                            setUploadFileName(fileInputRef.current.files[0].name);
                          }
                        }}
                      />
                      <div className="w-12 h-12 bg-[#e2e8f0] rounded-lg flex items-center justify-center text-[#005bb5] mb-4">
                        <FileUp className="w-6 h-6" />
                      </div>
                      {uploadFileName ? (
                        <div className="text-[16px] font-medium text-[#059669] mb-2">
                          Selected: {uploadFileName}
                        </div>
                      ) : (
                        <div className="text-[16px] font-medium text-on-surface mb-2">
                          {!uploadDocType ? 'Please select a document type first' : <>Drag & drop or <span className="text-[#005bb5] font-bold hover:underline">browse</span></>}
                        </div>
                      )}
                      <div className="text-[12px] text-on-surface-variant font-medium">
                        Supported formats: PDF, JPG, JPEG, PNG
                      </div>
                   </div>
                   <button 
                     className={`w-full mt-4 px-4 py-2 text-white text-[14px] font-bold rounded-md transition-colors ${uploadDocType && uploadFileName ? 'bg-[#005bb5] hover:bg-primary/90' : 'bg-gray-300 cursor-not-allowed'}`}
                     disabled={!uploadDocType || !uploadFileName}
                     onClick={() => {
                        if (!uploadDocType || !uploadFileName) return;
                        const today = new Date();
                        const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
                        const ext = uploadFileName.split('.').pop()?.toUpperCase() || 'PDF';
                        
                        let fileUrl = '';
                        if (fileInputRef.current?.files?.[0]) {
                          fileUrl = URL.createObjectURL(fileInputRef.current.files[0]);
                        }
                        
                        fetch(`/api/v1/doctor/patient/${id}/upload-document`, { method: 'POST' }).catch(err => console.error(err));
                        
                        if (uploadDocType === 'report') {
                          setUploadedReports(prev => [...prev, { name: uploadFileName, date: dateStr, doctor: doctorData?.fullName || 'Dr. Jane Smith', type: ext, fileUrl }]);
                        } else if (uploadDocType === 'prescription') {
                          setUploadedPrescriptions(prev => [...prev, { name: uploadFileName, date: dateStr, doctor: doctorData?.fullName || 'Dr. Jane Smith', fileUrl }]);
                        }
                        
                        setUploadDocType('');
                        setUploadFileName('');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                     }}
                   >
                     Submit Document
                   </button>
                 </div>
               )}

               {consultationTab === 'Lab Results' && (
                 <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
                   <h3 className="text-[16px] font-bold text-on-surface mb-6">Past Lab Results</h3>
                   
                   <div className="space-y-4">
                     {[
                       ...uploadedReports
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
                           <button 
                             onClick={() => setViewingDocument({
                               title: doc.name,
                               type: 'Lab / Medical Report',
                               date: doc.date,
                               doctor: doc.doctor,
                               format: doc.type,
                               fileUrl: doc.fileUrl,
                               details: 'Official medical lab report uploaded for patient medical record.'
                             })}
                             className="px-3 py-1.5 bg-white border border-outline-variant text-[#005bb5] text-[13px] font-bold rounded-md hover:bg-surface-container-lowest transition-colors flex items-center"
                           >
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
                       ...uploadedPrescriptions.map(p => ({ date: p.date, title: `Prescription: ${p.name}`, diag: 'Uploaded Document', doctor: p.doctor, fileUrl: p.fileUrl }))
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
                         <button 
                           onClick={() => setViewingDocument({
                             title: history.title,
                             type: 'Prescription / Medical Record',
                             date: history.date,
                             doctor: history.doctor,
                             fileUrl: history.fileUrl,
                             details: `Official medical prescription uploaded for patient clinical history.`
                           })}
                           className="px-3 py-1.5 bg-[#eff6ff] text-[#005bb5] text-[13px] font-bold rounded-md hover:bg-[#dbeafe] transition-colors"
                         >
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
                  <span className="font-bold text-[14px] text-on-surface">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {['S','M','T','W','T','F','S'].map((d, i) => (
                    <div key={`${d}-${i}`} className="text-[12px] font-bold text-on-surface-variant p-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                     const date = i + 1;
                     return (
                        <button 
                          key={i} 
                          onClick={() => {
                             const newApt = {
                               id: `#PT-${Math.floor(10000 + Math.random() * 90000)}`,
                               name: rescheduleModalPatient,
                               type: 'Rescheduled Consultation',
                               oldDate: 'Pending',
                               newDate: `${monthNames[currentDate.getMonth()].substring(0, 3)} ${date}, ${currentDate.getFullYear()}`,
                               time: '11:30 AM',
                               status: 'approved'
                             };
                             
                             setRescheduledAppts([...rescheduledAppts, newApt]);
                             setRescheduleModalPatient(null);
                          }}
                          className={`h-10 w-10 flex items-center justify-center text-[14px] rounded-full mx-auto hover:bg-[#eff6ff] hover:text-[#005bb5] transition-colors text-on-surface`}
                        >
                          {date}
                        </button>
                     );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewingDocument && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[700px] max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-outline-variant flex justify-between items-center bg-[#f8fafc] shrink-0">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#005bb5]" />
                <h3 className="text-[16px] font-bold text-on-surface">Full Uploaded Document View</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 bg-[#e2e8f0] text-on-surface-variant text-[11px] font-bold rounded-full uppercase tracking-wider">Read Only</span>
                <button onClick={() => setViewingDocument(null)} className="text-on-surface-variant hover:text-on-surface p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Document Header & Details */}
              <div className="grid grid-cols-2 gap-4 bg-[#f8fafc] p-4 rounded-xl border border-outline-variant">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Document Name</label>
                  <div className="text-[15px] font-bold text-on-surface mt-0.5">{viewingDocument.title}</div>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Category</label>
                  <div className="text-[15px] font-bold text-[#005bb5] mt-0.5">{viewingDocument.type}</div>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Date Uploaded</label>
                  <div className="text-[13px] font-medium text-on-surface mt-0.5">{viewingDocument.date}</div>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Attending Doctor</label>
                  <div className="text-[13px] font-medium text-on-surface mt-0.5">{viewingDocument.doctor}</div>
                </div>
              </div>

              {/* Full Uploaded Document Preview Area */}
              <div className="border border-outline-variant rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="bg-[#005bb5] text-white px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider flex justify-between items-center">
                  <span>PulseHealth Official Record Preview</span>
                  <span>{viewingDocument.format || 'DOCUMENT'}</span>
                </div>

                {viewingDocument.fileUrl ? (
                  <div className="p-4 bg-[#f1f5f9] flex justify-center items-center min-h-[300px]">
                    {viewingDocument.format?.match(/PNG|JPG|JPEG|IMAGE/i) || viewingDocument.fileUrl.startsWith('blob:') ? (
                      <img 
                        src={viewingDocument.fileUrl} 
                        alt={viewingDocument.title} 
                        className="max-h-[450px] w-full object-contain rounded-lg border border-outline-variant bg-white p-2 shadow-md"
                      />
                    ) : (
                      <iframe 
                        src={viewingDocument.fileUrl} 
                        title={viewingDocument.title} 
                        className="w-full h-[450px] rounded-lg border border-outline-variant bg-white shadow-md"
                      />
                    )}
                  </div>
                ) : (
                  /* Stylized Medical Letterhead Document View */
                  <div className="p-8 bg-white space-y-6 font-sans">
                    <div className="flex justify-between items-start border-b border-outline-variant pb-6">
                      <div>
                        <div className="text-[20px] font-bold text-[#005bb5]">PulseHealth Medical Center</div>
                        <div className="text-[12px] text-on-surface-variant">123 Health Ave, Suite 400 • Clinical Records Division</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[12px] font-bold text-on-surface">Doc ID: #{Math.floor(100000 + Math.random() * 900000)}</div>
                        <div className="text-[11px] text-on-surface-variant">Date: {viewingDocument.date}</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-[#f8fafc] p-3 rounded-lg border border-outline-variant text-[13px]">
                        <span className="font-bold text-on-surface">Document Title:</span>
                        <span className="font-semibold text-[#005bb5]">{viewingDocument.title}</span>
                      </div>

                      <div className="p-4 rounded-lg border border-outline-variant bg-[#fafafa]">
                        <h4 className="text-[13px] font-bold text-on-surface mb-2 uppercase tracking-wider">Clinical Description & Content</h4>
                        <p className="text-[14px] text-on-surface-variant leading-relaxed">
                          {viewingDocument.details || 'This document contains verified patient medical records, lab results, or prescription orders uploaded by the medical practitioner.'}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-outline-variant pt-6 flex justify-between items-end">
                      <div className="text-[11px] text-on-surface-variant">
                        <span className="font-semibold text-on-surface">Status:</span> Verified & Digitally Signed<br />
                        <span className="font-semibold text-on-surface">Security:</span> Encrypted Medical Record
                      </div>
                      <div className="text-center">
                        <div className="text-[14px] font-bold text-[#005bb5] italic underline font-serif">{viewingDocument.doctor}</div>
                        <div className="text-[10px] uppercase font-bold text-on-surface-variant mt-0.5">Authorized Physician Stamp</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-outline-variant flex justify-between items-center bg-[#f8fafc] shrink-0">
              <span className="text-[12px] text-on-surface-variant font-medium">Read-Only Mode • Cannot be edited</span>
              <button 
                onClick={() => setViewingDocument(null)}
                className="px-6 py-2 bg-[#005bb5] text-white text-[14px] font-bold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

