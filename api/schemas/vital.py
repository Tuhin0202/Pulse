from datetime import datetime

from pydantic import BaseModel


class VitalBase(BaseModel):
    heart_rate: float | None = None
    blood_pressure_systolic: float | None = None
    blood_pressure_diastolic: float | None = None
    temperature: float | None = None


class VitalCreate(VitalBase):
    pass


class VitalResponse(VitalBase):
    id: str
    patient_id: str
    doctor_id: str
    recorded_at: datetime

    class Config:
        from_attributes = True
