from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String, func

from api.db.base import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, index=True)  # UUID
    user_id = Column(String, ForeignKey("users.firebase_uid"))
    type = Column(String, nullable=False)  # e.g. "appointment_booked"
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
