from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime, func
from api.db.base import Base

class DoctorSchedule(Base):
    __tablename__ = "doctor_schedules"

    id = Column(String, primary_key=True, index=True)  # UUID
    doctor_id = Column(String, ForeignKey("doctors.id"))
    day = Column(String, nullable=False)        # "Monday" through "Sunday"
    start_time = Column(String, nullable=True)   # e.g. "09:00 AM"
    end_time = Column(String, nullable=True)     # e.g. "05:00 PM"
    is_working = Column(Boolean, default=True)
