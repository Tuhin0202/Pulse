from pydantic import BaseModel


class RegisterRequest(BaseModel):
    email: str | None = None
    phone: str | None = None
    password: str
    role: str | None = None


class RegisterResponse(BaseModel):
    success: bool
    userId: str
    verificationMethod: str


class AssignRoleRequest(BaseModel):
    userId: str
    role: str


class UpdatePasswordRequest(BaseModel):
    email: str | None = None
    phone: str | None = None
    newPassword: str


class ResetPasswordEmailRequest(BaseModel):
    email: str


class ResetPasswordPhoneRequest(BaseModel):
    phone: str


class ResendEmailRequest(BaseModel):
    email: str


class ResendOtpRequest(BaseModel):
    phone: str


class VerifyEmailRequest(BaseModel):
    email: str


class VerifyOtpRequest(BaseModel):
    sessionInfo: str | None = None
    code: str
