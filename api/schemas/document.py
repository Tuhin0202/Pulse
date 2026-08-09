from pydantic import BaseModel


class DocumentUploadResponse(BaseModel):
    success: bool
    document: dict | None = None  # {id, name, date, type, format, fileUrl}
    extracted_text: str | None = None


class DocumentRecord(BaseModel):
    id: str
    title: str
    type: str  # "Lab Report" | "Prescription"
    date: str | None = None
    doctor: str | None = None
    format: str | None = None  # "PDF", "JPG", "PNG"
    size: str | None = None
    fileUrl: str | None = None

    class Config:
        from_attributes = True


class VitalUpdate(BaseModel):
    bloodPressure: str | None = None
    heartRate: str | None = None
    height: str | None = None
    weight: str | None = None
    summary: str | None = None
