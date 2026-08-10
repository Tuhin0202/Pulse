from dotenv import load_dotenv

load_dotenv()
from google import genai


class OCRService:
    def __init__(self):
        # We don't need load_dotenv if it's handled at startup, but fine to keep it clean.
        self.client = genai.Client()
        self.model_name = "gemini-3.6-flash"

    async def extract_prescription_text(self, file_path: str) -> str:
        try:
            # Note: the new genai SDK might block on file upload, we use standard client
            sample_file = self.client.files.upload(file=file_path)
            prompt = "You are a medical AI assistant. Extract and transcribe all text from this prescription accurately. Do not invent details. Output only the structured text."

            # Use async generation if possible, else fallback to standard
            if hasattr(self.client, "aio"):
                response = await self.client.aio.models.generate_content(
                    model=self.model_name, contents=[prompt, sample_file]
                )
            else:
                response = self.client.models.generate_content(
                    model=self.model_name, contents=[prompt, sample_file]
                )
            return response.text
        except Exception as e:
            print(f"OCR Error: {e}")
            return None


ocr_service = OCRService()

# Module-level alias for backward compatibility with test scripts
# Allows: from api.services.ocr import extract_prescription_text
extract_prescription_text = ocr_service.extract_prescription_text
