import json
import paho.mqtt.client as mqtt
from datetime import datetime, timedelta
from src.database import SessionLocal
from src.models import Mensaje, MensajeIncorrecto, MensajeAuditoria
from src.rma_receptor.validaciones import validar_mensaje, validar_fecha_hora_actual, validar_duplicado
from src.rma_receptor.telegram_bot import analizar_alerta
    
    
    
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
            if validar_duplicado(db,mensaje_json):
                nuevo_mensaje1 = MensajeAuditoria(
                    id_nodo=mensaje_json['id'],
                    type=mensaje_json['type'],
                    data=mensaje_json['data'],
                    time=datetime.strptime(mensaje_json['time'], "%Y-%m-%d %H:%M:%S.%f"),
                    tipo_mensaje= 'duplicado'
                )
                analizar_alerta(mensaje_json)
            if validar_mensaje(mensaje_json) and validar_fecha_hora_actual(mensaje_json['time']):
            # Crear un nuevo objeto Mensaje
                nuevo_mensaje = Mensaje(
                    id_nodo=mensaje_json['id'],
                    type=mensaje_json['type'],
                    data=mensaje_json['data'],
                    time=datetime.strptime(mensaje_json['time'], "%Y-%m-%d %H:%M:%S.%f")
                )
                nuevo_mensaje1 = MensajeAuditoria(
                    id_nodo=mensaje_json['id'],
                    type=mensaje_json['type'],
                    data=mensaje_json['data'],
                    time=datetime.strptime(mensaje_json['time'], "%Y-%m-%d %H:%M:%S.%f"),
                    tipo_mensaje= 'correcto'
                )
                analizar_alerta(mensaje_json)
            else:
                nuevo_mensaje = MensajeIncorrecto(
                    id_nodo=mensaje_json['id'],
                    type=mensaje_json['type'],
                    data=mensaje_json['data'],
                    time=datetime.strptime(mensaje_json['time'], "%Y-%m-%d %H:%M:%S.%f")
                )
                nuevo_mensaje1 = MensajeAuditoria(
                    id_nodo=mensaje_json['id'],
                    type=mensaje_json['type'],
                    data=mensaje_json['data'],
                    time=datetime.strptime(mensaje_json['time'], "%Y-%m-%d %H:%M:%S.%f"),
                    tipo_mensaje= 'incorrecto'
                )                         
            db.add(nuevo_mensaje)
            db.add(nuevo_mensaje1)
            db.commit()
        finally:
            db.close()

    except json.JSONDecodeError:
        print(f"Error: el mensaje no es un JSON válido: {msg.payload}")
    except Exception as e:
        print(f"Error al procesar el mensaje: {e}")
