from sqlalchemy import Column, String, DateTime, ForeignKey, func, Text
from api.db.base import Base

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(String, primary_key=True, index=True)  # UUID
    document_id = Column(String, ForeignKey("documents.id"))
    chunk_text = Column(Text, nullable=False)
    # Mocking pgvector for SQLite. We store embeddings as JSON strings or omit.
    # In Supabase/pgvector, this would be: embedding = Column(Vector(768))
    embedding_mock = Column(Text, nullable=True)

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, index=True)  # UUID
    user_id = Column(String, ForeignKey("users.firebase_uid"))
    role = Column(String, nullable=False)  # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    attachment_urls = Column(Text, nullable=True)  # JSON array of file URLs
    created_at = Column(DateTime(timezone=True), server_default=func.now())
