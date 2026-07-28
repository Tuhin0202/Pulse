from fastapi import APIRouter
from api.schemas import PrescriptionData

router = APIRouter(prefix="/api/prescriptions", tags=["prescriptions"])

@router.get("/")
def get_prescriptions():
    pass

@router.post("/")
def create_prescription(prescription: PrescriptionData):
    pass
