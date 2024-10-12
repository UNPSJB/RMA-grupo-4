import json
import paho.mqtt.client as mqtt
from datetime import datetime, timedelta
from src.database import SessionLocal
from src.models import Mensaje, MensajeIncorrecto

def validar_mensaje(mensaje_json):    
    # Definir rangos permitidos para cada tipo
    rangos = {
        'temp_t': (0, 45),         # Rango de temperatura en grados Celsius
        'humidity_t': (30, 85),    # Rango de humedad en porcentaje
        'pressure_t': (900, 1100), # Rango de presión en hPa
        'windspd_t': (0, 150),     # Rango de velocidad del viento en km/h
        'rainfall_t': (0, 150),     # Rango de precipitación en mm
        'altitude_t': (0, 2)  
    }
    
    # Obtener el tipo y el dato
    tipo = mensaje_json.get('type')
    try:
        data = float(mensaje_json.get('data'))  # Convertir el valor a float
    except (TypeError, ValueError):
        return False  # Si no se puede convertir a float, el mensaje no es válido
    
    # Verificar si el tipo existe en el diccionario y si el valor está dentro del rango
    if tipo in rangos:
        minimo, maximo = rangos[tipo]
        return minimo <= data <= maximo
    else:
        return False  # Tipo no válido
    
def validar_fecha_hora_actual(timestamp_str):
    """Valida si el timestamp está en UTC y es cercano a la hora actual (dentro de 5 minutos)."""
    try:
        timestamp = datetime.strptime(timestamp_str, "%Y-%m-%d %H:%M:%S.%f")
        ahora = datetime.utcnow() - timedelta(hours=3)
        diferencia = timedelta(minutes=5)
        return ahora - diferencia <= timestamp <= ahora + diferencia
    except ValueError:
        return False
    
def mensaje_recibido(client, userdata, msg):
    """Callback para procesar los mensajes recibidos en los tópicos suscritos."""
    try:
        # Decodificar el mensaje JSON
        mensaje_str = msg.payload.decode().replace("'", '"')
        mensaje_json = json.loads(mensaje_str)
        print(f"Mensaje recibido en {msg.topic}: {mensaje_json}")

        # Crear una sesión de base de datos
        db = SessionLocal()
        try:
            if validar_mensaje(mensaje_json) and validar_fecha_hora_actual(mensaje_json['time']):
            # Crear un nuevo objeto Mensaje
                nuevo_mensaje = Mensaje(
                    id_nodo=mensaje_json['id'],
                    type=mensaje_json['type'],
                    data=mensaje_json['data'],
                    time=datetime.strptime(mensaje_json['time'], "%Y-%m-%d %H:%M:%S.%f")
                )
            else:
                nuevo_mensaje = MensajeIncorrecto(
                    id_nodo=mensaje_json['id'],
                    type=mensaje_json['type'],
                    data=mensaje_json['data'],
                    time=datetime.strptime(mensaje_json['time'], "%Y-%m-%d %H:%M:%S.%f")
                )                         
            db.add(nuevo_mensaje)
            db.commit()
        finally:
            db.close()

    except json.JSONDecodeError:
        print(f"Error: el mensaje no es un JSON válido: {msg.payload}")
    except Exception as e:
        print(f"Error al procesar el mensaje: {e}")
