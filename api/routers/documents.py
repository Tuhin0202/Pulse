from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from api.auth import verify_firebase_token
from api.schemas import DocumentUpload
from api.services.ocr import extract_prescription_text
import shutil
import os
import uuid

router = APIRouter(prefix="/api/documents", tags=["Documents"])

@router.post("/upload")
async def upload_document(
    title: str = Form(...),
    document_type: str = Form(...),
    patient_id: str = Form(...),
    doctor_id: str = Form(...),
    file: UploadFile = File(...),
    token: dict = Depends(verify_firebase_token)
):
    if document_type not in ["prescription", "report"]:
        raise HTTPException(status_code=400, detail="Invalid document_type. Must be 'prescription' or 'report'.")

    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    temp_file_path = os.path.join(temp_dir, f"{uuid.uuid4()}_{file.filename}")
    
    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        extracted_text = None
        # Firewall Logic
        if document_type == "prescription":
            extracted_text = extract_prescription_text(temp_file_path)
        
        # Mock DB Insert
        print("--- MOCK DB INSERT ---")
        print(f"Title: {title}")
        print(f"Type: {document_type}")
        print(f"Patient ID: {patient_id}")
        print(f"Doctor ID: {doctor_id}")
        print(f"Extracted Text: {extracted_text}")
        print("----------------------")
        
        return {"status": "success", "message": "Document processed successfully."}
        
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
