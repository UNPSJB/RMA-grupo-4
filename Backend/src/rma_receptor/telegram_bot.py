from telegram import Bot
import os
import requests
from dotenv import load_dotenv
from src.database import SessionLocal
from src.models import Rango, Variable

load_dotenv()
BOT_TOKEN = os.getenv("BOT_TOKEN")
token = os.getenv('TELEGRAM_TOKEN')
chat_ids = [int(os.getenv('TELEGRAM_CHAT_ID_1')), int(os.getenv('TELEGRAM_CHAT_ID_2'))]

estado_anterior_sensores = {}  # Almacena el estado anterior de cada sensor

unidad_medida = {
    'Nivel de agua': 'Mts',
    'Bateria': 'V'
}

def obtener_niveles_alerta(tipo):
    """
    Obtiene los niveles de alerta de la base de datos para un tipo específico de variable.
    
    """
    session = SessionLocal()
    try:
        # Buscar el registro de la variable usando su nombre
        variable = session.query(Variable).filter(Variable.nombre == tipo).first()
        
        if variable is None:
            return []
        
        niveles = session.query(Rango).filter(Rango.variable_id == variable.id).order_by(Rango.min_val).all()
        
        # Devuelve una lista de tuplas (min_val, max_val, color)
        return [(rango.min_val, rango.max_val, rango.color) for rango in niveles]
    finally:
        session.close()

def enviar_mensaje_personal(chat_id,mensaje):
    token = BOT_TOKEN  # Asegúrate de que BOT_TOKEN esté definido correctamente.
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    print(f"este es el chat_id={chat_id}")
    payload = {
        "chat_id": chat_id,
        "text": mensaje
    }
    
    try:
        # Realiza la solicitud POST a la API de Telegram
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            print(f"Mensaje enviado a chat_id={chat_id}")
        else:
            print(f"Error al enviar mensaje: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error al intentar enviar mensaje a chat_id={chat_id}: {e}")


def enviar_mensaje_telegram(mensaje, tipo_alerta):
    url = f'https://api.telegram.org/bot{token}/sendMessage'
    
    if tipo_alerta == 'Nivel de agua':
        chat_id = chat_ids[0] #Trae el id_chat para alertas cooperativa (Nivel del agua)
    else:
        chat_id = chat_ids[1] #Trae el id_chat para alertas profesional (voltage)
    
    payload = {
        'chat_id': chat_id,
        'text': mensaje,
        'parse_mode': 'Markdown'
    }
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f'Error al enviar mensaje a Telegram: {e}')
        if response:
            print(f'Respuesta del servidor: {response.text}')

def determinar_nivel_alerta(tipo, data):
    """
    Determina el nivel de alerta para el tipo de variable y valor `data`.
    """
    niveles = obtener_niveles_alerta(tipo)
    
    if niveles:
        for min_val, max_val, color in niveles:
            if min_val <= data <= max_val:
                return color
    return 'desconocido'

def analizar_alerta(mensaje_json):
    tipo = mensaje_json.get('type')
    data = float(mensaje_json.get('data'))
    nodo_id = mensaje_json.get('id')

    unidad_legible = unidad_medida.get(tipo)

    # Determinar el nivel de alerta actual
    nivel_alerta_actual = determinar_nivel_alerta(tipo, data)
    data_formateada = f"{data:.2f}"

    # Inicializar el estado del nodo si no existe
    if nodo_id not in estado_anterior_sensores:
        estado_anterior_sensores[nodo_id] = {}
        
    # Obtener el nivel de alerta anterior
    nivel_alerta_anterior = estado_anterior_sensores[nodo_id].get(tipo)
    # Si el estado cambió, enviar notificación
    if nivel_alerta_actual != nivel_alerta_anterior:
        if nivel_alerta_actual in ['amarillo', 'naranja', 'rojo']:
            mensaje_telegram = (
                f"⚠️ Alerta: Cambio de nivel de alerta.\n"
                f"Nodo: {str(nodo_id).replace('_', '\\_')}\n"
                f"Tipo: {tipo.replace('_', '\\_')}\n"
                f"Valor: {data_formateada} {unidad_legible.replace('_', '\\_')}\n"
                f"Nuevo Nivel de Alerta: {nivel_alerta_actual.capitalize()}"
            )
            enviar_mensaje_telegram(mensaje_telegram, tipo)

        elif nivel_alerta_actual == 'verde' and nivel_alerta_anterior in ['amarillo', 'naranja', 'rojo']:
            mensaje_telegram = (
                f"✅ Alerta finalizada: El estado del nodo {str(nodo_id).replace('_', '\\_')} ha vuelto a la normalidad.\n"
                f"Tipo: {tipo.replace('_', '\\_')}\n"
                f"Valor: {data_formateada} {unidad_legible.replace('_', '\\_')}\n"
                f"Nivel de Alerta: {nivel_alerta_actual.capitalize()}"
            )
            enviar_mensaje_telegram(mensaje_telegram, tipo)
        
        # Actualizar el estado del nodo
        estado_anterior_sensores[nodo_id][tipo] = nivel_alerta_actual