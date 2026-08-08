from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, func
from api.db.base import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(String, primary_key=True, index=True)  # UUID
    firebase_uid = Column(String, ForeignKey("users.firebase_uid"), unique=True)
    full_name = Column(String, nullable=False)
    date_of_birth = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    blood_group = Column(String, nullable=True)
    address = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    # Vitals (updated by doctors, visible to patient)
    blood_pressure = Column(String, nullable=True)  # e.g. "120/80 mmHg"
    heart_rate = Column(String, nullable=True)       # e.g. "72 bpm"
    height = Column(String, nullable=True)           # e.g. "175 cm"
    weight = Column(String, nullable=True)           # e.g. "70 kg"
    summary = Column(String, nullable=True)          # Doctor's summary notes
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
