from dotenv import load_dotenv
load_dotenv()
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from api.v1.router import api_router
from api.db.base import Base
from api.db.session import engine

# Import all models here so SQLAlchemy knows about them before creating tables
from api.models import user, doctor, patient, appointment, document, rag, schedule, notification

# Uploads directory
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create local SQLite tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    # Ensure uploads directory exists
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    yield
    # Shutdown logic if needed

app = FastAPI(title="PulseHealth API", version="1.0.0", lifespan=lifespan)

# Allow frontend local ports 3000 and 5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

# Serve uploaded files
if os.path.exists(UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.get("/api/health")
def health_check():
    return {"status": "ok", "db": "sqlite (mocked supabase)"}
