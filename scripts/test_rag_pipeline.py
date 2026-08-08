import asyncio
import os
import sys

# Ensure the root directory is in the python path so we can import 'api'
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from api.services.rag_service import rag_service

async def test_rag():
    print("=== Testing RAG Service Pipeline ===")
    
    # 1. Test Text Chunking
    print("\n1. Testing Text Chunking...")
    sample_text = "Patient Tuhin has a history of hypertension. Prescribed Paracetamol 600 daily. Follow up in 8 months."
    chunks = rag_service.chunk_text(sample_text, chunk_size=50, overlap=10)
    print(f"Generated {len(chunks)} chunks:")
    for i, chunk in enumerate(chunks):
        print(f"  Chunk {i+1}: {chunk}")

    # 2. Test Vectorization (Mocked for now)
    print("\n2. Testing Vectorization...")
    vector = await rag_service.vectorize_text(chunks[0])
    print(f"Generated vector of length: {len(vector)} (Mocked output)")

    # 3. Test Context Retrieval
    print("\n3. Testing Context Retrieval...")
    query = "What is my medical history in the prescription?"
    context = await rag_service.retrieve_context(query)
    print(f"Retrieved Context: {context}")

    # 4. Test Chat Response Generation via Gemini
    print("\n4. Testing Gemini Chat Response Generation...")
    # We will pass actual context this time to see Gemini in action
    actual_context = "Patient Tuhin has a history of hypertension. Prescribed Paracetamol 600 daily."
    response = await rag_service.generate_chat_response(query, actual_context)
    
    print("\n=== AI Response ===")
    print(f"User: {query}")
    print(f"Assistant: {response}")
    print("===================")

if __name__ == "__main__":
    asyncio.run(test_rag())
