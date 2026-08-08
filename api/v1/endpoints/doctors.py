import uuid
import os
import shutil
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from api.db.session import get_db
from api.models.user import User
from api.models.doctor import Doctor
from api.models.patient import Patient
from api.models.appointment import Appointment
from api.models.document import Document
from api.models.schedule import DoctorSchedule
from api.models.notification import Notification
from api.schemas.doctor import (
    DoctorProfileCreate, DoctorProfileUpdate, DoctorProfileResponse,
    DoctorDashboardStats, TodayAppointment,
    DoctorPatientsResponse, DoctorPatientListItem,
    DoctorScheduleResponse, ScheduleAppointment, CalendarMonth,
)
from api.schemas.document import DocumentUploadResponse, VitalUpdate
from api.schemas.schedule import ScheduleUpdateRequest
from api.core.security import get_current_user
from api.services.ocr import ocr_service

router = APIRouter()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))), "uploads")


def _ensure_upload_dir():
    os.makedirs(UPLOAD_DIR, exist_ok=True)


def _doctor_to_response(doc: Doctor) -> dict:
    """Convert a Doctor ORM object to the camelCase response dict."""
    return {
        "id": doc.id,
        "fullName": doc.full_name,
        "qualification": doc.qualification,
        "specialization": doc.specialization,
        "experience": doc.experience,
        "clinicName": doc.clinic_name,
        "city": doc.city,
        "contactInfo": doc.contact_info,
        "address": doc.address,
        "aboutText": doc.about_text,
        "profilePicUrl": doc.profile_pic_url,
        "licenseNumber": doc.license_number,
        "licenseFileUrl": doc.license_file_url,
        "licenseFileName": doc.license_file_name,
        "licenseStatus": doc.license_status or "Not Uploaded",
    }


# ─── Profile CRUD ──────────────────────────────────────────────

# 15. POST /doctor/profile
@router.post("/profile")
async def create_profile(
    profile: DoctorProfileCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if user.role != "doctor":
        raise HTTPException(status_code=403, detail={"error": "Only doctors can create a doctor profile", "code": "FORBIDDEN"})

    result = await db.execute(select(Doctor).filter(Doctor.firebase_uid == user.firebase_uid))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail={"error": "Doctor profile already exists", "code": "ALREADY_EXISTS"})

    doc = Doctor(
        id=str(uuid.uuid4()),
        firebase_uid=user.firebase_uid,
        full_name=profile.fullName,
        qualification=profile.qualification,
        specialization=profile.specialization,
        experience=profile.experience,
        clinic_name=profile.clinicName,
        city=profile.city,
        contact_info=profile.contactInfo,
        address=profile.address,
        license_number=profile.licenseNumber,
        license_file_name=profile.licenseFileName,
        license_status=profile.licenseStatus or "Not Uploaded",
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    return {"success": True, "doctor": _doctor_to_response(doc)}


# 16. PUT /doctor/profile
@router.put("/profile")
async def update_profile(
    profile: DoctorProfileUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Doctor).filter(Doctor.firebase_uid == user.firebase_uid))
    doc = result.scalars().first()
    if not doc:
        raise HTTPException(status_code=404, detail={"error": "Doctor profile not found", "code": "NOT_FOUND"})

    update_data = profile.model_dump(exclude_unset=True)
    field_map = {
        "fullName": "full_name",
        "qualification": "qualification",
        "specialization": "specialization",
        "experience": "experience",
        "clinicName": "clinic_name",
        "city": "city",
        "contactInfo": "contact_info",
        "address": "address",
        "aboutText": "about_text",
        "licenseNumber": "license_number",
        "licenseFileName": "license_file_name",
        "licenseStatus": "license_status",
    }
    for camel_key, snake_key in field_map.items():
        if camel_key in update_data:
            setattr(doc, snake_key, update_data[camel_key])

    await db.commit()
    await db.refresh(doc)
    return {"success": True, "doctor": _doctor_to_response(doc)}


# 17. GET /doctor/profile
@router.get("/profile")
async def get_profile(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Doctor).filter(Doctor.firebase_uid == user.firebase_uid))
    doc = result.scalars().first()
    if not doc:
        raise HTTPException(status_code=404, detail={"error": "Doctor profile not found", "code": "NOT_FOUND"})
    return _doctor_to_response(doc)


# 18. POST /doctor/profile/upload-photo
@router.post("/profile/upload-photo")
async def upload_photo(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if user.role != "doctor":
        raise HTTPException(status_code=403, detail={"error": "Only doctors can upload photos", "code": "FORBIDDEN"})

    _ensure_upload_dir()
    ext = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
    filename = f"profile_{user.firebase_uid}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_url = f"/uploads/{filename}"

    result = await db.execute(select(Doctor).filter(Doctor.firebase_uid == user.firebase_uid))
    doc = result.scalars().first()
    if doc:
        doc.profile_pic_url = file_url
        await db.commit()

    return {"success": True, "profilePicUrl": file_url}


# 19. POST /doctor/profile/upload-license
@router.post("/profile/upload-license")
async def upload_license(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if user.role != "doctor":
        raise HTTPException(status_code=403, detail={"error": "Only doctors can upload licenses", "code": "FORBIDDEN"})

    # Validate file size (max 10MB)
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail={"error": "File too large. Max 10MB.", "code": "FILE_TOO_LARGE"})
    await file.seek(0)

    _ensure_upload_dir()
    ext = os.path.splitext(file.filename)[1] if file.filename else ".pdf"
    filename = f"license_{user.firebase_uid}_{uuid.uuid4().hex[:8]}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        buffer.write(contents)

    file_url = f"/uploads/{filename}"

    # Run OCR on the license document
    try:
        extracted_text = await ocr_service.extract_prescription_text(filepath)
    except Exception as e:
        print(f"License OCR error (non-blocking): {e}")
        extracted_text = None

    result = await db.execute(select(Doctor).filter(Doctor.firebase_uid == user.firebase_uid))
    doc = result.scalars().first()
    if doc:
        doc.license_file_url = file_url
        doc.license_file_name = file.filename
        doc.license_status = "Pending Verification"
        await db.commit()

    return {
        "success": True,
        "licenseFileUrl": file_url,
        "licenseFileName": file.filename,
        "licenseStatus": "Pending Verification"
    }


# 20. PUT /doctor/schedule
@router.put("/schedule")
async def update_schedule(
    data: ScheduleUpdateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if user.role != "doctor":
        raise HTTPException(status_code=403, detail={"error": "Only doctors can update schedule", "code": "FORBIDDEN"})

    result = await db.execute(select(Doctor).filter(Doctor.firebase_uid == user.firebase_uid))
    doc = result.scalars().first()
    if not doc:
        raise HTTPException(status_code=404, detail={"error": "Doctor profile not found", "code": "NOT_FOUND"})

    # Delete existing schedule entries
    existing = await db.execute(select(DoctorSchedule).filter(DoctorSchedule.doctor_id == doc.id))
    for entry in existing.scalars().all():
        await db.delete(entry)

    # Create new entries
    for timing in data.timings:
        schedule = DoctorSchedule(
            id=str(uuid.uuid4()),
            doctor_id=doc.id,
            day=timing.day,
            start_time=timing.start,
            end_time=timing.end,
            is_working=timing.isWorking,
        )
        db.add(schedule)

    await db.commit()
    return {"success": True}


# ─── Dashboard & Stats ─────────────────────────────────────────

# 21. GET /doctor/dashboard-stats
@router.get("/dashboard-stats")
async def get_dashboard_stats(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if user.role != "doctor":
        raise HTTPException(status_code=403, detail={"error": "Only doctors can view dashboard stats", "code": "FORBIDDEN"})

    result = await db.execute(select(Doctor).filter(Doctor.firebase_uid == user.firebase_uid))
    doc = result.scalars().first()
    if not doc:
        raise HTTPException(status_code=404, detail={"error": "Doctor profile not found", "code": "NOT_FOUND"})

    today = datetime.now().strftime("%Y-%m-%d")

    # Get today's appointments
    appt_result = await db.execute(
        select(Appointment).filter(
            Appointment.doctor_id == doc.id,
            Appointment.date == today
        )
    )
    today_appts = appt_result.scalars().all()

    # Get total active patients (unique patients with non-cancelled appointments)
    all_appts_result = await db.execute(
        select(Appointment).filter(
            Appointment.doctor_id == doc.id,
            Appointment.status != "Cancelled"
        )
    )
    all_appts = all_appts_result.scalars().all()
    unique_patients = set(a.patient_id for a in all_appts)

    # Build today's appointments list with patient names
    todays_list = []
    for appt in today_appts:
        pat_result = await db.execute(select(Patient).filter(Patient.id == appt.patient_id))
        pat = pat_result.scalars().first()
        name = pat.full_name if pat else "Unknown"
        initials = "".join(w[0].upper() for w in name.split()[:2]) if name else "?"
        todays_list.append({
            "id": appt.id,
            "name": name,
            "initial": initials,
            "type": appt.type or "General",
            "time": appt.time_slot,
        })

    # Count pending
    pending_result = await db.execute(
        select(Appointment).filter(
            Appointment.doctor_id == doc.id,
            Appointment.status == "Upcoming"
        )
    )
    pending_count = len(pending_result.scalars().all())

    attended_today = len([a for a in today_appts if a.status == "Attended"])

    return {
        "patientsSeenToday": attended_today,
        "patientsSeenYesterdayDiff": 0,
        "pendingRequests": pending_count,
        "totalActivePatients": len(unique_patients),
        "todaysAppointments": todays_list,
    }


# 22. GET /doctor/schedule?date=YYYY-MM-DD
@router.get("/schedule")
async def get_schedule(
    date: str = Query(None),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if user.role != "doctor":
        raise HTTPException(status_code=403, detail={"error": "Only doctors can view schedule", "code": "FORBIDDEN"})

    result = await db.execute(select(Doctor).filter(Doctor.firebase_uid == user.firebase_uid))
    doc = result.scalars().first()
    if not doc:
        raise HTTPException(status_code=404, detail={"error": "Doctor profile not found", "code": "NOT_FOUND"})

    query_date = date or datetime.now().strftime("%Y-%m-%d")

    # Get appointments for the given date
    appt_result = await db.execute(
        select(Appointment).filter(
            Appointment.doctor_id == doc.id,
            Appointment.date == query_date
        )
    )
    day_appts = appt_result.scalars().all()

    appointments_list = []
    for appt in day_appts:
        pat_result = await db.execute(select(Patient).filter(Patient.id == appt.patient_id))
        pat = pat_result.scalars().first()
        appointments_list.append({
            "id": appt.id,
            "patientName": pat.full_name if pat else "Unknown",
            "type": appt.type or "General",
            "time": appt.time_slot,
            "status": appt.status.lower() if appt.status else "pending",
        })

    # Calendar month data: get all appointments for the month
    try:
        date_obj = datetime.strptime(query_date, "%Y-%m-%d")
        month_prefix = date_obj.strftime("%Y-%m")
    except ValueError:
        month_prefix = datetime.now().strftime("%Y-%m")

    month_appts_result = await db.execute(
        select(Appointment).filter(
            Appointment.doctor_id == doc.id,
            Appointment.date.like(f"{month_prefix}%")
        )
    )
    month_appts = month_appts_result.scalars().all()

    confirmed_dates = []
    pending_dates = []
    rescheduled_dates = []
    for appt in month_appts:
        try:
            day_num = int(appt.date.split("-")[2])
        except (ValueError, IndexError):
            continue
        if appt.status in ("Approved", "Attended"):
            confirmed_dates.append(day_num)
        elif appt.status in ("Upcoming",):
            pending_dates.append(day_num)
        elif appt.status == "Rescheduled":
            rescheduled_dates.append(day_num)

    return {
        "date": query_date,
        "appointments": appointments_list,
        "calendarMonth": {
            "confirmedDates": list(set(confirmed_dates)),
            "pendingDates": list(set(pending_dates)),
            "rescheduledDates": list(set(rescheduled_dates)),
        }
    }


# ─── Patients List ─────────────────────────────────────────────

# 23. GET /doctor/patients
@router.get("/patients")
async def get_patients(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if user.role != "doctor":
        raise HTTPException(status_code=403, detail={"error": "Only doctors can view patients", "code": "FORBIDDEN"})

    result = await db.execute(select(Doctor).filter(Doctor.firebase_uid == user.firebase_uid))
    doc = result.scalars().first()
    if not doc:
        raise HTTPException(status_code=404, detail={"error": "Doctor profile not found", "code": "NOT_FOUND"})

    today = datetime.now().strftime("%Y-%m-%d")

    # Past appointments (date < today or status == Attended)
    all_appts_result = await db.execute(
        select(Appointment).filter(Appointment.doctor_id == doc.id)
    )
    all_appts = all_appts_result.scalars().all()

    past = []
    upcoming = []
    for appt in all_appts:
        pat_result = await db.execute(select(Patient).filter(Patient.id == appt.patient_id))
        pat = pat_result.scalars().first()
        item = {
            "name": pat.full_name if pat else "Unknown",
            "id": f"#PH-{appt.id[:4]}",
            "date": appt.date,
            "time": appt.time_slot,
            "status": appt.status,
        }
        if appt.status in ("Attended", "Cancelled") or (appt.date and appt.date < today):
            past.append(item)
        else:
            upcoming.append(item)

    return {
        "pastAppointments": past,
        "upcomingAppointments": upcoming,
    }


# ─── Patient Consultation ──────────────────────────────────────

# 24. GET /doctor/patient/{patientId}
@router.get("/patient/{patient_id}")
async def get_patient(
    patient_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if user.role != "doctor":
        raise HTTPException(status_code=403, detail={"error": "Only doctors can view patient details", "code": "FORBIDDEN"})

    result = await db.execute(select(Patient).filter(Patient.id == patient_id))
    pat = result.scalars().first()
    if not pat:
        raise HTTPException(status_code=404, detail={"error": "Patient not found", "code": "NOT_FOUND"})

    # Get lab results
    lab_result = await db.execute(
        select(Document).filter(
            Document.patient_id == patient_id,
            Document.document_type == "report"
        )
    )
    lab_results = lab_result.scalars().all()

    # Get medical history
    hist_result = await db.execute(
        select(Document).filter(
            Document.patient_id == patient_id,
            Document.document_type == "prescription"
        )
    )
    medical_history = hist_result.scalars().all()

    return {
        "name": pat.full_name,
        "age": f"{pat.age} Years" if pat.age else None,
        "gender": pat.gender,
        "bloodType": pat.blood_group,
        "contact": pat.phone,
        "bloodPressure": pat.blood_pressure or "N/A",
        "heartRate": pat.heart_rate or "N/A",
        "height": pat.height or "N/A",
        "weight": pat.weight or "N/A",
        "summary": pat.summary,
        "labResults": [
            {"id": d.id, "title": d.title, "date": d.date, "format": d.format}
            for d in lab_results
        ],
        "medicalHistory": [
            {"id": d.id, "title": d.title, "date": d.date, "format": d.format}
            for d in medical_history
        ],
    }


# 25. PUT /doctor/patient/{patientId}/vitals
@router.put("/patient/{patient_id}/vitals")
async def update_vitals(
    patient_id: str,
    data: VitalUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if user.role != "doctor":
        raise HTTPException(status_code=403, detail={"error": "Only doctors can update vitals", "code": "FORBIDDEN"})

    result = await db.execute(select(Patient).filter(Patient.id == patient_id))
    pat = result.scalars().first()
    if not pat:
        raise HTTPException(status_code=404, detail={"error": "Patient not found", "code": "NOT_FOUND"})

    # Update patient vitals directly for syncing
    if data.bloodPressure is not None:
        pat.blood_pressure = data.bloodPressure
    if data.heartRate is not None:
        pat.heart_rate = data.heartRate
    if data.height is not None:
        pat.height = data.height
    if data.weight is not None:
        pat.weight = data.weight
    if data.summary is not None:
        pat.summary = data.summary

    await db.commit()
    return {"success": True}


# 26. POST /doctor/patient/{patientId}/upload-document
@router.post("/patient/{patient_id}/upload-document")
async def upload_document(
    patient_id: str,
    file: UploadFile = File(...),
    documentType: str = Form("report"),
    format: str = Form(None),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if user.role != "doctor":
        raise HTTPException(status_code=403, detail={"error": "Only doctors can upload documents", "code": "FORBIDDEN"})

    _ensure_upload_dir()
    ext = os.path.splitext(file.filename)[1] if file.filename else ""
    doc_id = str(uuid.uuid4())
    filename = f"doc_{doc_id}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    contents = await file.read()
    file_size = len(contents)
    with open(filepath, "wb") as buffer:
        buffer.write(contents)

    file_url = f"/uploads/{filename}"
    file_format = format or ext.replace(".", "").upper() or "PDF"
    size_str = f"{file_size / (1024 * 1024):.1f} MB" if file_size > 1024 * 1024 else f"{file_size / 1024:.0f} KB"

    # Run OCR
    extracted_text = None
    try:
        extracted_text = await ocr_service.extract_prescription_text(filepath)
    except Exception as e:
        print(f"Document OCR error (non-blocking): {e}")

    # Get doctor info
    doc_result = await db.execute(select(Doctor).filter(Doctor.firebase_uid == user.firebase_uid))
    doctor = doc_result.scalars().first()

    now = datetime.now()
    document = Document(
        id=doc_id,
        patient_id=patient_id,
        doctor_id=doctor.id if doctor else user.firebase_uid,
        title=file.filename or "Untitled",
        document_type=documentType,
        format=file_format,
        size=size_str,
        file_url=file_url,
        date=now.strftime("%b %d, %Y"),
        doctor_name=doctor.full_name if doctor else "Unknown",
        extracted_text=extracted_text,
    )
    db.add(document)
    await db.commit()

    return {
        "success": True,
        "document": {
            "id": doc_id,
            "name": file.filename,
            "date": now.strftime("%b %d, %Y"),
            "type": documentType,
            "format": file_format,
            "fileUrl": file_url,
        }
    }


# 27. GET /doctor/patient/{patientId}/lab-results
@router.get("/patient/{patient_id}/lab-results")
async def get_lab_results(
    patient_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if user.role != "doctor":
        raise HTTPException(status_code=403, detail={"error": "Forbidden", "code": "FORBIDDEN"})

    result = await db.execute(
        select(Document).filter(
            Document.patient_id == patient_id,
            Document.document_type == "report"
        )
    )
    docs = result.scalars().all()
    return [
        {
            "id": d.id,
            "title": d.title,
            "date": d.date,
            "format": d.format,
            "size": d.size,
            "fileUrl": d.file_url,
            "doctorName": d.doctor_name,
        }
        for d in docs
    ]


# 28. GET /doctor/patient/{patientId}/medical-history
@router.get("/patient/{patient_id}/medical-history")
async def get_medical_history(
    patient_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if user.role != "doctor":
        raise HTTPException(status_code=403, detail={"error": "Forbidden", "code": "FORBIDDEN"})

    result = await db.execute(
        select(Document).filter(
            Document.patient_id == patient_id,
            Document.document_type == "prescription"
        )
    )
    docs = result.scalars().all()
    return [
        {
            "id": d.id,
            "title": d.title,
            "date": d.date,
            "format": d.format,
            "size": d.size,
            "fileUrl": d.file_url,
            "doctorName": d.doctor_name,
        }
        for d in docs
    ]


# 44. GET /doctor/notifications
@router.get("/notifications")
async def get_notifications(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if user.role != "doctor":
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
