import os

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")


settings = Settings()

from supabase import create_client, Client
supabase_client: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
