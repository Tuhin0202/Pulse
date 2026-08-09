from sqlalchemy import Column, DateTime, ForeignKey, String, Text, func

from api.db.base import Base


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(String, primary_key=True, index=True)  # UUID
    firebase_uid = Column(String, ForeignKey("users.firebase_uid"), unique=True)
    full_name = Column(String, nullable=False)
    qualification = Column(String, nullable=True)
    specialization = Column(String, nullable=True)
    experience = Column(String, nullable=True)
    clinic_name = Column(String, nullable=True)
    city = Column(String, nullable=True)
    contact_info = Column(String, nullable=True)
    address = Column(String, nullable=True)
    about_text = Column(Text, nullable=True)
    profile_pic_url = Column(String, nullable=True)
    license_number = Column(String, nullable=True)
    license_file_url = Column(String, nullable=True)
    license_file_name = Column(String, nullable=True)
    license_status = Column(
        String, default="Not Uploaded"
    )  # "Verified" | "Pending Verification" | "Not Uploaded"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
