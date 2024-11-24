import random
from datetime import datetime, timedelta
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
from dotenv import load_dotenv
import os
import time
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db  # Asegúrate de que `get_db` esté correctamente importado desde tu archivo

# Cargar variables de entorno
load_dotenv()

# Cargar el token del archivo .env
TOKEN = os.getenv("BOT_TOKEN")
if not TOKEN:
    raise ValueError("La variable de entorno BOT_TOKEN no está configurada correctamente.")

# Subalgoritmo para generar un OTP único
def generar_otp() -> int:
    """Genera un OTP único de 8 dígitos combinando un número aleatorio y una marca temporal."""
    # Paso 1: Generar un número aleatorio de 4 cifras (entre 1000 y 9999)
    otp_aleatorio = random.randint(1000, 9999)

    # Paso 2: Obtener los últimos 4 dígitos del timestamp actual
    timestamp = str(int(time.time() * 1000))  # Timestamp en milisegundos
    temporal = timestamp[-4:]  # Tomamos los últimos 4 dígitos del timestamp

    # Paso 3: Combinar ambos números para obtener un OTP de 8 dígitos
    otp_completo = str(otp_aleatorio) + temporal

    # Convertimos el OTP a un número entero y lo devolvemos
    return int(otp_completo)

# Función para guardar el OTP en la base de datos
def guardar_otp_db(otp: int):
    """Guarda el OTP generado en la base de datos con su fecha de expiración."""
    # expiracion = datetime.now() + timedelta(days=5)  # Expira en 5 días
    expiracion = datetime.now() + timedelta(minutes=1)
    id_usuario = None  # Establecemos el id_usuario como NULL
    with next(get_db()) as db:  # Utilizamos el generador de `get_db` para obtener la sesión
        db.execute(
            text("""
            INSERT INTO otp_gen (otp, expiracion, id_usuario)
            VALUES (:otp, :expiracion, :id_usuario);
            """),
            {"otp": otp, "expiracion": expiracion, "id_usuario": id_usuario},
        )
        db.commit()

# Función que maneja el comando /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user_first_name = update.effective_user.first_name

    # Llamar al subalgoritmo para generar el OTP
    otp = generar_otp()

    # Guardar el OTP en la base de datos
    guardar_otp_db(otp)

    # Mensaje de bienvenida
    await update.message.reply_text(f"¡Hola, {user_first_name}! Bienvenido a este bot.")
    
    # Enviar el OTP
    await update.message.reply_text(f"Tu código OTP es: {otp}")

    # Mostrar en la consola información del usuario y su OTP
    print(f"Usuario conectado: Nombre={user_first_name}, OTP={otp}")

# Configuración principal del bot
if __name__ == "__main__":
    application = ApplicationBuilder().token(TOKEN).build()

    # Añadimos el manejador para el comando /start
    application.add_handler(CommandHandler("start", start))

    # Iniciamos el bot
    print("Bot en ejecución...")
    application.run_polling()
