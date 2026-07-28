import os
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

# Initialize Firebase Admin SDK
try:
    service_account_path = os.environ.get("FIREBASE_SERVICE_ACCOUNT_PATH", "firebase-service-account.json")
    if not firebase_admin._apps:
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
except Exception as e:
    print(f"Warning: Failed to initialize Firebase Admin SDK. {e}")

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
