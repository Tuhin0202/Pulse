import React, { useState, useEffect } from 'react';
import { Bell, Search, Star, Filter, Edit2, Calendar, Droplet, ShieldCheck, MapPin, User, ClipboardList, Users, LogOut, Settings, FileText, Image as ImageIcon, Download, Eye, X, Activity, Heart, Ruler, Scale } from 'lucide-react';
import { PatientData } from '../types';
import { ViewDoctorProfile } from './ViewDoctorProfile';
import { BookAppointment } from './BookAppointment';
import { HealthAssistant } from './HealthAssistant';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import { PulseLogo } from './PulseLogo';

interface PatientDashboardProps {
  patientData?: PatientData;
}

export function PatientDashboard({ patientData }: PatientDashboardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, doctorId } = useParams();

  let activeTab = 'Dashboard';
  if (location.pathname.includes('/patient/appointments')) activeTab = 'Appointments';
  else if (location.pathname.includes('/patient/prescriptions')) activeTab = 'Prescriptions';
  else if (location.pathname.includes('/patient/settings')) activeTab = 'Profile';
  else if (location.pathname.includes('/patient/doctor')) activeTab = 'Search';
  else if (location.pathname.includes('/patient/book')) activeTab = 'Book';
  else if (location.pathname.includes('/health-assistant')) activeTab = 'Health Assistant';

  const [subTab, setSubTab] = useState('Personal Details');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems = ['Dashboard', 'Appointments', 'Prescriptions', 'Health Assistant'];

  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [bookingDoctor, setBookingDoctor] = useState<any>(null);
  const [bookings, setBookings] = useState<{[doctorId: number]: { date: string, slot: string }}>({});
  const [viewingRecord, setViewingRecord] = useState<any | null>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);

  const filteredDoctors = doctors.filter(doc => {
    return (
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (cityFilter === '' || doc.city === cityFilter) &&
      (categoryFilter === '' || doc.category === categoryFilter)
    );
  });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const todaysBookings = Object.entries(bookings).filter(([, booking]: [string, any]) => {
    const bookingDate = new Date(booking.date);
    return bookingDate >= todayStart && bookingDate <= todayEnd;
  }).map(([doctorId, booking]: [string, any]) => {
    return {
      doctor: doctors.find(d => d.id === parseInt(doctorId)),
      ...booking
    };
  });

  useEffect(() => {
    fetch('/api/v1/doctors').then(r => r.json()).then(setDoctors).catch(() => {});
    fetch('/api/v1/patient/records').then(r => r.json()).then(setRecords).catch(() => {});
  }, []);

  useEffect(() => {
    if (activeTab === 'Book' && doctorId) {
      const doc = doctors.find(d => d.id === parseInt(doctorId));
      if (doc) setBookingDoctor(doc);
    } else if (activeTab === 'Search' && id) {
      const doc = doctors.find(d => d.id === parseInt(id));
      if (doc) setSelectedDoctor(doc);
    }
  }, [id, doctorId, activeTab, doctors]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="fixed top-0 left-0 right-0 h-[72px] bg-white border-b border-outline-variant z-50 flex items-center justify-between px-6">
        <PulseLogo />
        <nav className="hidden md:flex space-x-8">
          {[
            { label: 'Dashboard', path: '/patient/dashboard', key: 'Dashboard' },
            { label: 'Appointments', path: '/patient/appointments', key: 'Appointments' },
            { label: 'Prescriptions', path: '/patient/prescriptions', key: 'Prescriptions' },
            { label: 'Health Assistant', path: '/health-assistant', key: 'Health Assistant' }
          ].map(item => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`text-[14px] font-medium h-[72px] relative flex items-center ${
                activeTab === item.key ? 'text-[#005bb5]' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {item.label}
              {activeTab === item.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#005bb5]" />
              )}
            </button>
          ))}
        </nav>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-on-surface-variant hover:text-on-surface relative focus:outline-none"
            >
              <Bell className="w-5 h-5" />
              {Object.keys(bookings).length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full"></span>
              )}
            </button>
            
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-outline-variant py-2 z-50 max-h-[400px] overflow-y-auto">
                  <div className="px-4 py-2 border-b border-outline-variant">
                    <h3 className="font-bold text-[16px] text-on-surface">Notifications</h3>
                  </div>
                  {Object.keys(bookings).length === 0 ? (
                    <div className="px-4 py-8 text-center text-on-surface-variant text-[14px]">
                      No new notifications
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {Object.entries(bookings).map(([doctorId, booking]: [string, any]) => {
                        const doctor = doctors.find(d => d.id === parseInt(doctorId));
                        const bookingDate = new Date(booking.date);
                        return (
                          <div key={doctorId} className="px-4 py-3 border-b border-outline-variant hover:bg-[#f8fafc] transition-colors last:border-0">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#eff6ff] text-[#005bb5] flex items-center justify-center shrink-0 mt-0.5">
                                <Calendar className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-[14px] font-bold text-on-surface mb-0.5">Appointment Booked</h4>
                                <p className="text-[13px] text-on-surface-variant leading-snug">
                                  You have an appointment with {doctor?.name} on {bookingDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {booking.slot}.
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="w-10 h-10 rounded-full bg-[#005bb5] text-white flex items-center justify-center font-bold text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005bb5] focus:ring-offset-2"
            >
              {patientData?.fullName ? patientData.fullName.charAt(0).toUpperCase() : '?'}
            </button>
            {isProfileDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileDropdownOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-outline-variant py-1 z-50">
                  <button 
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      navigate('/patient/settings');
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
                      // In a real app, handle logout
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

      <main className="pt-[104px] pb-12 px-6 max-w-5xl mx-auto space-y-6">
        {activeTab === 'Book' && bookingDoctor ? (
          <BookAppointment 
            doctor={bookingDoctor}
            onBack={() => { setBookingDoctor(null); navigate('/patient/appointments'); }}
            onBook={(date, slot) => {
              setBookings(prev => ({
                ...prev,
                [bookingDoctor.id]: { date, slot }
              }));
              navigate('/patient/dashboard');
            }}
            onCancel={() => {
              setBookings(prev => {
                const newB = {...prev};
                delete newB[bookingDoctor.id];
                return newB;
              });
              setBookingDoctor(null);
              navigate('/patient/appointments');
            }}
          />
        ) : selectedDoctor ? (
          <ViewDoctorProfile 
            doctor={selectedDoctor} 
            onBack={() => { setSelectedDoctor(null); navigate('/patient/appointments'); }} 
          />
        ) : activeTab === 'Appointments' || activeTab === 'Search' ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-[24px] font-bold text-on-surface">Book an Appointment</h1>
            </div>

            <div className="bg-white rounded-xl border border-outline-variant p-4 shadow-sm flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-on-surface-variant" />
                </div>
                <input
                  type="text"
                  placeholder="Search doctor by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-md leading-5 bg-white placeholder-on-surface-variant focus:outline-none focus:ring-1 focus:ring-[#005bb5] focus:border-[#005bb5] sm:text-sm"
                />
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-on-surface-variant" />
                  </div>
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="block w-full pl-9 pr-10 py-2 text-base border border-outline-variant focus:outline-none focus:ring-1 focus:ring-[#005bb5] focus:border-[#005bb5] sm:text-sm rounded-md appearance-none"
                  >
                    <option value="">All Cities</option>
                    {Array.from(new Set(doctors.map(d => d.city).filter(Boolean))).map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-4 w-4 text-on-surface-variant" />
                  </div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="block w-full pl-9 pr-10 py-2 text-base border border-outline-variant focus:outline-none focus:ring-1 focus:ring-[#005bb5] focus:border-[#005bb5] sm:text-sm rounded-md appearance-none"
                  >
                    <option value="">All Categories</option>
                    {Array.from(new Set(doctors.map(d => d.category).filter(Boolean))).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map(doctor => (
                  <div key={doctor.id} className="bg-white rounded-xl border border-outline-variant p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex items-start space-x-4 mb-4">
                      <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-full object-cover border border-outline-variant" />
                      <div>
                        <h3 className="text-[16px] font-bold text-on-surface">{doctor.name}</h3>
                        <p className="text-[13px] text-[#005bb5] font-medium">{doctor.category}</p>
                        <div className="flex items-center mt-1 text-[12px] text-on-surface-variant">
                          <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400 mr-1" />
                          <span>{doctor.rating} Rating</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-5 text-[12px] text-on-surface-variant border-y border-outline-variant py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-on-surface">Experience</span>
                        <span>{doctor.experience}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-on-surface">Location</span>
                        <span>{doctor.city}</span>
                      </div>
                    </div>
                    
                    <div className="mt-auto grid grid-cols-2 gap-3">
                      {bookings[doctor.id] ? (
                        <div className="col-span-2 flex flex-col gap-2">
                           <div className="text-[12px] font-medium text-[#059669] bg-[#ecfdf5] p-2 rounded-md border border-[#34d399] flex flex-col">
                              <span>Booked: {new Date(bookings[doctor.id].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {bookings[doctor.id].slot}</span>
                           </div>
                           <button 
                             onClick={() => {
                               const newBookings = { ...bookings };
                               delete newBookings[doctor.id];
                               setBookings(newBookings);
                             }}
                             className="w-full px-3 py-2 border border-red-600 text-red-600 rounded-md text-[13px] font-bold hover:bg-red-50 transition-colors"
                           >
                             Cancel Booking
                           </button>
                        </div>
                      ) : (
                        <>
                          <button 
                            onClick={() => navigate(`/patient/doctor/${doctor.id}`)}
                            className="px-3 py-2 border border-[#005bb5] text-[#005bb5] rounded-md text-[13px] font-bold hover:bg-[#eff6ff] transition-colors"
                          >
                            View Profile
                          </button>
                          <button 
                            onClick={() => navigate(`/patient/book/${doctor.id}`)}
                            className="px-3 py-2 bg-[#005bb5] text-white rounded-md text-[13px] font-bold hover:bg-primary/90 transition-colors"
                          >
                            Book Now
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full bg-white rounded-xl border border-outline-variant p-8 text-center">
                  <p className="text-on-surface-variant">No doctors found matching your criteria.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setCityFilter(''); setCategoryFilter(''); }}
                    className="mt-4 px-4 py-2 bg-[#f1f5f9] text-on-surface rounded-md text-[14px] font-medium hover:bg-[#e2e8f0] transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'Prescriptions' ? (
          <div className="space-y-6">
            <h1 className="text-[24px] font-bold text-on-surface">Prescriptions & Reports</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {records.length === 0 ? (
                <div className="col-span-full bg-white rounded-xl border border-outline-variant p-8 text-center">
                  <p className="text-on-surface-variant">No records found.</p>
                </div>
              ) : records.map((record) => (
                <div key={record.id} className="bg-white rounded-xl border border-outline-variant p-5 flex flex-col h-full shadow-sm hover:border-[#005bb5] transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        record.format === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {record.format === 'PDF' ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="text-[15px] font-bold text-on-surface line-clamp-1" title={record.title}>{record.title}</h3>
                        <p className="text-[12px] text-on-surface-variant font-medium mt-0.5">{record.type}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6 flex-1">
                    <div className="flex items-center text-[13px] text-on-surface-variant">
                      <Calendar className="w-4 h-4 mr-2" />
                      {record.date}
                    </div>
                    <div className="flex items-center text-[13px] text-on-surface-variant">
                      <User className="w-4 h-4 mr-2" />
                      {record.doctor}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant mt-auto">
                    <span className="text-[12px] font-medium text-on-surface-variant uppercase bg-[#f1f5f9] px-2 py-1 rounded">
                      {record.format} • {record.size}
                    </span>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setViewingRecord(record)}
                        className="p-2 text-on-surface-variant hover:text-[#005bb5] hover:bg-[#eff6ff] rounded-md transition-colors" 
                        title="View Document"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-on-surface-variant hover:text-[#059669] hover:bg-[#ecfdf5] rounded-md transition-colors" title="Download Document">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'Health Assistant' ? (
          <div className="space-y-6">
            <h1 className="text-[24px] font-bold text-on-surface">Health Assistant</h1>
            <HealthAssistant patientName={patientData?.fullName} />
          </div>
        ) : activeTab === 'Dashboard' ? (
          <div className="space-y-6">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-[32px] font-bold text-on-surface mb-1">
                  Welcome back, {patientData?.fullName || ''}
                </h1>
                <p className="text-on-surface-variant text-[15px]">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-outline-variant p-6 md:p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-[#eff6ff] text-[#005bb5] flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-[18px] font-bold text-on-surface">Today's Appointments</h2>
                    <p className="text-[13px] text-on-surface-variant">Manage your scheduled consultations for today</p>
                  </div>
                </div>
              </div>

              {todaysBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-12 px-6 bg-[#f8fafc] border border-dashed border-outline-variant rounded-xl">
                  <div className="w-16 h-16 bg-[#eff6ff] text-[#005bb5] rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <h3 className="text-[18px] font-bold text-on-surface mb-2">No Appointments Today</h3>
                  <p className="text-[14px] text-on-surface-variant max-w-[360px] mx-auto mb-6 leading-relaxed">
                    You don't have any appointments scheduled for today. Check your Appointments tab to book a new one.
                  </p>
                  <button 
                    onClick={() => navigate('/patient/appointments')}
                    className="px-6 py-2.5 bg-[#005bb5] text-white text-[14px] font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book an Appointment
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {todaysBookings.map((booking, idx) => (
                    booking.doctor && (
                      <div key={idx} className="flex flex-col md:flex-row items-start md:items-center p-4 border border-outline-variant rounded-xl gap-4">
                        <img src={booking.doctor.image} alt={booking.doctor.name} className="w-16 h-16 rounded-full object-cover border border-outline-variant" />
                        <div className="flex-1">
                          <h3 className="text-[18px] font-bold text-on-surface">{booking.doctor.name}</h3>
                          <p className="text-[14px] text-on-surface-variant">{booking.doctor.category} Specialist • {booking.doctor.city}</p>
                        </div>
                        <div className="bg-[#eff6ff] px-4 py-2 rounded-lg text-right md:text-left w-full md:w-auto">
                          <div className="text-[12px] font-bold text-[#005bb5] uppercase mb-1">Time Slot</div>
                          <div className="text-[16px] font-bold text-[#005bb5]">{booking.slot}</div>
                        </div>
                        <button 
                          onClick={() => navigate(`/patient/doctor/${booking.doctor.id}`)}
                          className="px-4 py-2 border border-[#005bb5] text-[#005bb5] rounded-lg text-[14px] font-bold hover:bg-[#eff6ff] transition-colors w-full md:w-auto mt-2 md:mt-0"
                        >
                          View Profile
                        </button>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'Profile' ? (
          <>
            <div className="bg-white rounded-xl border border-outline-variant p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-[100px] h-[100px] rounded-full bg-surface-container flex items-center justify-center border-[3px] border-white shadow-md text-[36px] font-bold text-on-surface">
                  {patientData?.fullName ? patientData.fullName.charAt(0).toUpperCase() : ''}
                </div>
                <div className="absolute bottom-1 right-1 w-7 h-7 bg-[#059669] rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                  {patientData?.bloodGroup?.replace(/[^A-Za-z+-]/g, '') || ''}
                </div>
              </div>
              <div>
                <h1 className="text-[32px] font-bold text-on-surface leading-tight mb-3">{patientData?.fullName || ''}</h1>
                <div className="flex flex-wrap gap-3">
                  {patientData?.dateOfBirth && (
                    <div className="flex items-center px-3 py-1 bg-[#f1f5f9] rounded-full text-[13px] font-medium text-on-surface-variant">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      {patientData.dateOfBirth}
                    </div>
                  )}
                  {patientData?.bloodGroup && (
                    <div className="flex items-center px-3 py-1 bg-[#eff6ff] rounded-full text-[13px] font-medium text-[#005bb5]">
                      <Droplet className="w-3.5 h-3.5 mr-1.5" />
                      Group {patientData.bloodGroup}
                    </div>
                  )}
                  <div className="flex items-center px-3 py-1 bg-[#ecfdf5] rounded-full text-[13px] font-medium text-[#059669]">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                    Verified Patient
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigate('/patient/profile/edit')}
              className="flex items-center justify-center px-5 py-2 bg-[#005bb5] text-white rounded-md text-[14px] font-bold hover:bg-primary/90 transition-colors shadow-sm self-start md:self-center"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>

        <div className="flex space-x-8 border-b border-outline-variant pt-2">
          {['Personal Details'].map(tab => (
            <button
              key={tab}
              onClick={() => setSubTab(tab)}
              className={`pb-3 text-[14px] font-bold relative ${
                subTab === tab ? 'text-[#005bb5]' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab}
              {subTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#005bb5]" />
              )}
            </button>
          ))}
        </div>

        {subTab === 'Personal Details' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
                <h2 className="text-[18px] font-bold text-on-surface mb-6">Basic Information</h2>
                <div className="grid grid-cols-2 gap-y-6">
                  <div>
                    <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Full Name</div>
                    <div className="text-[15px] text-on-surface">{patientData?.fullName || ''}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Date of Birth</div>
                    <div className="text-[15px] text-on-surface">{patientData?.dateOfBirth || ''}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Blood Group</div>
                    <div className="text-[15px] text-on-surface">{patientData?.bloodGroup || ''}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Gender</div>
                    <div className="text-[15px] text-on-surface">{patientData?.gender || ''}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
                <h2 className="text-[18px] font-bold text-on-surface mb-6">Contact Details</h2>
                <div className="space-y-6">
                  <div>
                    <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Residential Address</div>
                    <div className="flex items-start text-[15px] text-on-surface">
                      <MapPin className="w-4 h-4 mr-2 text-[#005bb5] shrink-0 mt-0.5" />
                      {patientData?.address || ''}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Phone</div>
                      <div className="text-[15px] text-on-surface">{patientData?.phone || ''}</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Email</div>
                      <div className="text-[15px] text-on-surface">{patientData?.email || ''}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Vitals & Body Metrics Section */}
            <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-[#eff6ff] text-[#005bb5] flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-[18px] font-bold text-on-surface">Vitals & Health Metrics</h2>
                    <p className="text-[13px] text-on-surface-variant">Key biometric measurements and health vitals</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-[#eff6ff] border border-[#bfdbfe] rounded-full text-[12px] font-bold text-[#005bb5] flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                  Updated by Doctor
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#fff1f2] border border-rose-100 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] font-bold uppercase tracking-wider text-rose-800">Blood Pressure</span>
                    <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm">
                      <Activity className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-[22px] font-extrabold text-rose-950">{patientData?.bloodPressure || ''}</div>
                    <div className="text-[12px] font-medium text-rose-700 mt-1 flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
                      Optimal Range
                    </div>
                  </div>
                </div>

                <div className="bg-[#fef2f2] border border-red-100 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] font-bold uppercase tracking-wider text-red-800">Heart Rate</span>
                    <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-sm">
                      <Heart className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-[22px] font-extrabold text-red-950">{patientData?.heartRate || ''}</div>
                    <div className="text-[12px] font-medium text-red-700 mt-1 flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
                      Resting Rate
                    </div>
                  </div>
                </div>

                <div className="bg-[#eff6ff] border border-blue-100 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] font-bold uppercase tracking-wider text-blue-800">Height</span>
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                      <Ruler className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-[22px] font-extrabold text-blue-950">{patientData?.height || ''}</div>
                    <div className="text-[12px] font-medium text-blue-700 mt-1">
                      Body Stature
                    </div>
                  </div>
                </div>

                <div className="bg-[#ecfdf5] border border-emerald-100 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] font-bold uppercase tracking-wider text-emerald-800">Weight</span>
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                      <Scale className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-[22px] font-extrabold text-emerald-950">{patientData?.weight || ''}</div>
                    <div className="text-[12px] font-medium text-emerald-700 mt-1">
                      Body Mass Index: 22.9 (Healthy)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
          </>
        ) : null}
      </main>

      {viewingRecord && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[700px] max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-outline-variant flex justify-between items-center bg-[#f8fafc] shrink-0">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#005bb5]" />
                <h3 className="text-[16px] font-bold text-on-surface">Full Document View</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 bg-[#e2e8f0] text-on-surface-variant text-[11px] font-bold rounded-full uppercase tracking-wider">Read Only</span>
                <button onClick={() => setViewingRecord(null)} className="text-on-surface-variant hover:text-on-surface p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-2 gap-4 bg-[#f8fafc] p-4 rounded-xl border border-outline-variant">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Document Title</label>
                  <div className="text-[15px] font-bold text-on-surface mt-0.5">{viewingRecord.title}</div>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Type</label>
                  <div className="text-[15px] font-bold text-[#005bb5] mt-0.5">{viewingRecord.type}</div>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Date</label>
                  <div className="text-[13px] font-medium text-on-surface mt-0.5">{viewingRecord.date}</div>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Attending Physician</label>
                  <div className="text-[13px] font-medium text-on-surface mt-0.5">{viewingRecord.doctor}</div>
                </div>
              </div>

              {/* Full Document View Sheet */}
              <div className="border border-outline-variant rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="bg-[#005bb5] text-white px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider flex justify-between items-center">
                  <span>PulseHealth Medical Records Division</span>
                  <span>{viewingRecord.format || 'PDF'}</span>
                </div>

                {viewingRecord.fileUrl ? (
                  <div className="p-4 bg-[#f1f5f9] flex justify-center items-center min-h-[300px]">
                    {viewingRecord.format?.match(/PNG|JPG|JPEG|IMAGE/i) || viewingRecord.fileUrl.startsWith('blob:') ? (
                      <img 
                        src={viewingRecord.fileUrl} 
                        alt={viewingRecord.title} 
                        className="max-h-[450px] w-full object-contain rounded-lg border border-outline-variant bg-white p-2 shadow-md"
                      />
                    ) : (
                      <iframe 
                        src={viewingRecord.fileUrl} 
                        title={viewingRecord.title} 
                        className="w-full h-[450px] rounded-lg border border-outline-variant bg-white shadow-md"
                      />
                    )}
                  </div>
                ) : (
                  <div className="p-8 bg-white space-y-6 font-sans">
                    <div className="flex justify-between items-start border-b border-outline-variant pb-6">
                      <div>
                        <div className="text-[20px] font-bold text-[#005bb5]">PulseHealth Diagnostic & Clinical Records</div>
                        <div className="text-[12px] text-on-surface-variant">Verified Patient Record Portal</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[12px] font-bold text-on-surface">Record ID: #{Math.floor(100000 + Math.random() * 900000)}</div>
                        <div className="text-[11px] text-on-surface-variant">Issue Date: {viewingRecord.date}</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-[#f8fafc] p-4 rounded-lg border border-outline-variant">
                        <h4 className="text-[13px] font-bold text-on-surface mb-1 uppercase tracking-wider">Document Summary</h4>
                        <p className="text-[14px] text-on-surface-variant leading-relaxed">
                          Official electronic health document ({viewingRecord.title}) issued and verified by {viewingRecord.doctor}. This document is officially archived in the patient health record system.
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-outline-variant pt-6 flex justify-between items-end">
                      <div className="text-[11px] text-on-surface-variant">
                        <span className="font-semibold text-on-surface">Status:</span> Active Medical Record<br />
                        <span className="font-semibold text-on-surface">Format:</span> {viewingRecord.format || 'PDF'} ({viewingRecord.size || '1.2 MB'})
                      </div>
                      <div className="text-center">
                        <div className="text-[14px] font-bold text-[#005bb5] italic underline font-serif">{viewingRecord.doctor}</div>
                        <div className="text-[10px] uppercase font-bold text-on-surface-variant mt-0.5">Verified Signature</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-outline-variant flex justify-between items-center bg-[#f8fafc] shrink-0">
              <span className="text-[12px] text-on-surface-variant font-medium">Read-Only View</span>
              <button 
                onClick={() => setViewingRecord(null)}
                className="px-6 py-2 bg-[#005bb5] text-white text-[14px] font-bold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
