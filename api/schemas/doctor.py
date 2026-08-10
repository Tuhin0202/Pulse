from pydantic import BaseModel


class DoctorProfileCreate(BaseModel):
    fullName: str
    qualification: str | None = None
    specialization: str | None = None
    experience: str | None = None
    clinicName: str | None = None
    city: str | None = None
    contactInfo: str | None = None
    address: str | None = None
    licenseNumber: str | None = None
    licenseFileName: str | None = None
    licenseStatus: str | None = "Not Uploaded"


class DoctorProfileUpdate(BaseModel):
    fullName: str | None = None
    qualification: str | None = None
    specialization: str | None = None
    experience: str | None = None
    clinicName: str | None = None
    city: str | None = None
    contactInfo: str | None = None
    address: str | None = None
    aboutText: str | None = None
    licenseNumber: str | None = None
    licenseFileName: str | None = None
    licenseStatus: str | None = None


class DoctorProfileResponse(BaseModel):
    id: str
    fullName: str
    qualification: str | None = None
    specialization: str | None = None
    experience: str | None = None
    clinicName: str | None = None
    city: str | None = None
    contactInfo: str | None = None
    address: str | None = None
    aboutText: str | None = None
    profilePicUrl: str | None = None
    licenseNumber: str | None = None
    licenseFileUrl: str | None = None
    licenseFileName: str | None = None
    licenseStatus: str | None = "Not Uploaded"

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
    todaysAppointments: list[TodayAppointment]


class DoctorPatientListItem(BaseModel):
    name: str
    id: str
    date: str
    time: str
    status: str


class DoctorPatientsResponse(BaseModel):
    pastAppointments: list[DoctorPatientListItem]
    upcomingAppointments: list[DoctorPatientListItem]


class ScheduleAppointment(BaseModel):
    id: str
    patientName: str
    type: str
    time: str
    status: str


class CalendarMonth(BaseModel):
    confirmedDates: list[int]
    pendingDates: list[int]
    rescheduledDates: list[int]


class DoctorScheduleResponse(BaseModel):
    date: str
    appointments: list[ScheduleAppointment]
    calendarMonth: CalendarMonth


class DoctorPublicProfile(BaseModel):
    id: str
    name: str
    category: str | None = None
    city: str | None = None
    rating: float | None = None
    image: str | None = None
    experience: str | None = None

    class Config:
        from_attributes = True


class AvailableSlotsResponse(BaseModel):
    availableDates: list[str]
    timeSlots: list[str]
