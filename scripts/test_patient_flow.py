import asyncio
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from api.main import app
from api.db.base import Base
from api.db.session import get_db
from api.core.security import verify_firebase_token

# Setup in-memory async SQLite database
SQLALCHEMY_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

# Using StaticPool to ensure the same connection is shared in memory
engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine, class_=AsyncSession
)

async def override_get_db():
    """Dependency override for get_db to use testing session."""
    async with TestingSessionLocal() as session:
        yield session

def override_verify_firebase_token():
    """Dependency override for Firebase auth."""
    return {
        "uid": "test_auto_uid_002",
        "email": "patienttest@pulsehealth.com",
        "phone_number": "+1098765432"
    }

# Apply dependency overrides
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
    # Step 1: Sync User (POST /api/v1/auth/login)
    print("Running Step 1: Sync User...")
    response = client.post("/api/v1/auth/login", json={"role": "patient"})
    assert response.status_code == 200, f"Expected 200, got {response.status_code} - {response.text}"
    data = response.json()
    assert data.get("success") is True, f"Response did not indicate success: {data}"
    assert data["user"]["role"] == "patient"
    print("Step 1 passed.")

    # Step 2: Create Profile (POST /api/v1/patient/profile)
    print("Running Step 2: Create Profile...")
    profile_payload = {
        "fullName": "Automated Patient",
        "dateOfBirth": "1990-01-01",
        "bloodGroup": "O+",
        "address": "456 Test Ave",
        "phone": "+1098765432",
        "email": "patienttest@pulsehealth.com",
        "gender": "Male"
    }
    response = client.post("/api/v1/patient/profile", json=profile_payload)
    assert response.status_code in (200, 201), f"Expected 200 or 201, got {response.status_code} - {response.text}"
    print("Step 2 passed.")

    # Step 3: Duplicate Profile Check (POST /api/v1/patient/profile)
    print("Running Step 3: Duplicate Profile Check...")
    response = client.post("/api/v1/patient/profile", json=profile_payload)
    assert response.status_code == 400, f"Expected 400, got {response.status_code} - {response.text}"
    data = response.json()
    assert "Patient profile already exists" in data.get("detail", {}).get("error", ""), f"Unexpected error message: {data}"
    print("Step 3 passed.")

    # Step 4: Fetch Profile (GET /api/v1/patient/profile)
    print("Running Step 4: Fetch Profile...")
    response = client.get("/api/v1/patient/profile")
    assert response.status_code == 200, f"Expected 200, got {response.status_code} - {response.text}"
    data = response.json()
    assert data.get("fullName") == "Automated Patient"
    print("Step 4 passed.")
    print("All patient flow tests passed successfully!")


async def main():
    await setup_db()
    try:
        run_tests()
    finally:
        await teardown_db()

if __name__ == "__main__":
    asyncio.run(main())
