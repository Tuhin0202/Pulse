import os
import sys

# Ensure the root directory is in sys.path to import api modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from api.services.ocr import extract_prescription_text

def main():
    """
    Test the OCR Pipeline independently of FastAPI.
    
    INSTRUCTIONS FOR DEVELOPER:
    1. Create a folder named 'test_documents' at the root of the project (same level as 'api' and 'scripts').
    2. Place a dummy prescription image inside 'test_documents' and name it 'sample_rx.jpg'.
    3. Ensure your GEMINI_API_KEY is set in your .env file or environment variables.
    4. Run this script from the project root: python scripts/test_ocr_pipeline.py
    """
    
    test_image_path = os.path.join("test_documents", "sample_rx.jpg")
    
    if not os.path.exists(test_image_path):
        print(f"Error: Test image not found at {test_image_path}")
        print("Please follow the instructions in this script to set up the test image.")
        return
        
    print(f"Testing OCR on: {test_image_path}")
    print("Extracting text (this may take a few seconds)...")
    
    extracted_text = extract_prescription_text(test_image_path)
    
    if extracted_text:
        print("\n=== EXTRACTED TEXT ===")
        print(extracted_text)
        print("======================\n")
        print("OCR Pipeline test successful.")
    else:
        print("\nFailed to extract text. Check the logs for errors.")

if __name__ == "__main__":
    main()
