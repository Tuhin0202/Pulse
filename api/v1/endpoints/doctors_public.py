from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from api.db.session import get_db
from api.models.appointment import Appointment
from api.models.doctor import Doctor
from api.models.schedule import DoctorSchedule

router = APIRouter()


# 29. GET /doctors
@router.get("/")
async def search_doctors(
    search: str = Query(None),
    city: str = Query(None),
    category: str = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """Public endpoint: search doctors by name, city, or specialty."""
    query = select(Doctor)

    if search:
        query = query.filter(Doctor.full_name.ilike(f"%{search}%"))
    if city:
        query = query.filter(Doctor.city.ilike(f"%{city}%"))
    if category:
        query = query.filter(Doctor.specialization.ilike(f"%{category}%"))

    result = await db.execute(query)
    doctors = result.scalars().all()

    return [
        {
            "id": doc.id,
            "name": doc.full_name,
            "category": doc.specialization,
            "city": doc.city,
            "rating": 4.5,  # Placeholder until ratings system is built
            "image": doc.profile_pic_url,
            "experience": f"{doc.experience} years" if doc.experience else None,
        }
        for doc in doctors
    ]


# 30. GET /doctors/{doctorId}
@router.get("/{doctor_id}")
async def get_doctor(doctor_id: str, db: AsyncSession = Depends(get_db)):
    """Public endpoint: get a single doctor's full profile."""
    result = await db.execute(select(Doctor).filter(Doctor.id == doctor_id))
    doc = result.scalars().first()
    if not doc:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=404, detail={"error": "Doctor not found", "code": "NOT_FOUND"}
        )

    # Get schedule
    schedule_result = await db.execute(
        select(DoctorSchedule).filter(DoctorSchedule.doctor_id == doc.id)
    )
    schedules = schedule_result.scalars().all()

    return {
        "id": doc.id,
        "name": doc.full_name,
        "qualification": doc.qualification,
        "specialization": doc.specialization,
        "experience": doc.experience,
        "clinicName": doc.clinic_name,
        "city": doc.city,
        "contactInfo": doc.contact_info,
        "address": doc.address,
        "aboutText": doc.about_text,
        "profilePicUrl": doc.profile_pic_url,
        "rating": 4.5,
        "workingHours": [
            {
                "day": s.day,
                "start": s.start_time,
                "end": s.end_time,
                "isWorking": s.is_working,
            }
            for s in schedules
        ],
    }


# 31. GET /doctors/{doctorId}/available-slots?date=YYYY-MM-DD
@router.get("/{doctor_id}/available-slots")
async def get_available_slots(
    doctor_id: str, date: str = Query(None), db: AsyncSession = Depends(get_db)
):
    """Returns available dates and time slots for a doctor."""
    # Get the doctor's schedule
    schedule_result = await db.execute(
        select(DoctorSchedule).filter(
            DoctorSchedule.doctor_id == doctor_id, DoctorSchedule.is_working == True
        )
    )
    working_schedules = schedule_result.scalars().all()
    working_days = {s.day for s in working_schedules}

    # Generate available dates (next 30 days, excluding non-working days)
    available_dates = []
    base_date = datetime.now()
    day_map = {
        0: "Monday",
        1: "Tuesday",
        2: "Wednesday",
        3: "Thursday",
        4: "Friday",
        5: "Saturday",
        6: "Sunday",
    }

    for i in range(1, 31):
        d = base_date + timedelta(days=i)
        day_name = day_map[d.weekday()]
        if day_name in working_days:
            available_dates.append(d.strftime("%Y-%m-%dT00:00:00Z"))

    # Generate time slots (hardcoded for now, could be derived from schedule)
    all_time_slots = [
        "09:00 AM",
        "09:30 AM",
        "10:00 AM",
        "10:30 AM",
        "11:00 AM",
        "11:30 AM",
        "02:00 PM",
        "02:30 PM",
        "03:00 PM",
        "03:30 PM",
        "04:00 PM",
        "04:30 PM",
    ]

    booked_slots = set()
    # If a specific date is provided, find already-booked slots
    if date:
        booked_result = await db.execute(
            select(Appointment).filter(
                Appointment.doctor_id == doctor_id,
                Appointment.date == date.split("T")[0],
                Appointment.status != "Cancelled",
            )
        )
        booked = booked_result.scalars().all()
        booked_slots = {a.time_slot for a in booked}
        
    time_slots = [
        {"time": s, "available": s not in booked_slots}
        for s in all_time_slots
    ]

    return {
        "availableDates": available_dates,
        "timeSlots": time_slots,
    }
