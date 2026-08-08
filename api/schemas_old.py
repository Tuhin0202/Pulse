# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from typing import List, Optional, Literal

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

class PatientProfile(BaseModel):
    firebase_uid: str
    full_name: str
    age: Optional[int] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None

class DoctorProfile(BaseModel):
    firebase_uid: str
    full_name: str
    education_qualification: Optional[str] = None
    specialization: Optional[str] = None
    clinic_name: Optional[str] = None
    city: Optional[str] = None

class DocumentUpload(BaseModel):
    title: str
    document_type: Literal['prescription', 'report']
    patient_id: str
    doctor_id: str
