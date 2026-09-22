# PulseHealth

**Clarity through Calm. Modern Clinical & Patient Care Platform powered by AI.**

## Project Summary

**PulseHealth** is an intelligent, full-stack digital health platform engineered to seamlessly bridge the workflow and communication gaps between healthcare providers and patients. Designed with a clean, clinical-grade aesthetic, the platform unifies practice management with patient health tracking.

At its core, PulseHealth aims to eliminate administrative friction and empower better health outcomes through modern technology and Artificial Intelligence. By integrating Google Gemini's advanced Language Models, the platform transforms static medical documents into actionable insights, providing users with a truly smart healthcare companion.

### Core Capabilities

#### 🧑‍⚕️ For Doctors
*   **Practice Management**: A dedicated dashboard providing a real-time overview of active patients, upcoming appointments, and pending requests.
*   **Schedule Optimization**: Flexible slot management tools to define working hours and availability, complete with automated conflict prevention.
*   **Clinical Review**: Instant access to patient medical histories, vital trends, and securely uploaded clinical documents.
*   **Professional Branding**: Customizable profiles highlighting specializations, clinic locations, and professional credentials.

#### 🩺 For Patients
*   **Seamless Discovery & Booking**: A friction-free flow for browsing verified doctors by specialty and booking available time slots instantly.
*   **Health & Vitals Tracking**: A centralized medical record system to monitor personal health metrics like blood pressure, heart rate, and temperature.
*   **Digital Prescription Vault**: Secure upload and storage for historical prescriptions, medical reports, and lab results.

#### 🤖 AI-Powered Intelligence
*   **Smart Clinical OCR**: Utilizing Google Gemini's multimodal capabilities to automatically scan, extract, and transcribe structured text from uploaded prescriptions or lab documents.
*   **Context-Aware Health Assistant**: A conversational AI powered by Retrieval-Augmented Generation (RAG) that can answer patient health queries with deep context from their uploaded clinical records.

#### 🔐 Enterprise-Grade Security
*   **Robust Authentication**: Firebase-backed identity management supporting both Email/Password and Mobile OTP verification.
*   **Role-Based Access Control**: Strict segregation between Doctor and Patient portals, enforced by secure token validation across all backend FastAPI endpoints.

---

## Running Locally

### Requirements
*   **Python 3.10+** (for the FastAPI backend)
*   **Node.js 18+** (for the React/Vite frontend)
*   **Firebase Project** with Authentication enabled (Email/Password, Phone) and a generated Service Account Private Key JSON file.
*   **Google Gemini API Key** (for AI features and OCR).

### Setup Instructions

1.  **Environment Variables**: 
    Copy `.env.example` to `.env` and fill in your Firebase, Database (SQLite by default), and Gemini API credentials. Ensure your Firebase service account JSON is placed in the project root.

2.  **Start the Backend**:
    Open a terminal, create a virtual environment, and run:
    ```bash
    pip install -r requirements.txt
    uvicorn api.main:app --reload
    ```
    *The backend API will be available at `http://localhost:8000` (Swagger UI at `/docs`).*

3.  **Start the Frontend**:
    Open a second terminal and run:
    ```bash
    npm install
    npm run dev
    ```
    *The web application will be available at `http://localhost:3000`.*
