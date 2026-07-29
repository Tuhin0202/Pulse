from pydantic import BaseModel
from typing import List, Optional

class Medication(BaseModel):
    name: str
    dosage: str
    frequency: str
    duration: Optional[str] = None
    instructions: Optional[str] = None

class PrescriptionData(BaseModel):
    patient_name: str
    doctor_name: str
    date: str
    medications: List[Medication]

class DoctorProfile(BaseModel):
    full_name: str
    education_qualification: Optional[str] = None
    specialization: Optional[str] = None
    clinic_name: Optional[str] = None
    city: Optional[str] = None
