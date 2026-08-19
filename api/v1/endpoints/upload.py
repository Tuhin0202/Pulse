import os
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from api.core.security import get_current_user
from api.core.config import supabase_client
from api.models.user import User

router = APIRouter()

UPLOAD_DIR = os.path.join(
    os.path.dirname(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    ),
    "uploads",
)

ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}
MAX_FILE_SIZE = 200 * 1024  # 200KB


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
            detail={
                "error": f"File type '{ext}' not allowed. Accepted: PDF, JPG, JPEG, PNG.",
                "code": "INVALID_FILE_TYPE",
            },
        )

    # Read and validate size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "File too large. Maximum size is 200KB.",
                "code": "FILE_TOO_LARGE",
            },
        )

    filename = f"{uuid.uuid4().hex[:12]}{ext}"

    try:
        supabase_client.storage.from_("uploads").upload(
            path=filename,
            file=contents,
            file_options={"content-type": file.content_type}
        )
        file_url = supabase_client.storage.from_("uploads").get_public_url(filename)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Storage upload failed: {str(e)}")

    file_size = len(contents)
    size_str = (
        f"{file_size / (1024 * 1024):.1f} MB"
        if file_size > 1024 * 1024
        else f"{file_size / 1024:.0f} KB"
    )

    return {
        "success": True,
        "fileUrl": file_url,
        "fileName": file.filename,
        "fileSize": size_str,
    }
