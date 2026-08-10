from sqlalchemy import Column, DateTime, Float, ForeignKey, String, func

from api.db.base import Base


class Vital(Base):
    __tablename__ = "vitals"

    id = Column(String, primary_key=True, index=True)  # UUID
    patient_id = Column(String, ForeignKey("patients.id"))
    doctor_id = Column(String, ForeignKey("doctors.id"))
    heart_rate = Column(Float, nullable=True)
    blood_pressure_systolic = Column(Float, nullable=True)
    blood_pressure_diastolic = Column(Float, nullable=True)
    temperature = Column(Float, nullable=True)
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())
