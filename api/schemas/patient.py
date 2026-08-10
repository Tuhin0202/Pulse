from pydantic import BaseModel


class PatientProfileCreate(BaseModel):
    fullName: str
    dateOfBirth: str | None = None
    bloodGroup: str | None = None
    address: str | None = None
    phone: str | None = None
    email: str | None = None
    gender: str | None = None


class PatientProfileUpdate(BaseModel):
    fullName: str | None = None
    dateOfBirth: str | None = None
    bloodGroup: str | None = None
    address: str | None = None
    phone: str | None = None
    email: str | None = None
    gender: str | None = None


class PatientProfileResponse(BaseModel):
    id: str
    fullName: str
    dateOfBirth: str | None = None
    bloodGroup: str | None = None
    address: str | None = None
    phone: str | None = None
    email: str | None = None
    gender: str | None = None
    bloodPressure: str | None = None
    heartRate: str | None = None
    height: str | None = None
    weight: str | None = None

    class Config:
        from_attributes = True
