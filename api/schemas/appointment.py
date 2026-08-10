from pydantic import BaseModel


class AppointmentCreate(BaseModel):
    doctorId: str
    date: str  # ISO date string e.g. "2026-08-09T00:00:00Z"
    timeSlot: str  # e.g. "09:00 AM"


class AppointmentResponse(BaseModel):
    id: str
    patientId: str | None = None
    doctorId: str | None = None
    date: str | None = None
    timeSlot: str | None = None
    type: str | None = None
    status: str

    class Config:
        from_attributes = True


class RescheduleRequest(BaseModel):
    newDate: str
    newTime: str
