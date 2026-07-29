import os
import sys

# Add project root to sys.path so we can import from api
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

from api.services.ocr import extract_prescription_text

# Instructions:
# 1. Create a directory named 'test_documents' in the project root if it doesn't exist.
# 2. Place a dummy image file named 'sample_rx.jpg' inside the 'test_documents' folder.
# 3. Run this script to test the OCR extraction locally bypassing FastAPI.

if __name__ == "__main__":
    test_image_path = os.path.join(project_root, "test_documents", "sample_rx.jpg")
    
    if not os.path.exists(test_image_path):
        print(f"Error: The test image was not found at {test_image_path}")
        print("Please create the 'test_documents' folder and place a 'sample_rx.jpg' image inside it.")
        sys.exit(1)
        
    print(f"Testing OCR on: {test_image_path}")
    print("Extracting text... please wait.")
    
    extracted_text = extract_prescription_text(test_image_path)
    
    print("\n--- Extracted Text ---")
    if extracted_text:
        print(extracted_text)
    else:
        print("Failed to extract text or no text returned.")
    print("----------------------")
