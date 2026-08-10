import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from api.core.security import get_current_user
from api.db.session import get_db
from api.models.appointment import Appointment
from api.models.doctor import Doctor
from api.models.notification import Notification
from api.models.patient import Patient
from api.models.user import User
from api.schemas.appointment import AppointmentCreate, RescheduleRequest

router = APIRouter()


# 32. POST /appointments
@router.post("/")
async def create_appointment(
    data: AppointmentCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Find patient profile
    pat_result = await db.execute(
        select(Patient).filter(Patient.firebase_uid == user.firebase_uid)
    )
    pat = pat_result.scalars().first()
    if not pat:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "Patient profile not found. Please complete profile setup.",
                "code": "NOT_FOUND",
            },
        )

    # Parse the date (could be ISO format or plain date string)
    date_str = data.date.split("T")[0] if "T" in data.date else data.date

    # --- Double Booking Prevention ---
    existing_appt_result = await db.execute(
        select(Appointment).filter(
            Appointment.doctor_id == data.doctorId,
            Appointment.date == date_str,
            Appointment.time_slot == data.timeSlot,
            Appointment.status != "Cancelled"
        )
    )
    if existing_appt_result.scalars().first():
        raise HTTPException(
            status_code=409,
            detail={
                "error": "This time slot is already booked for this doctor.",
                "code": "DOUBLE_BOOKING",
            },
        )
    # ---------------------------------

    appt = Appointment(
        id=str(uuid.uuid4()),
        patient_id=pat.id,
        doctor_id=data.doctorId,
        date=date_str,
        time_slot=data.timeSlot,
        type="General Consultation",
        status="Upcoming",
    )
    db.add(appt)

    # Create notification for the patient
    doc_result = await db.execute(select(Doctor).filter(Doctor.id == data.doctorId))
    doc = doc_result.scalars().first()
    doctor_name = doc.full_name if doc else "your doctor"

    notif = Notification(
        id=str(uuid.uuid4()),
        user_id=user.firebase_uid,
        type="appointment_booked",
        title="Appointment Booked",
        message=f"You have an appointment with Dr. {doctor_name} on {date_str} at {data.timeSlot}.",
    )
    db.add(notif)

    # Also notify the doctor
    if doc:
        doc_user_result = await db.execute(
            select(User).filter(User.firebase_uid == doc.firebase_uid)
        )
        doc_notif = Notification(
            id=str(uuid.uuid4()),
            user_id=doc.firebase_uid,
            type="new_appointment",
            title="New Appointment Request",
            message=f"{pat.full_name} booked an appointment for {date_str} at {data.timeSlot}.",
        )
        db.add(doc_notif)

    await db.commit()
    await db.refresh(appt)

    return {
        "success": True,
        "appointment": {
            "id": appt.id,
            "patientId": appt.patient_id,
            "doctorId": appt.doctor_id,
            "date": appt.date,
            "timeSlot": appt.time_slot,
            "type": appt.type,
            "status": appt.status,
        },
    }


# 33. DELETE /appointments/{id}
@router.delete("/{appointment_id}")
async def cancel_appointment(
    appointment_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Appointment).filter(Appointment.id == appointment_id)
    )
    appt = result.scalars().first()
    if not appt:
        raise HTTPException(
            status_code=404,
            detail={"error": "Appointment not found", "code": "NOT_FOUND"},
        )

    appt.status = "Cancelled"
    await db.commit()
    return {"success": True}


# 34. PUT /appointments/{id}/approve
@router.put("/{appointment_id}/approve")
async def approve_appointment(
    appointment_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if user.role != "doctor":
        raise HTTPException(
            status_code=403,
            detail={
                "error": "Only doctors can approve appointments",
                "code": "FORBIDDEN",
            },
        )

    result = await db.execute(
        select(Appointment).filter(Appointment.id == appointment_id)
    )
    appt = result.scalars().first()
    if not appt:
        raise HTTPException(
            status_code=404,
            detail={"error": "Appointment not found", "code": "NOT_FOUND"},
        )

    appt.status = "Approved"
    await db.commit()
    return {"success": True, "status": "Approved"}


# 35. PUT /appointments/{id}/reschedule
@router.put("/{appointment_id}/reschedule")
async def reschedule_appointment(
    appointment_id: str,
    data: RescheduleRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Appointment).filter(Appointment.id == appointment_id)
    )
    appt = result.scalars().first()
    if not appt:
        raise HTTPException(
            status_code=404,
            detail={"error": "Appointment not found", "code": "NOT_FOUND"},
        )

    # Store original date/time
    appt.original_date = appt.date
    appt.original_time = appt.time_slot

    # Update to new date/time
    appt.date = data.newDate
    appt.time_slot = data.newTime
    appt.status = "Rescheduled"

    await db.commit()
    await db.refresh(appt)

    return {
        "success": True,
        "appointment": {
            "id": appt.id,
            "patientId": appt.patient_id,
            "doctorId": appt.doctor_id,
            "date": appt.date,
            "timeSlot": appt.time_slot,
            "type": appt.type,
            "status": appt.status,
        },
    }
