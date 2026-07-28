from fastapi import APIRouter

router = APIRouter(prefix="/api/patients", tags=["patients"])

@router.get("/")
def get_patients():
    pass

@router.get("/{patient_id}")
def get_patient(patient_id: str):
    pass
