import uuid
from typing import List
from dotenv import load_dotenv
load_dotenv()
from google import genai

class RAGService:
    def __init__(self):
        self.client = genai.Client()
        self.embed_model = 'text-embedding-004'
        self.llm_model = 'gemini-3.6-flash'

    def chunk_text(self, text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
        """Simple text chunking."""
        chunks = []
        if not text:
            return chunks
        start = 0
        while start < len(text):
            end = start + chunk_size
            chunks.append(text[start:end])
            start += chunk_size - overlap
        return chunks

    async def vectorize_text(self, text: str) -> List[float]:
        """Generates embedding using Gemini."""
        # Mock vector for local SQLite since pgvector isn't available
        # Normally: return self.client.models.embed_content(model=self.embed_model, contents=text).embedding
        return [0.0] * 768

    async def retrieve_context(self, query: str) -> str:
        """Mocks vector similarity search."""
        return "Mocked retrieved context from SQLite (Since pgvector is disabled)."

    async def generate_chat_response(self, query: str, context: str) -> str:
        prompt = f"Context: {context}\n\nUser: {query}\n\nProvide a helpful medical summary based strictly on the context."
        try:
            if hasattr(self.client, 'aio'):
                response = await self.client.aio.models.generate_content(
                    model=self.llm_model,
                    contents=[prompt]
                )
            else:
                response = self.client.models.generate_content(
                    model=self.llm_model,
                    contents=[prompt]
                )
            return response.text
        except Exception as e:
            print(f"RAG Error: {e}")
            return "Sorry, I could not process your request at this time."

rag_service = RAGService()
