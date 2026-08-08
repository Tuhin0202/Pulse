from pydantic import BaseModel
from typing import Optional, Literal

class DocumentUploadResponse(BaseModel):
    success: bool
    document: Optional[dict] = None  # {id, name, date, type, format, fileUrl}
    extracted_text: Optional[str] = None

class DocumentRecord(BaseModel):
    id: str
    title: str
    type: str          # "Lab Report" | "Prescription"
    date: Optional[str] = None
    doctor: Optional[str] = None
    format: Optional[str] = None    # "PDF", "JPG", "PNG"
    size: Optional[str] = None
    fileUrl: Optional[str] = None

    class Config:
        from_attributes = True

class VitalUpdate(BaseModel):
    bloodPressure: Optional[str] = None
    heartRate: Optional[str] = None
    height: Optional[str] = None
    weight: Optional[str] = None
    summary: Optional[str] = None
