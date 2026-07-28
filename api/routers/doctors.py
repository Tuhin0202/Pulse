from fastapi import APIRouter, Depends
from api.auth import verify_firebase_token
from api.schemas import DoctorProfile

router = APIRouter(
    prefix="/api/doctors",
    tags=["doctors"]
)

@router.post("/create")
def create_doctor(profile: DoctorProfile, token: dict = Depends(verify_firebase_token)):
    uid = token.get("uid")
    
    # Mocking Supabase insert by printing/logging
    print(f"Verified UID: {uid}")
    print(f"Incoming Profile Payload: {profile.model_dump()}")
    
    return {
        "status": "success",
        "message": "Doctor profile received and verified successfully.",
        "uid": uid,
        "data": profile.model_dump()
    }
