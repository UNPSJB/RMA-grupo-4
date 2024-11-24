from fastapi.responses import StreamingResponse
from src.utils.services import generar_qr_code  # Importamos la función del servicio
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.database import get_db
from src.utils.schemas import *
from src.example.models import OTP
from datetime import datetime

router = APIRouter()

@router.get("/generar_qr")
async def generar_qr():
    # Aquí debes poner el enlace hacia tu bot de Telegram
    enlace_bot = "https://t.me/Dds_tavi_bot"  # Cambia esto por tu enlace
    
    # Llamar a la función del servicio para generar el QR
    img_byte_arr = generar_qr_code(enlace_bot)
    
    # Devolver la imagen QR generada
    return StreamingResponse(img_byte_arr, media_type="image/png")

@router.post("/verificar_otp")
async def verificar_otp(request: OTPRequest, db: Session = Depends(get_db)):
    # Buscar el OTP en la base de datos
    otp_record = db.query(OTP).filter(OTP.otp == request.otp, OTP.id_usuario == None).first()

    # Verificar si el OTP existe y si no tiene un id_usuario asignado
    if not otp_record:
        raise HTTPException(status_code=404, detail="OTP no encontrado o ya asignado a un usuario.")
    
    # Verificar si el OTP está expirado
    if otp_record.expiracion < datetime.now():
        raise HTTPException(status_code=400, detail="El OTP ha expirado.")

    # Verificar si ya existe un OTP activo para este usuario
    existing_otp = db.query(OTP).filter(OTP.id_usuario == request.id_usuario).first()
    if existing_otp:
        raise HTTPException(status_code=400, detail="Ya existe un OTP activo para este usuario.")
    
    # Asignar el id_usuario al registro de OTP
    otp_record.id_usuario = request.id_usuario
    db.commit()
    
    return {"message": "OTP verificado y asignado correctamente."}
