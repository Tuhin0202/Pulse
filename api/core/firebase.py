import os

import firebase_admin
from firebase_admin import credentials


def init_firebase():
    try:
        # Resolve path relative to the project root
        default_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "firebase-service-account.json")
        service_account_path = os.environ.get("FIREBASE_SERVICE_ACCOUNT_PATH", default_path)
        
        if not firebase_admin._apps:
            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred)
            print("Firebase Admin SDK initialized successfully.")
    except Exception as e:
        print(f"Warning: Failed to initialize Firebase Admin SDK. {e}")


# Call it immediately when this module is imported
init_firebase()
