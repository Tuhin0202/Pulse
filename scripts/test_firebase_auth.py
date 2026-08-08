import os
import time
import random
import requests
from dotenv import load_dotenv

load_dotenv()

# --- CONFIGURATION (Loaded from .env) ---
FIREBASE_WEB_API_KEY = os.getenv("FIREBASE_WEB_API_KEY")
TEST_EMAIL_ADDRESS = os.getenv("TEST_EMAIL_ADDRESS")
TEST_PHONE_NUMBER = os.getenv("TEST_PHONE_NUMBER")

TEST_PASSWORD = "SecurePassword123!"

def test_email_auth():
    print("\n--- 📧 Email Auth Flow ---")
    
    if not TEST_EMAIL_ADDRESS or "@" not in TEST_EMAIL_ADDRESS:
        print("ERROR: TEST_EMAIL_ADDRESS is missing or invalid in your .env file.")
        return

    # Split the email to insert the +alias trick automatically
    email_parts = TEST_EMAIL_ADDRESS.split("@")
    base_email = email_parts[0]
    domain = f"@{email_parts[1]}"
    
    REAL_TEST_EMAIL = f"{base_email}+{random.randint(1000, 9999)}{domain}"
    
    # 1. Sign Up
    signup_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={FIREBASE_WEB_API_KEY}"
    print(f"\n1. Creating user: {REAL_TEST_EMAIL}...")
    
    signup_res = requests.post(signup_url, json={
        "email": REAL_TEST_EMAIL,
        "password": TEST_PASSWORD,
        "returnSecureToken": True
    })
    
    if signup_res.status_code != 200:
        print("Failed to create user.")
        print(signup_res.json())
        return
        
    data = signup_res.json()
    id_token = data.get("idToken")
    firebase_uid = data.get("localId")
    print("User created successfully!")

    # 2. Send Verification Email
    verify_url = f"https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key={FIREBASE_WEB_API_KEY}"
    print("\n2. Sending Verification Email...")
    
    verify_res = requests.post(verify_url, json={
        "requestType": "VERIFY_EMAIL",
        "idToken": id_token
    })
    
    if verify_res.status_code == 200:
        print("Verification email sent successfully!")
    else:
        print("Failed to send email.")
        return

    # 3. The Waiting Room (Auto-Polling)
    print("\n--- ACTION REQUIRED ---")
    print(f"Please check the inbox for {TEST_EMAIL_ADDRESS}")
    print(f"(The email was sent to {REAL_TEST_EMAIL}, which routes to your normal inbox).")
    print("Click the verification link sent by Firebase.")
    print("Waiting for verification... (Pinging Firebase every 10 seconds)")

    is_verified = False
    lookup_url = f"https://identitytoolkit.googleapis.com/v1/accounts:lookup?key={FIREBASE_WEB_API_KEY}"

    while not is_verified:
        lookup_res = requests.post(lookup_url, json={"idToken": id_token})
        user_data = lookup_res.json().get("users", [{}])[0]
        is_verified = user_data.get("emailVerified", False)
        
        if is_verified:
            print("\n✅ SUCCESS! Firebase confirms the email is verified.")
            break 
        else:
            print("Still not verified. Checking again in 10 seconds...")
            time.sleep(10)

    # 4. Send to FastAPI 
    send_to_fastapi(id_token, firebase_uid, "Dr. Email User")

    # 5. Clean Up
    clean_up_user(id_token, REAL_TEST_EMAIL)


def test_phone_auth():
    print(f"\n--- 📱 Phone Auth Flow ---")
    
    if not TEST_PHONE_NUMBER:
        print("ERROR: TEST_PHONE_NUMBER is missing from your .env file.")
        return
    
    # 1. Request SMS Session
    send_url = f"https://identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode?key={FIREBASE_WEB_API_KEY}"
    print(f"\n1. Requesting verification session for {TEST_PHONE_NUMBER}...")
    
    send_res = requests.post(send_url, json={"phoneNumber": TEST_PHONE_NUMBER})
    
    if send_res.status_code != 200:
        print("Failed to start phone auth. (Check your phone number format and whitelist settings)")
        print(send_res.json())
        return
        
    session_info = send_res.json().get("sessionInfo")
    print("Session created successfully!")

    # 2. Ask for OTP via Terminal Input
    print("\n--- ACTION REQUIRED ---")
    user_otp = input(f"Enter the OTP for {TEST_PHONE_NUMBER}: ")

    # 3. Verify the OTP Code
    verify_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPhoneNumber?key={FIREBASE_WEB_API_KEY}"
    print(f"\n2. Verifying OTP code ({user_otp})...")
    
    verify_res = requests.post(verify_url, json={
        "sessionInfo": session_info,
        "code": user_otp.strip()
    })
    
    if verify_res.status_code != 200:
        print("Failed to verify OTP. Incorrect code?")
        print(verify_res.json())
        return
        
    data = verify_res.json()
    id_token = data.get("idToken")
    firebase_uid = data.get("localId")
    is_new_user = data.get("isNewUser", False)
    
    print(f"✅ Phone verification successful! (New User: {is_new_user})")

    # 4. Send to FastAPI 
    send_to_fastapi(id_token, firebase_uid, "Dr. Phone User")

    # 5. Clean Up
    clean_up_user(id_token, TEST_PHONE_NUMBER)


def send_to_fastapi(id_token, firebase_uid, name):
    print("\n-> Sending profile to FastAPI backend...")
    
    # Step 1: Register user with role
    register_url = "http://127.0.0.1:8000/api/v1/auth/login"
    print("  1. Registering user via /api/v1/auth/login...")
    
    try:
        # Use login endpoint which auto-creates users
        login_response = requests.post(
            register_url,
            json={
                "email": f"{name.replace(' ', '').lower()}@test.com",
                "password": "SecurePassword123!",
                "role": "doctor"
            }
        )
        print(f"  Login/Register Status: {login_response.status_code}")
    except requests.exceptions.ConnectionError:
        print("  Failed to connect. Skipping login step.")
    
    # Step 2: Create doctor profile
    profile_url = "http://127.0.0.1:8000/api/v1/doctor/profile"
    print("  2. Creating doctor profile via /api/v1/doctor/profile...")
    
    profile_payload = {
        "fullName": name,
        "qualification": "MBBS, MD",
        "specialization": "General Medicine",
        "clinicName": "Test Clinic",
        "city": "Metropolis"
    }
    
    try:
        api_response = requests.post(
            profile_url, 
            json=profile_payload, 
            headers={"Authorization": f"Bearer {id_token}"}
        )
        print(f"  FastAPI Status: {api_response.status_code}")
        print(f"  Response: {api_response.json()}")
    except requests.exceptions.ConnectionError:
        print("  Failed to connect to FastAPI server. Make sure uvicorn is running.")


def clean_up_user(id_token, identifier):
    print("\n-> Cleaning up...")
    delete_url = f"https://identitytoolkit.googleapis.com/v1/accounts:delete?key={FIREBASE_WEB_API_KEY}"
    delete_res = requests.post(delete_url, json={"idToken": id_token})
    
    if delete_res.status_code == 200:
        print(f"🗑️ Successfully deleted {identifier} from Firebase.")
    else:
        print("Failed to delete user.")


def main():
    print("========================================")
    print("   Firebase Authentication Simulator    ")
    print("========================================")
    
    if not FIREBASE_WEB_API_KEY:
        print("ERROR: FIREBASE_WEB_API_KEY is missing from your .env file.")
        return

    print("Choose an authentication method to test:")
    print("1. Email & Password")
    print("2. Phone Number (OTP)")
    
    choice = input("\nEnter 1 or 2: ").strip()
    
    if choice == "1":
        test_email_auth()
    elif choice == "2":
        test_phone_auth()
    else:
        print("Invalid choice. Please run the script again and enter 1 or 2.")

if __name__ == "__main__":
    main()