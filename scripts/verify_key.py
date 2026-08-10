import os
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
# pyrefly: ignore [missing-import]
from google import genai # Modern SDK import

# Force load the .env file
load_dotenv()

def test_gemini_connection():
    # 1. Verify the key was actually found by Python
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("❌ Error: GEMINI_API_KEY not found. Check your .env file!")
        return

    print(f"✅ Key loaded successfully (starts with: {api_key[:10]}...)")
    
    try:
        # 2. Initialize the client. It automatically picks up the GEMINI_API_KEY variable.
        client = genai.Client()
        
        # 3. Make a tiny test request to ensure Google's servers accept the key
        print("⏳ Sending test ping to Google servers...")
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents='Reply with the exact word: "Connected!"'
        )
        
        print(f"🎉 Success! The AI says: {response.text}")
        
    except Exception as e:
        print(f"❌ Authentication or Connection Failed: {e}")

if __name__ == "__main__":
    test_gemini_connection()