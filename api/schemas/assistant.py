from pydantic import BaseModel


class AssistantMessageResponse(BaseModel):
    id: str
    sender: str  # "user" | "assistant"
    text: str
    timestamp: str  # e.g. "10:01 AM"


class ChatHistoryItem(BaseModel):
    id: str
    sender: str
    text: str
    attachments: list[str] | None = None
    timestamp: str

    class Config:
        from_attributes = True
