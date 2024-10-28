from telegram import Bot
import os
import requests
from dotenv import load_dotenv

load_dotenv()

token = os.getenv('TELEGRAM_TOKEN')
chat_ids = [int(os.getenv('TELEGRAM_CHAT_ID_1')), int(os.getenv('TELEGRAM_CHAT_ID_2'))]

estado_anterior_sensores = {}  # Almacena el estado anterior de cada sensor

descripciones_tipos = {
    'altitude_t': 'Hidrometrico',
    'voltage_t': 'Voltage'
}

unidad_medida = {
    'altitude_t': 'Mts',
    'voltage_t': 'V'
}

def enviar_mensaje_telegram(mensaje, tipo_alerta):
    url = f'https://api.telegram.org/bot{token}/sendMessage'
    
    if tipo_alerta == 'Hidrometrico':
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
    niveles = {
        'altitude_t': [
            (0.0, 0.5, 'verde'),
            (0.6, 0.7, 'amarillo'),
            (0.8, 1.5, 'naranja'),
            (1.6, 2.0, 'rojo')
        ],
        'voltage_t': [
            (11.4, 13.5, 'verde'),
            (10.6, 11.5, 'amarillo'),
            (10.0, 10.5, 'rojo')
        ]
    }

    if tipo in niveles:
        for min_val, max_val, nivel in niveles[tipo]:
            if min_val <= data <= max_val:
                return nivel
    return 'desconocido'

def analizar_alerta(mensaje_json):
    tipo = mensaje_json.get('type')
    data = float(mensaje_json.get('data'))
    nodo_id = mensaje_json.get('id')

    tipo_legible = descripciones_tipos.get(tipo)  

    # Si el tipo no está definido en el diccionario, no hacemos nada
    if not tipo_legible:
        return
    
    unidad_legible = unidad_medida.get(tipo)
    
    nivel_alerta_actual = determinar_nivel_alerta(tipo, data)  # Determina el nivel de alerta para ese tipo de sensor

    data_formateada = f"{data:.2f}"

    # Inicializa el nodo en el diccionario si no existe
    if nodo_id not in estado_anterior_sensores:
        estado_anterior_sensores[nodo_id] = {}
    
    nivel_alerta_anterior = estado_anterior_sensores[nodo_id].get(tipo)  # Obtiene el estado anterior del sensor específico (tipo) en el nodo

    # Si el estado cambió para este tipo de sensor, enviamos una alerta
    if nivel_alerta_actual != nivel_alerta_anterior:
        if nivel_alerta_actual in ['amarillo', 'naranja', 'rojo']:
            # Mensaje de alerta si la alerta es amarilla, naranja o roja
            mensaje_telegram = (
                f"⚠️ Alerta: Cambio de nivel de alerta.\n"
                f"Nodo: {str(nodo_id).replace('_', '\\_')}\n"
                f"Tipo: {tipo_legible.replace('_', '\\_')}\n"
                f"Valor: {data_formateada} {unidad_legible.replace('_', '\\_')}\n"
                f"Nuevo Nivel de Alerta: {nivel_alerta_actual.capitalize()}"
            )
            enviar_mensaje_telegram(mensaje_telegram, tipo_legible)
        
        elif nivel_alerta_actual == 'verde' and nivel_alerta_anterior in ['amarillo', 'naranja', 'rojo']:
            # Mensaje de normalización si la alerta vuelve a verde
            mensaje_telegram = (
                f"✅ Alerta finalizada: El estado del nodo {str(nodo_id).replace('_', '\\_')} ha vuelto a la normalidad.\n"
                f"Tipo: {tipo_legible.replace('_', '\\_')}\n"
                f"Valor: {data_formateada} {unidad_legible.replace('_', '\\_')}\n"
                f"Nivel de Alerta: {nivel_alerta_actual.capitalize()}"
            )
            enviar_mensaje_telegram(mensaje_telegram, tipo_legible)
        
        estado_anterior_sensores[nodo_id][tipo] = nivel_alerta_actual  # Actualiza el estado anterior de ese tipo de sensor en el nodo