import qrcode
from io import BytesIO
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db

def generar_qr_code(enlace_bot: str) -> BytesIO:
    """Genera un código QR a partir de un enlace de bot y devuelve la imagen en formato de bytes."""
    
    # Generar el código QR
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(enlace_bot)
    qr.make(fit=True)

    # Crear una imagen de PIL a partir del QR
    img = qr.make_image(fill='black', back_color='white')

    # Convertir la imagen a un flujo de bytes
    img_byte_arr = BytesIO()
    img.save(img_byte_arr, format="PNG")
    img_byte_arr.seek(0)
    
    return img_byte_arr

