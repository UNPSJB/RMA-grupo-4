import os
import io
import requests
import qrcode
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

telegram_token = os.getenv('TELEGRAM_TOKEN')
chat_id = int(os.getenv('TELEGRAM_CHAT_ID'))

def obtener_enlace_invitacion():
    """
    Llama al método exportChatInviteLink de la API de Telegram para obtener el enlace de invitación del canal.
    """
    url = f"https://api.telegram.org/bot{telegram_token}/exportChatInviteLink"
    
    # Realiza la solicitud para obtener el enlace de invitación del canal
    response = requests.get(url, params={"chat_id": chat_id})

    if response.status_code == 200:
        data = response.json()
        if data["ok"]:
            return data["result"]  # Devuelve el enlace de invitación
        else:
            raise HTTPException(status_code=500, detail="No se pudo obtener el enlace de invitación del canal.")
    else:
        raise HTTPException(status_code=response.status_code, detail="Error al comunicarse con la API de Telegram.")

def generar_qr(data: str) -> io.BytesIO:
    """
    Genera un código QR a partir de la data proporcionada.
    """
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img_io = io.BytesIO()
    qr_img = qr.make_image(fill='black', back_color='white')
    qr_img.save(img_io, 'PNG')
    img_io.seek(0)
    
    return img_io