import asyncio
import logging

# Changed "app" to "api" to match your folder structure
from api.db.session import engine
from api.db.base import Base 

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def init_db():
    logger.info("Connecting to Supabase to create tables...")
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Success! All tables have been created in Supabase.")
    except Exception as e:
        logger.error(f"An error occurred: {e}")

if __name__ == "__main__":
    asyncio.run(init_db())