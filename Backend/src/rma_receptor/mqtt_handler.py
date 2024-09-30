import json
import paho.mqtt.client as mqtt
from datetime import datetime
from src.database import SessionLocal
from src.models import Mensaje

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
            # Crear un nuevo objeto Mensaje
            nuevo_mensaje = Mensaje(
                id_nodo=mensaje_json['id'],
                type=mensaje_json['type'],
                data=mensaje_json['data'],
                time=datetime.strptime(mensaje_json['time'], "%Y-%m-%d %H:%M:%S.%f")
            )
            
            # Añadir y confirmar el nuevo mensaje en la base de datos
            db.add(nuevo_mensaje)
            db.commit()
            print(f"Mensaje guardado en la base de datos con ID: {nuevo_mensaje.id}")
        finally:
            db.close()

    except json.JSONDecodeError:
        print(f"Error: el mensaje no es un JSON válido: {msg.payload}")
    except Exception as e:
        print(f"Error al procesar el mensaje: {e}")
