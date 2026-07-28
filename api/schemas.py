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
