from pydantic import BaseModel
from typing import Optional

class AppointmentCreate(BaseModel):
    doctorId: str
    date: str       # ISO date string e.g. "2026-08-09T00:00:00Z"
    timeSlot: str   # e.g. "09:00 AM"

class AppointmentResponse(BaseModel):
    id: str
    patientId: Optional[str] = None
    doctorId: Optional[str] = None
    date: Optional[str] = None
    timeSlot: Optional[str] = None
    type: Optional[str] = None
    status: str

    class Config:
        from_attributes = True

class RescheduleRequest(BaseModel):
    newDate: str
    newTime: str
