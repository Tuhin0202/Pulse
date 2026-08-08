import uuid
import os
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from api.db.session import get_db
from api.models.user import User
from api.models.patient import Patient
from api.models.appointment import Appointment
from api.models.document import Document
from api.models.doctor import Doctor
from api.models.notification import Notification
from api.core.security import get_current_user

router = APIRouter()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))), "uploads")


def _patient_to_response(pat: Patient) -> dict:
    """Convert a Patient ORM object to the camelCase response dict."""
    return {
        "id": pat.id,
        "fullName": pat.full_name,
        "dateOfBirth": pat.date_of_birth,
        "bloodGroup": pat.blood_group,
        "address": pat.address,
        "phone": pat.phone,
        "email": pat.email,
        "gender": pat.gender,
        "bloodPressure": pat.blood_pressure,
        "heartRate": pat.heart_rate,
        "height": pat.height,
        "weight": pat.weight,
    }


# ─── Profile ───────────────────────────────────────────────────

# 12. POST /patient/profile
@router.post("/profile")
async def create_profile(
    profile: dict,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if user.role != "patient":
        raise HTTPException(status_code=403, detail={"error": "Only patients can create a patient profile", "code": "FORBIDDEN"})

    result = await db.execute(select(Patient).filter(Patient.firebase_uid == user.firebase_uid))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail={"error": "Patient profile already exists", "code": "ALREADY_EXISTS"})

    pat = Patient(
        id=str(uuid.uuid4()),
        firebase_uid=user.firebase_uid,
        full_name=profile.get("fullName", ""),
        date_of_birth=profile.get("dateOfBirth"),
        blood_group=profile.get("bloodGroup"),
        address=profile.get("address"),
        phone=profile.get("phone"),
        email=profile.get("email"),
        gender=profile.get("gender"),
    )
    db.add(pat)
    await db.commit()
    await db.refresh(pat)
    return {"success": True, "patient": _patient_to_response(pat)}


# 13. PUT /patient/profile
@router.put("/profile")
async def update_profile(
    profile: dict,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Patient).filter(Patient.firebase_uid == user.firebase_uid))
    pat = result.scalars().first()
    if not pat:
        raise HTTPException(status_code=404, detail={"error": "Patient profile not found", "code": "NOT_FOUND"})

    field_map = {
        "fullName": "full_name",
        "dateOfBirth": "date_of_birth",
        "bloodGroup": "blood_group",
        "address": "address",
        "phone": "phone",
        "email": "email",
        "gender": "gender",
    }
    for camel_key, snake_key in field_map.items():
        if camel_key in profile:
            setattr(pat, snake_key, profile[camel_key])

    await db.commit()
    await db.refresh(pat)
    return {"success": True, "patient": _patient_to_response(pat)}


# 14. GET /patient/profile
@router.get("/profile")
async def get_profile(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Patient).filter(Patient.firebase_uid == user.firebase_uid))
    pat = result.scalars().first()
    if not pat:
        raise HTTPException(status_code=404, detail={"error": "Patient profile not found", "code": "NOT_FOUND"})
    return _patient_to_response(pat)


# ─── Appointments ──────────────────────────────────────────────

# 36. GET /patient/appointments
@router.get("/appointments")
async def get_appointments(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if user.role != "patient":
        raise HTTPException(status_code=403, detail={"error": "Forbidden", "code": "FORBIDDEN"})

    result = await db.execute(select(Patient).filter(Patient.firebase_uid == user.firebase_uid))
    pat = result.scalars().first()
    if not pat:
        return []

    appt_result = await db.execute(
        select(Appointment).filter(Appointment.patient_id == pat.id).order_by(Appointment.date.desc())
    )
    appts = appt_result.scalars().all()

    appointments = []
    for appt in appts:
        doc_result = await db.execute(select(Doctor).filter(Doctor.id == appt.doctor_id))
        doc = doc_result.scalars().first()
        appointments.append({
            "id": appt.id,
            "doctorId": appt.doctor_id,
            "doctorName": doc.full_name if doc else "Unknown",
            "specialization": doc.specialization if doc else None,
            "date": appt.date,
            "timeSlot": appt.time_slot,
            "type": appt.type,
            "status": appt.status,
        })

    return appointments


# ─── Medical Records ───────────────────────────────────────────

# 37. GET /patient/records
@router.get("/records")
async def get_records(
    type: str = Query(None),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if user.role != "patient":
        raise HTTPException(status_code=403, detail={"error": "Forbidden", "code": "FORBIDDEN"})

    result = await db.execute(select(Patient).filter(Patient.firebase_uid == user.firebase_uid))
    pat = result.scalars().first()
    if not pat:
        return []

    query = select(Document).filter(Document.patient_id == pat.id)
    if type:
        query = query.filter(Document.document_type == type)

    doc_result = await db.execute(query)
    docs = doc_result.scalars().all()

    return [
        {
            "id": d.id,
            "title": d.title,
            "type": "Lab Report" if d.document_type == "report" else "Prescription",
            "date": d.date,
            "doctor": d.doctor_name,
            "format": d.format,
            "size": d.size,
            "fileUrl": d.file_url,
        }
        for d in docs
    ]


# 38. GET /patient/records/{recordId}
@router.get("/records/{record_id}")
async def get_record(
    record_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Document).filter(Document.id == record_id))
    doc = result.scalars().first()
    if not doc:
        raise HTTPException(status_code=404, detail={"error": "Record not found", "code": "NOT_FOUND"})

    return {
        "id": doc.id,
        "title": doc.title,
        "type": "Lab Report" if doc.document_type == "report" else "Prescription",
        "date": doc.date,
        "doctor": doc.doctor_name,
        "format": doc.format,
        "size": doc.size,
        "fileUrl": doc.file_url,
    }


# 39. GET /patient/records/{recordId}/download
@router.get("/records/{record_id}/download")
async def download_record(
    record_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Document).filter(Document.id == record_id))
    doc = result.scalars().first()
    if not doc:
        raise HTTPException(status_code=404, detail={"error": "Record not found", "code": "NOT_FOUND"})

    if not doc.file_url:
        raise HTTPException(status_code=404, detail={"error": "No file associated with this record", "code": "NO_FILE"})

    # Convert URL path to filesystem path
    filename = doc.file_url.replace("/uploads/", "")
    filepath = os.path.join(UPLOAD_DIR, filename)

    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail={"error": "File not found on server", "code": "FILE_NOT_FOUND"})

    return FileResponse(
        path=filepath,
        filename=doc.title or filename,
        media_type="application/octet-stream",
    )


# ─── Notifications ─────────────────────────────────────────────

# 43. GET /patient/notifications
@router.get("/notifications")
async def get_notifications(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if user.role != "patient":
        raise HTTPException(status_code=403, detail={"error": "Forbidden", "code": "FORBIDDEN"})

    result = await db.execute(
        select(Notification).filter(Notification.user_id == user.firebase_uid).order_by(Notification.created_at.desc())
    )
    notifs = result.scalars().all()
    return [
        {
            "id": n.id,
            "type": n.type,
            "title": n.title,
            "message": n.message,
            "read": n.read,
            "createdAt": n.created_at.isoformat() if n.created_at else None,
        }
        for n in notifs
    ]
