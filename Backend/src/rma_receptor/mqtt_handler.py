import json
import paho.mqtt.client as mqtt
from datetime import datetime
from src.database import SessionLocal
from src.models import Mensaje, MensajeIncorrecto

def validar_mensaje(mensaje_json):
    """Valida el mensaje basado en el 'type' y los datos 'data'."""
    tipo = mensaje_json.get('type')
    data =  float(mensaje_json.get('data'))
        
    if tipo == 'temp_t':
        # Definir rango de temperatura (por ejemplo, 0 a 50 grados Celsius)
        temperatura_minima = 0
        temperatura_maxima = 45
        
        # Verificar si el valor de la temperatura está dentro del rango
        if temperatura_minima <= data <= temperatura_maxima:
            return True  # Mensaje válido
        else:
            return False  # Mensaje inválido (fuera del rango)
    
    # Puedes agregar más validaciones para otros tipos de mensajes aquí
    return True  # Si el 'type' no es temperatura, asumimos que es válido
    

def mensaje_recibido(client, userdata, msg):
    """Callback para procesar los mensajes recibidos en los tópicos suscritos."""

    try:
        print(f"Mensaje crudo recibido: {msg.payload}")
        # Decodificar el mensaje JSON
        mensaje_str = msg.payload.decode().replace("'", '"')
        mensaje_json = json.loads(mensaje_str)
        print(f"Mensaje recibido en el tópico {msg.topic}: {mensaje_json}")

        # Crear una sesión de base de datos
        db = SessionLocal()
        try:
            if validar_mensaje(mensaje_json):
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
