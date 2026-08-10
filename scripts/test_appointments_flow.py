import os
import sys
# pyrefly: ignore [missing-import]
import asyncio
from fastapi import Request
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Ensure the root project directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api.main import app
from api.db.base import Base
from api.db.session import get_db
from api.core.security import verify_firebase_token

# Setup in-memory async SQLite database
SQLALCHEMY_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine, class_=AsyncSession
)

async def override_get_db():
    async with TestingSessionLocal() as session:
        yield session

def override_verify_firebase_token(request: Request):
    """
    Dynamic Firebase override that reads a custom header to simulate two different users.
    """
    role = request.headers.get("x-test-role")
    if role == "doctor":
        return {
            "uid": "doc_123",
            "email": "doctor@pulsehealth.com",
            "phone_number": "+1111111111"
        }
    else:
        return {
            "uid": "pat_456",
            "email": "patient@pulsehealth.com",
            "phone_number": "+2222222222"
        }

app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[verify_firebase_token] = override_verify_firebase_token

client = TestClient(app)

async def setup_db():
    print("Setting up database...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def teardown_db():
    print("Tearing down database...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

def run_tests():
    print("---------------------------------------------------------")
    print("STEP 1: Setup Doctor and Patient Profiles")
    print("---------------------------------------------------------")
    doc_headers = {"x-test-role": "doctor"}
    pat_headers = {"x-test-role": "patient"}

    # Setup Doctor
    client.post("/api/v1/auth/login", json={"role": "doctor"}, headers=doc_headers)
    client.post("/api/v1/doctor/profile", json={
        "fullName": "Dr. Smith",
        "qualification": "MD",
        "specialization": "Neurology"
    }, headers=doc_headers)
    
    doc_profile = client.get("/api/v1/doctor/profile", headers=doc_headers).json()
    doctor_id = doc_profile["id"]
    print("Doctor Profile Created successfully.")

    # Setup Patient
    client.post("/api/v1/auth/login", json={"role": "patient"}, headers=pat_headers)
    client.post("/api/v1/patient/profile", json={
        "fullName": "John Doe",
        "gender": "Male"
    }, headers=pat_headers)
    print("Patient Profile Created successfully.")

    print("\n---------------------------------------------------------")
    print("STEP 2: Patient Books Appointment (With Availability Check)")
    print("---------------------------------------------------------")
    target_date = "2026-10-15"
    target_time = "10:00 AM"

    # 2a. Check that the slot is available BEFORE booking
    slots_response = client.get(f"/api/v1/doctors/{doctor_id}/available-slots?date={target_date}", headers=pat_headers)
    assert slots_response.status_code == 200
    slots_data = slots_response.json()["timeSlots"]
    
    target_slot = next((s for s in slots_data if s["time"] == target_time), None)
    assert target_slot is not None, "Target time slot not found in available slots list"
    assert target_slot["available"] is True, "Target slot should be available before booking"
    print("Verified slot is available before booking.")

    appt_payload = {
        "doctorId": doctor_id,
        "date": target_date,
        "timeSlot": target_time
    }
    
    book_response = client.post("/api/v1/appointments/", json=appt_payload, headers=pat_headers)
    assert book_response.status_code in [200, 201], f"Failed to book: {book_response.text}"
    
    appt_data = book_response.json()["appointment"]
    appointment_id = appt_data["id"]
    
    # Check that initial status is Upcoming/Pending
    assert appt_data["status"] in ["Pending", "Upcoming"], f"Unexpected initial status: {appt_data['status']}"
    print(f"Appointment booked successfully. Status: {appt_data['status']}")

    # 2b. Check that the slot is disabled AFTER booking
    slots_response_after = client.get(f"/api/v1/doctors/{doctor_id}/available-slots?date={target_date}", headers=pat_headers)
    slots_data_after = slots_response_after.json()["timeSlots"]
    target_slot_after = next((s for s in slots_data_after if s["time"] == target_time), None)
    assert target_slot_after["available"] is False, "Target slot should be disabled (available=False) after booking!"
    print("Verified slot is now disabled in the available-slots endpoint.")

    print("\n---------------------------------------------------------")
    print("STEP 3: Double-Booking Prevention (Crucial)")
    print("---------------------------------------------------------")
    double_book_response = client.post("/api/v1/appointments/", json=appt_payload, headers=pat_headers)
    
    # Expecting 400 or 409 because the slot is already taken
    assert double_book_response.status_code in [400, 409], (
        f"CRITICAL BUG: Double booking was allowed! Expected 400/409, got {double_book_response.status_code}. "
        f"Response: {double_book_response.text}"
    )
    print(f"Double-booking properly prevented! Status code: {double_book_response.status_code}")

    print("\n---------------------------------------------------------")
    print("STEP 4: Doctor Views Appointments")
    print("---------------------------------------------------------")
    doc_schedule_response = client.get(f"/api/v1/doctor/schedule?date={target_date}", headers=doc_headers)
    assert doc_schedule_response.status_code == 200
    
    schedule_data = doc_schedule_response.json()
    appointments = schedule_data.get("appointments", [])
    
    # Verify the appointment is in the doctor's schedule
    assert any(a["id"] == appointment_id for a in appointments), "Appointment not found in Doctor's schedule"
    print("Doctor successfully retrieved appointment in schedule.")

    print("\n---------------------------------------------------------")
    print("STEP 5: Doctor Updates Status")
    print("---------------------------------------------------------")
    # Using the approve endpoint to confirm the appointment
    approve_response = client.put(f"/api/v1/appointments/{appointment_id}/approve", headers=doc_headers)
    assert approve_response.status_code == 200, f"Failed to approve: {approve_response.text}"
    assert approve_response.json()["success"] is True
    print("Doctor successfully approved appointment.")

    print("\n---------------------------------------------------------")
    print("STEP 6: Patient Verifies Update")
    print("---------------------------------------------------------")
    pat_appts_response = client.get("/api/v1/patient/appointments", headers=pat_headers)
    assert pat_appts_response.status_code == 200
    
    pat_appts = pat_appts_response.json()
    updated_appt = next((a for a in pat_appts if a["id"] == appointment_id), None)
    
    assert updated_appt is not None, "Appointment missing from patient's list"
    assert updated_appt["status"] in ["Approved", "Confirmed"], f"Status not updated properly. Current status: {updated_appt['status']}"
    print(f"Patient successfully verified status is now: {updated_appt['status']}")
    
    print("\n[SUCCESS] All appointment lifecycle tests passed successfully!")

async def main():
    await setup_db()
    try:
        run_tests()
    finally:
        await teardown_db()

if __name__ == "__main__":
    asyncio.run(main())
