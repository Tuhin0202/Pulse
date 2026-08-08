from pydantic import BaseModel
from typing import Optional

class PatientProfileCreate(BaseModel):
    fullName: str
    dateOfBirth: Optional[str] = None
    bloodGroup: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    gender: Optional[str] = None

class PatientProfileUpdate(BaseModel):
    fullName: Optional[str] = None
    dateOfBirth: Optional[str] = None
    bloodGroup: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    gender: Optional[str] = None

class PatientProfileResponse(BaseModel):
    id: str
    fullName: str
    dateOfBirth: Optional[str] = None
    bloodGroup: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    gender: Optional[str] = None
    bloodPressure: Optional[str] = None
    heartRate: Optional[str] = None
    height: Optional[str] = None
    weight: Optional[str] = None

    class Config:
        from_attributes = True
