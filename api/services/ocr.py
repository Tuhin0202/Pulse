import os
from dotenv import load_dotenv
from google import genai

# 1. Load the environment variables
load_dotenv()

# 2. Initialize the modern client (it automatically finds GEMINI_API_KEY in your .env file)
client = genai.Client()

def extract_prescription_text(file_path: str) -> str:
    try:
        # 3. Upload the local image temporarily using the Files API
        sample_file = client.files.upload(file=file_path)
        
        # 4. The strict firewall prompt
        prompt = "You are a medical AI assistant. Extract and transcribe all text from this prescription accurately. Do not invent details. Output only the structured text."
        
        # 5. Call the model
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=[prompt, sample_file]
        )
        return response.text
        
    except Exception as e:
        print(f"OCR Error: {e}")
        return None