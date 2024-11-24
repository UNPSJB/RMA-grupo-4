from pydantic import BaseModel

class OTPRequest(BaseModel):
    otp: int
    id_usuario: int