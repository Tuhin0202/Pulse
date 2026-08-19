import json
import os
import shutil
import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from api.core.security import get_current_user
from api.core.config import supabase_client
from api.db.session import get_db
from api.models.rag import ChatMessage
from api.models.user import User
from api.services.ocr import ocr_service
from api.services.rag_service import rag_service

router = APIRouter()

UPLOAD_DIR = os.path.join(
    os.path.dirname(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    ),
    "uploads",
)


def _ensure_upload_dir():
    os.makedirs(UPLOAD_DIR, exist_ok=True)


def _format_timestamp(dt: datetime = None) -> str:
    """Format datetime to time string like '10:01 AM'."""
    if dt is None:
        dt = datetime.now()
    return dt.strftime("%I:%M %p")


# 40. POST /health-assistant/message
@router.post("/message")
async def send_message(
    text: str = Form(""),
    attachments: list[UploadFile] = File(None),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Patient sends a message with optional file attachments. Returns AI response."""
    now = datetime.now()
    attachment_urls = []

    # Handle file attachments
    if attachments:
        _ensure_upload_dir()
        for attachment in attachments:
            if attachment.filename:  # Skip empty file fields
                contents = await attachment.read()
                if len(contents) > 200 * 1024:
                    from fastapi import HTTPException
                    raise HTTPException(
                        status_code=400,
                        detail={"error": f"File {attachment.filename} is too large. Max 200KB."}
                    )
                await attachment.seek(0)
                
                ext = os.path.splitext(attachment.filename)[1]
                filename = f"chat_{uuid.uuid4().hex[:8]}{ext}"
                filepath = os.path.join(UPLOAD_DIR, filename)
                
                with open(filepath, "wb") as buffer:
                    buffer.write(contents)

                # Try to extract text from attachment for context
                try:
                    extracted = await ocr_service.extract_prescription_text(filepath)
                    if extracted:
                        text = f"{text}\n\n[Extracted from attachment: {extracted}]"
                except Exception as e:
                    print(f"Assistant OCR Error: {e}")
                    
                # Upload to Supabase Storage
                try:
                    supabase_client.storage.from_("uploads").upload(
                        path=filename,
                        file=contents,
                        file_options={"content-type": attachment.content_type}
                    )
                    file_url = supabase_client.storage.from_("uploads").get_public_url(filename)
                    attachment_urls.append(file_url)
                except Exception as e:
                    print(f"Failed to upload to Supabase: {e}")
                    attachment_urls.append(f"/uploads/{filename}")
                    
                # Clean up local file
                try:
                    os.remove(filepath)
                except OSError:
                    pass

    # Save user message
    user_msg = ChatMessage(
        id=str(uuid.uuid4()),
        user_id=user.firebase_uid,
        role="user",
        content=text,
        attachment_urls=json.dumps(attachment_urls) if attachment_urls else None,
    )
    db.add(user_msg)

    # Fetch patient UUID
    from api.models.patient import Patient
    pat_result = await db.execute(select(Patient).filter(Patient.firebase_uid == user.firebase_uid))
    patient = pat_result.scalars().first()
    pat_id = patient.id if patient else "UNREGISTERED_PATIENT"

    # Use RAG pipeline to generate response
    context = await rag_service.retrieve_context(text, db=db, patient_id=pat_id)
    answer = await rag_service.generate_chat_response(text, context)

    # Save assistant message
    assistant_msg_id = str(uuid.uuid4())
    assistant_msg = ChatMessage(
        id=assistant_msg_id,
        user_id=user.firebase_uid,
        role="assistant",
        content=answer,
    )
    db.add(assistant_msg)
    await db.commit()

    return {
        "id": assistant_msg_id,
        "sender": "assistant",
        "text": answer,
        "timestamp": _format_timestamp(now),
    }


# 41. GET /health-assistant/history
@router.get("/history")
async def get_history(
    user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    """Loads chat history for the current patient."""
    result = await db.execute(
        select(ChatMessage)
        .filter(ChatMessage.user_id == user.firebase_uid)
        .order_by(ChatMessage.created_at)
    )
    messages = result.scalars().all()

    return [
        {
            "id": msg.id,
            "sender": msg.role,
            "text": msg.content,
            "attachments": json.loads(msg.attachment_urls)
            if msg.attachment_urls
            else None,
            "timestamp": _format_timestamp(msg.created_at) if msg.created_at else "",
        }
        for msg in messages
    ]


# 42. DELETE /health-assistant/history
@router.delete("/history")
async def clear_history(
    user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    """Clears the entire chat history for the patient."""
    result = await db.execute(
        select(ChatMessage).filter(ChatMessage.user_id == user.firebase_uid)
    )
    messages = result.scalars().all()
    for msg in messages:
        await db.delete(msg)
    await db.commit()
    return {"success": True}
