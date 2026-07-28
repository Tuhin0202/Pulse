import os
import requests
import string
import random

# Replace this with your actual Web API Key from the Firebase Console (Project Settings > General)
FIREBASE_WEB_API_KEY = os.environ.get("FIREBASE_WEB_API_KEY", "AIzaSyCSGAB7vE-yuBSDeRx82UJepa5j9yVIgfY")

def generate_random_email():
    random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"test_{random_str}@example.com"

def generate_random_password():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=12))

def test_firebase_auth():
    print("--- Firebase Auth Simulator ---")
    
    if FIREBASE_WEB_API_KEY == "AIzaSyCSGAB7vE-yuBSDeRx82UJepa5j9yVIgfY":
        print("WARNING: Using dummy API Key. Please set FIREBASE_WEB_API_KEY environment variable or replace it in the script.")
    
    # 1. Sign up a new user via Firebase Auth REST API
    signup_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={FIREBASE_WEB_API_KEY}"
    
    email = generate_random_email()
    password = generate_random_password()
    
    payload = {
        "email": email,
        "password": password,
        "returnSecureToken": True
    }
    
    print(f"1. Attempting to create user: {email}")
    response = requests.post(signup_url, json=payload)
    
    if response.status_code != 200:
        print(f"Failed to create user. Status Code: {response.status_code}")
        print(response.json())
        return
    
    data = response.json()
    id_token = data.get("idToken")
    
    print(f"User created successfully!")
    print(f"Obtained ID Token: {id_token[:20]}... (truncated for security)")
    
    # 2. Make authenticated request to local FastAPI endpoint
    fastapi_url = "http://127.0.0.1:8000/api/doctors/create"
    headers = {
        "Authorization": f"Bearer {id_token}"
    }
    
    profile_payload = {
        "full_name": "Dr. Test User",
        "specialization": "General Medicine",
        "city": "Metropolis"
    }
    
    print("\n2. Sending authenticated request to FastAPI...")
    try:
        api_response = requests.post(fastapi_url, json=profile_payload, headers=headers)
        print(f"Status Code: {api_response.status_code}")
        print("Response Body:")
        print(api_response.json())
    except requests.exceptions.ConnectionError:
        print("Failed to connect to FastAPI server. Make sure it's running on http://127.0.0.1:8000")

if __name__ == "__main__":
    test_firebase_auth()
