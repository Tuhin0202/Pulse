from fastapi import APIRouter

from api.v1.endpoints import auth, doctors, doctors_public, patients, appointments, assistant, upload

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(doctors.router, prefix="/doctor", tags=["doctor"])
api_router.include_router(doctors_public.router, prefix="/doctors", tags=["doctors-public"])
api_router.include_router(patients.router, prefix="/patient", tags=["patient"])
api_router.include_router(appointments.router, prefix="/appointments", tags=["appointments"])
api_router.include_router(assistant.router, prefix="/health-assistant", tags=["health-assistant"])
api_router.include_router(upload.router, prefix="/upload", tags=["upload"])
