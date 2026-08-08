import uuid
import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File

from api.models.user import User
from api.core.security import get_current_user

router = APIRouter()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))), "uploads")

ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


def _ensure_upload_dir():
    os.makedirs(UPLOAD_DIR, exist_ok=True)


# 45. POST /upload
@router.post("/")
async def upload_file(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
):
    """General file upload endpoint. Returns a permanent URL for the uploaded file."""
    # Validate extension
    ext = os.path.splitext(file.filename)[1].lower() if file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail={"error": f"File type '{ext}' not allowed. Accepted: PDF, JPG, JPEG, PNG.", "code": "INVALID_FILE_TYPE"}
        )

    # Read and validate size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail={"error": "File too large. Maximum size is 10MB.", "code": "FILE_TOO_LARGE"}
        )

    _ensure_upload_dir()
    filename = f"{uuid.uuid4().hex[:12]}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        buffer.write(contents)

    file_size = len(contents)
    size_str = f"{file_size / (1024 * 1024):.1f} MB" if file_size > 1024 * 1024 else f"{file_size / 1024:.0f} KB"

    return {
        "success": True,
        "fileUrl": f"/uploads/{filename}",
        "fileName": file.filename,
        "fileSize": size_str,
    }
