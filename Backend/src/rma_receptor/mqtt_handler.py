import json
import paho.mqtt.client as mqtt
from datetime import datetime, timedelta
from src.database import SessionLocal
from src.models import Mensaje, Variable
from src.rma_receptor.validaciones import validar_mensaje, validar_fecha_hora_actual, validar_duplicado
from src.rma_receptor.telegram_bot import analizar_alerta
    
def mensaje_recibido(client, userdata, msg):
    """Callback para procesar los mensajes recibidos en los tópicos suscritos."""
    try:
        # Decodificar el mensaje JSON
        mensaje_str = msg.payload.decode().replace("'", '"')
        mensaje_json = json.loads(mensaje_str)
        print(f"Mensaje recibido en {msg.topic}: {mensaje_json}")

        # Convertir el timestamp Unix a datetime
        time_received = datetime.fromtimestamp(mensaje_json['time'])

        # Crear una sesión de base de datos
        db = SessionLocal()
        try:
            # Obtener la variable desde la base de datos
            variable = db.query(Variable).filter(Variable.numero == mensaje_json['type']).first()
            nombre_variable = variable.nombre if variable else "Desconocido"
            
            # Verificar si el mensaje es duplicado
            if validar_duplicado(db, mensaje_json):
                tipo_mensaje = 'duplicado'
            elif validar_mensaje(mensaje_json) and validar_fecha_hora_actual(time_received):
                tipo_mensaje = 'correcto'
            else:
                tipo_mensaje = 'incorrecto'

            # Crear y guardar el mensaje en la base de datos
            nuevo_mensaje = Mensaje(
                id_nodo=mensaje_json['id'],
                type=nombre_variable,
                data=mensaje_json['data'],
                time=time_received,
                tipo_mensaje=tipo_mensaje
            )
            db.add(nuevo_mensaje)
            db.commit()
            
            def mensaje_to_dict(mensaje):
                return {
                    'id': mensaje.id_nodo,
                    'type': mensaje.type,
                    'data': mensaje.data,
                    'time': mensaje.time.timestamp(),
                    'tipo_mensaje': mensaje.tipo_mensaje
                }

            if nuevo_mensaje.type in ['Nivel de agua', 'Bateria']:
                mensaje_json = mensaje_to_dict(nuevo_mensaje)  
                analizar_alerta(mensaje_json)

        finally:
            db.close()

    except json.JSONDecodeError:
        print(f"Error: el mensaje no es un JSON válido: {msg.payload}")
    except Exception as e:
        print(f"Error al procesar el mensaje: {e}")
