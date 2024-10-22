from telegram import Bot
import os
import requests
from dotenv import load_dotenv

load_dotenv()

token = os.getenv('TELEGRAM_TOKEN')
chat_id = int(os.getenv('TELEGRAM_CHAT_ID'))  

estado_anterior_sensores = {} # almacena el estado anterior de cada sensor

descripciones_tipos = {
    'temp_t': 'Temperatura',
    'windspd_t': 'Velocidad del viento',
    'rainfall_t': 'Precipitación',
}

unidad_medida = {
    'temp_t': '°C',
    'windspd_t': 'km/h',
    'rainfall_t': 'mm',
}

def enviar_mensaje_telegram(mensaje):
    url = f'https://api.telegram.org/bot{token}/sendMessage'
    
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
        print(f'Respuesta del servidor: {response.text}') 

def determinar_nivel_alerta(tipo, data):
    niveles = {
        'temp_t': [
            (0.0, 30.0, 'verde'),  
            (30.0, 35.0, 'amarillo'),  
            (35.0, 40.0, 'naranja'),  
            (40.0, 50.0, 'rojo')  
        ],
        'windspd_t': [
            (0.0, 64.9, 'verde'),  
            (65.0, 75.0, 'amarillo'),  
            (75.0, 109.9, 'naranja'),  
            (110.0, 140.0, 'rojo')  
        ],
        'rainfall_t': [
            (0.0, 9.9, 'verde'),  
            (10.0, 30.0, 'amarillo'),  
            (30.0, 50.0, 'naranja'),  
            (50.0, 80.0, 'rojo')  
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

    tipo_legible = descripciones_tipos.get(tipo) # Obtiene la descripción amigable del tipo

    # Si el tipo no está definido en el diccionario, no hacemos nada
    if not tipo_legible:
        print(f"Tipo no válido: {tipo}")
        return
    
    unidad_legible = unidad_medida.get(tipo)
    
    nivel_alerta_actual = determinar_nivel_alerta(tipo, data) # Determina el nivel de alerta para ese tipo de sensor

    data_formateada = f"{data:.2f}"

    # Inicializa el nodo en el diccionario si no existe
    if nodo_id not in estado_anterior_sensores:
        estado_anterior_sensores[nodo_id] = {}
    
    nivel_alerta_anterior = estado_anterior_sensores[nodo_id].get(tipo) # Obtiene el estado anterior del sensor específico (tipo) en el nodo

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
            enviar_mensaje_telegram(mensaje_telegram)
        
        elif nivel_alerta_actual == 'verde' and nivel_alerta_anterior in ['amarillo', 'naranja', 'rojo']:
            # Mensaje de normalización si la alerta vuelve a verde
            mensaje_telegram = (
                f"✅ Alerta finalizada: El estado del nodo {str(nodo_id).replace('_', '\\_')} ha vuelto a la normalidad.\n"
                f"Tipo: {tipo_legible.replace('_', '\\_')}\n"
                f"Valor: {data_formateada} {unidad_legible.replace('_', '\\_')}\n"
                f"Nivel de Alerta: {nivel_alerta_actual.capitalize()}"
            )
            enviar_mensaje_telegram(mensaje_telegram)
        
        estado_anterior_sensores[nodo_id][tipo] = nivel_alerta_actual # Actualiza el estado anterior de ese tipo de sensor en el nodo