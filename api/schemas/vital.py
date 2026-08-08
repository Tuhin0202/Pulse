from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class VitalBase(BaseModel):
    heart_rate: Optional[float] = None
    blood_pressure_systolic: Optional[float] = None
    blood_pressure_diastolic: Optional[float] = None
    temperature: Optional[float] = None

class VitalCreate(VitalBase):
    pass

class VitalResponse(VitalBase):
    id: str
    patient_id: str
    doctor_id: str
    recorded_at: datetime

    class Config:
        from_attributes = True
