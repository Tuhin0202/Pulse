from sqlalchemy import Column, DateTime, String, func

from api.db.base import Base


class User(Base):
    __tablename__ = "users"

    firebase_uid = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True)
    phone_number = Column(String, unique=True, index=True, nullable=True)
    role = Column(String, nullable=False, default="patient")  # doctor or patient
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
