from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from api.db.session import get_db
from api.models.user import User
# Ensure firebase is initialized
from api.core import firebase

security = HTTPBearer()

def verify_firebase_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Dependency to verify a Firebase ID token.
    """
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(
    decoded_token: dict = Depends(verify_firebase_token),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Dependency to get the current user from the database.
    If the user doesn't exist yet, this could either create them or raise an error.
    For this architecture, we will return the user or raise 404 if they haven't registered their profile.
    """
    firebase_uid = decoded_token.get("uid")
    
    result = await db.execute(select(User).filter(User.firebase_uid == firebase_uid))
    user = result.scalars().first()
    
    if not user:
        # Auto-create basic user record if it doesn't exist
        email = decoded_token.get("email")
        phone = decoded_token.get("phone_number")
        user = User(firebase_uid=firebase_uid, email=email, phone_number=phone)
        db.add(user)
        await db.commit()
        await db.refresh(user)
        
    return user
