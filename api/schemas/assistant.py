from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class AssistantMessageResponse(BaseModel):
    id: str
    sender: str      # "user" | "assistant"
    text: str
    timestamp: str    # e.g. "10:01 AM"

class ChatHistoryItem(BaseModel):
    id: str
    sender: str
    text: str
    attachments: Optional[List[str]] = None
    timestamp: str

    class Config:
        from_attributes = True
