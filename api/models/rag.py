from pgvector.sqlalchemy import Vector
from sqlalchemy import Column, DateTime, ForeignKey, String, Text, func

from api.db.base import Base


class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(String, primary_key=True, index=True)  # UUID
    document_id = Column(String, ForeignKey("documents.id"))
    chunk_text = Column(Text, nullable=False)
    embedding = Column(Vector(768))


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, index=True)  # UUID
    user_id = Column(String, ForeignKey("users.firebase_uid"))
    role = Column(String, nullable=False)  # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    attachment_urls = Column(Text, nullable=True)  # JSON array of file URLs
    created_at = Column(DateTime(timezone=True), server_default=func.now())
