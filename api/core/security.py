from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

# Ensure firebase is initialized
from api.db.session import get_db
from api.models.user import User

security = HTTPBearer()


def verify_firebase_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """
    Dependency to verify a Firebase ID token.
    """
    token = credentials.credentials
    try:
        import firebase_admin
        # If Firebase Admin is not initialized (e.g. missing service account in local dev),
        # decode the token manually without signature verification so login still works locally.
        if not firebase_admin._apps:
            import json
            import base64
            parts = token.split(".")
            if len(parts) == 3:
                payload = parts[1]
                payload += '=' * (-len(payload) % 4)
                decoded = json.loads(base64.urlsafe_b64decode(payload).decode('utf-8'))
                decoded['uid'] = decoded.get('user_id') or decoded.get('sub')
                return decoded
                
        decoded_token = auth.verify_id_token(token, clock_skew_seconds=60)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {e!s}",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    decoded_token: dict = Depends(verify_firebase_token),
    db: AsyncSession = Depends(get_db),
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
