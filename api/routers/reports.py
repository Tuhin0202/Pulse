from fastapi import APIRouter

router = APIRouter(prefix="/api/reports", tags=["reports"])

@router.get("/")
def get_reports():
    pass
