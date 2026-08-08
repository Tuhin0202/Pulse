from pydantic import BaseModel
from typing import Optional

# --- Login ---
class LoginRequest(BaseModel):
    email: str
    password: str
    role: str  # "doctor" | "patient"

class LoginUserInfo(BaseModel):
    id: str
    email: str
    role: str

class LoginResponse(BaseModel):
    token: str
    user: LoginUserInfo
    redirectTo: str

# --- Register ---
class RegisterRequest(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    password: str
    role: str  # "doctor" | "patient"

class RegisterResponse(BaseModel):
    success: bool
    userId: str
    verificationMethod: str  # "email" | "phone"

# --- Assign Role ---
class AssignRoleRequest(BaseModel):
    userId: str
    role: str  # "doctor" | "patient"

# --- Update Password ---
class UpdatePasswordRequest(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    newPassword: str

# --- Reset Password ---
class ResetPasswordEmailRequest(BaseModel):
    email: str

class ResetPasswordPhoneRequest(BaseModel):
    phone: str

# --- Verify Email ---
class VerifyEmailRequest(BaseModel):
    email: str
    token: str

# --- Verify OTP ---
class VerifyOtpRequest(BaseModel):
    phone: str
    code: str

# --- Resend ---
class ResendEmailRequest(BaseModel):
    email: str

class ResendOtpRequest(BaseModel):
    phone: str

# --- Legacy schema kept for backward compatibility ---
class AuthRegister(BaseModel):
    id_token: str
    role: str  # "doctor" or "patient"
