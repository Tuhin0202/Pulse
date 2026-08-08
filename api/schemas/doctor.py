from pydantic import BaseModel
from typing import Optional, List

class DoctorProfileCreate(BaseModel):
    fullName: str
    qualification: Optional[str] = None
    specialization: Optional[str] = None
    experience: Optional[str] = None
    clinicName: Optional[str] = None
    city: Optional[str] = None
    contactInfo: Optional[str] = None
    address: Optional[str] = None
    licenseNumber: Optional[str] = None
    licenseFileName: Optional[str] = None
    licenseStatus: Optional[str] = "Not Uploaded"

class DoctorProfileUpdate(BaseModel):
    fullName: Optional[str] = None
    qualification: Optional[str] = None
    specialization: Optional[str] = None
    experience: Optional[str] = None
    clinicName: Optional[str] = None
    city: Optional[str] = None
    contactInfo: Optional[str] = None
    address: Optional[str] = None
    aboutText: Optional[str] = None
    licenseNumber: Optional[str] = None
    licenseFileName: Optional[str] = None
    licenseStatus: Optional[str] = None

class DoctorProfileResponse(BaseModel):
    id: str
    fullName: str
    qualification: Optional[str] = None
    specialization: Optional[str] = None
    experience: Optional[str] = None
    clinicName: Optional[str] = None
    city: Optional[str] = None
    contactInfo: Optional[str] = None
    address: Optional[str] = None
    aboutText: Optional[str] = None
    profilePicUrl: Optional[str] = None
    licenseNumber: Optional[str] = None
    licenseFileUrl: Optional[str] = None
    licenseFileName: Optional[str] = None
    licenseStatus: Optional[str] = "Not Uploaded"

    class Config:
        from_attributes = True

class TodayAppointment(BaseModel):
    id: str
    name: str
    initial: str
    type: str
    time: str

class DoctorDashboardStats(BaseModel):
    patientsSeenToday: int
    patientsSeenYesterdayDiff: int
    pendingRequests: int
    totalActivePatients: int
    todaysAppointments: List[TodayAppointment]

class DoctorPatientListItem(BaseModel):
    name: str
    id: str
    date: str
    time: str
    status: str

class DoctorPatientsResponse(BaseModel):
    pastAppointments: List[DoctorPatientListItem]
    upcomingAppointments: List[DoctorPatientListItem]

class ScheduleAppointment(BaseModel):
    id: str
    patientName: str
    type: str
    time: str
    status: str

class CalendarMonth(BaseModel):
    confirmedDates: List[int]
    pendingDates: List[int]
    rescheduledDates: List[int]

class DoctorScheduleResponse(BaseModel):
    date: str
    appointments: List[ScheduleAppointment]
    calendarMonth: CalendarMonth

class DoctorPublicProfile(BaseModel):
    id: str
    name: str
    category: Optional[str] = None
    city: Optional[str] = None
    rating: Optional[float] = None
    image: Optional[str] = None
    experience: Optional[str] = None

    class Config:
        from_attributes = True

class AvailableSlotsResponse(BaseModel):
    availableDates: List[str]
    timeSlots: List[str]
