from sqlalchemy import Column, String, DateTime, ForeignKey, func
from api.db.base import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(String, primary_key=True, index=True)  # UUID
    patient_id = Column(String, ForeignKey("patients.id"))
    doctor_id = Column(String, ForeignKey("doctors.id"))
    date = Column(String, nullable=False)       # ISO date string e.g. "2026-08-09"
    time_slot = Column(String, nullable=False)   # e.g. "09:00 AM"
    type = Column(String, default="General Consultation")  # e.g. "General Consultation", "Follow Up", "Routine"
    status = Column(String, default="Upcoming")  # "Upcoming" | "Approved" | "Rescheduled" | "Cancelled" | "Attended"
    original_date = Column(String, nullable=True)   # For rescheduled appointments
    original_time = Column(String, nullable=True)   # For rescheduled appointments
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
