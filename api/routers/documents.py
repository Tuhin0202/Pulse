from fastapi import APIRouter, Depends, UploadFile, File, Form
from api.auth import verify_firebase_token
from api.schemas import DocumentUpload
from api.services.ocr import extract_prescription_text
import shutil
import os

router = APIRouter(
    prefix="/api/documents",
    tags=["documents"],
    dependencies=[Depends(verify_firebase_token)]
)

@router.post("/upload")
async def upload_document(
    title: str = Form(...),
    document_type: str = Form(...),
    patient_id: str = Form(...),
    doctor_id: str = Form(...),
    file: UploadFile = File(...)
):
    # Validate with schema
    doc_data = DocumentUpload(
        title=title,
        document_type=document_type,
        patient_id=patient_id,
        doctor_id=doctor_id
    )
    
    # Save file temporarily for OCR
    temp_file_path = f"temp_{file.filename}"
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    extracted_text = None
    if doc_data.document_type == "prescription":
        extracted_text = extract_prescription_text(temp_file_path)
    else:
        # Firewall Logic: If it is 'report', skip the OCR block entirely and leave the text variable as None
        pass
        
    # Clean up temp file
    if os.path.exists(temp_file_path):
        os.remove(temp_file_path)
        
    # Mock the Supabase database insert
    print(f"Mock DB Insert: Title={doc_data.title}, Type={doc_data.document_type}, ExtractedText={extracted_text}")
    
    return {"status": "success", "message": "Document uploaded successfully", "extracted_text": extracted_text}
