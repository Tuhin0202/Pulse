from dotenv import load_dotenv

load_dotenv()
from google import genai


class RAGService:
    def __init__(self):
        self.client = genai.Client()
        self.embed_model = "gemini-embedding-2"
        self.llm_model = "gemini-3.6-flash"

    def chunk_text(
        self, text: str, chunk_size: int = 500, overlap: int = 50
    ) -> list[str]:
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

    async def vectorize_text(self, text: str) -> list[float]:
        """Generates embedding using Gemini."""
        if hasattr(self.client, "aio"):
            response = await self.client.aio.models.embed_content(
                model=self.embed_model, contents=text
            )
        else:
            response = self.client.models.embed_content(
                model=self.embed_model, contents=text
            )
        # response.embeddings is a list of embeddings. We take the first one.
        # Actually in genai SDK, it's response.embeddings[0].values
        return response.embeddings[0].values

    async def retrieve_context(self, query: str, db=None, patient_id: str = None) -> str:
        """Performs vector similarity search."""
        if not db:
            return "No database session provided for context retrieval."
        
        query_vector = await self.vectorize_text(query)
        from sqlalchemy import select
        from api.models.rag import DocumentChunk
        
        stmt = select(DocumentChunk)
        
        if patient_id:
            from api.models.document import Document
            stmt = stmt.join(Document, DocumentChunk.document_id == Document.id).filter(Document.patient_id == patient_id)
            
        # pgvector L2 distance operator is <->
        stmt = (
            stmt
            .order_by(DocumentChunk.embedding.l2_distance(query_vector))
            .limit(3)
        )
        result = await db.execute(stmt)
        chunks = result.scalars().all()
        
        if not chunks:
            return "No relevant context found."
            
        context = "\n\n".join([chunk.chunk_text for chunk in chunks])
        return context

    async def generate_chat_response(self, query: str, context: str) -> str:
        prompt = f"Context: {context}\n\nUser: {query}\n\nProvide a helpful medical summary based strictly on the context."
        try:
            if hasattr(self.client, "aio"):
                response = await self.client.aio.models.generate_content(
                    model=self.llm_model, contents=[prompt]
                )
            else:
                response = self.client.models.generate_content(
                    model=self.llm_model, contents=[prompt]
                )
            return response.text
        except Exception as e:
            print(f"RAG Error: {e}")
            return "Sorry, I could not process your request at this time."


rag_service = RAGService()
