from pydantic import BaseModel


class NotificationResponse(BaseModel):
    id: str
    type: str
    title: str
    message: str
    read: bool
    createdAt: str | None = None

    class Config:
        from_attributes = True
