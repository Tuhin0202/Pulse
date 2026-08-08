from sqlalchemy import Column, String, DateTime, ForeignKey, func, Text
from api.db.base import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, index=True)  # UUID
    patient_id = Column(String, ForeignKey("patients.id"))
    doctor_id = Column(String, nullable=True)  # Can be doctor UUID or firebase_uid as fallback
    title = Column(String, nullable=False)
    document_type = Column(String, nullable=False)  # "report" | "prescription"
    format = Column(String, nullable=True)  # "PDF", "JPG", "PNG"
    size = Column(String, nullable=True)     # e.g. "1.2 MB"
    file_url = Column(String, nullable=True)
    date = Column(String, nullable=True)     # Display date e.g. "Aug 01, 2026"
    doctor_name = Column(String, nullable=True)
    extracted_text = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
