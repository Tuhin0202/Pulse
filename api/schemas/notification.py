from pydantic import BaseModel
from typing import Optional

class NotificationResponse(BaseModel):
    id: str
    type: str
    title: str
    message: str
    read: bool
    createdAt: Optional[str] = None

    class Config:
        from_attributes = True
