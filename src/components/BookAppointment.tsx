import { useState } from 'react';
import { CalendarIcon, CheckCircle2, ArrowLeft } from 'lucide-react';

interface Doctor {
  id: number;
  name: string;
  category: string;
  city: string;
  rating: number;
  image: string;
  experience: string;
}

interface BookAppointmentProps {
  doctor: Doctor;
  onBack: () => void;
  onBook: (date: string, slot: string) => void;
  onCancel: () => void;
}

export function BookAppointment({ doctor, onBack, onBook, onCancel }: BookAppointmentProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [isBooked, setIsBooked] = useState(false);

  // Generate some upcoming dates
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i <= 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip Sundays (0)
      if (date.getDay() === 0) continue;
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();
  const timeSlots = ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '04:30 PM'];

  const handleBooking = () => {
    if (selectedDate && selectedSlot) {
      setIsBooked(true);
      onBook(selectedDate, selectedSlot);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6 animate-in fade-in duration-300">
      <button 
        onClick={onBack} 
        className="flex items-center text-[#005bb5] font-bold text-[14px] hover:underline mb-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Doctors
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-outline-variant p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
         <img src={doctor.image} alt={doctor.name} className="w-24 h-24 rounded-full object-cover border border-outline-variant shadow-sm" />
         <div>
           <h2 className="text-[24px] font-bold text-on-surface mb-1">{doctor.name}</h2>
           <p className="text-[15px] text-on-surface-variant font-medium">{doctor.category} Specialist • {doctor.experience} Experience</p>
           <p className="text-[14px] text-on-surface-variant mt-1">{doctor.city}</p>
         </div>
      </div>

      {!isBooked ? (
        <div className="bg-white rounded-xl shadow-sm border border-outline-variant p-8">
          <h2 className="text-[20px] font-bold text-on-surface mb-8 flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-[#005bb5]" />
            Select Date & Time
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-[15px] font-bold text-on-surface mb-4">Upcoming Available Dates</h3>
              <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                {dates.map((date, i) => {
                  const isSelected = selectedDate === date.toISOString();
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(date.toISOString())}
                      className={`flex flex-col items-center justify-center p-4 min-w-[100px] rounded-xl border transition-all ${
                        isSelected 
                          ? 'bg-[#005bb5] border-[#005bb5] text-white shadow-md transform scale-[1.02]' 
                          : 'bg-white border-outline-variant text-on-surface hover:border-[#005bb5] hover:bg-[#eff6ff]'
                      }`}
                    >
                      <span className="text-[12px] font-medium mb-1 uppercase tracking-wider">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span className={`text-[24px] font-bold mb-1 ${isSelected ? 'text-white' : 'text-on-surface'}`}>
                        {date.getDate()}
                      </span>
                      <span className="text-[12px]">
                        {date.toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedDate && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <h3 className="text-[15px] font-bold text-on-surface mb-4">Available Time Slots</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {timeSlots.map((slot, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-3 px-3 rounded-lg text-[14px] font-medium border transition-all ${
                        selectedSlot === slot
                          ? 'bg-[#005bb5] border-[#005bb5] text-white shadow-md'
                          : 'bg-white border-outline-variant text-on-surface hover:border-[#005bb5] hover:text-[#005bb5]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {selectedDate && selectedSlot && (
            <div className="mt-10 flex justify-end animate-in fade-in duration-300">
              <button 
                onClick={handleBooking}
                className="px-8 py-3 bg-[#059669] text-white rounded-lg text-[15px] font-bold hover:bg-[#047857] transition-colors shadow-sm flex items-center"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Confirm Booking
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#ecfdf5] rounded-xl border border-[#34d399] p-10 mt-6 text-center animate-in zoom-in duration-300 shadow-sm">
          <div className="w-20 h-20 bg-[#059669] rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-[28px] font-bold text-[#065f46] mb-3">Appointment Confirmed!</h2>
          <p className="text-[16px] text-[#064e3b] mb-8 max-w-md mx-auto">
            Your appointment with {doctor.name} is scheduled for{' '}
            <span className="font-bold">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span> at{' '}
            <span className="font-bold">{selectedSlot}</span>.
          </p>
          <button 
            onClick={onCancel}
            className="px-8 py-3 border border-red-600 text-red-600 rounded-lg text-[15px] font-bold hover:bg-red-50 transition-colors shadow-sm"
          >
            Cancel Booking
          </button>
        </div>
      )}
    </div>
  );
}
