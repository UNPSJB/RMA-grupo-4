import json
import paho.mqtt.client as mqtt
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from src.database import SessionLocal
from src.models import Mensaje, Variable, Rango
from src.notificaciones.models import Notificacion, Estado_notificacion
from src.example.models import Usuario_preferencias, Usuario,OTP
from src.rma_receptor.validaciones import validar_mensaje, validar_fecha_hora_actual, validar_duplicado
from telegram import Bot
import os
import requests
from dotenv import load_dotenv


load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")

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

            if tipo_mensaje in ['correcto']:
                analizar_notificacion(db, variable.id, mensaje_json)
            

        finally:
            db.close()

    except json.JSONDecodeError:
        print(f"Error: el mensaje no es un JSON válido: {msg.payload}")
    except Exception as e:
        print(f"Error al procesar el mensaje: {e}")

def analizar_notificacion(db: Session, variable, mensaje):
    var = db.query(Variable).filter(Variable.numero == mensaje['type']).first()
    nombre_variable = var.nombre if var else "Desconocido"
    unidad_variable = var.unidad if var else "Desconocido"
    valor_variable = round(float(mensaje['data']), 2)

    rangos_activos = db.query(Rango).filter(
        Rango.variable_id == variable,
        Rango.activo == True 
    ).all()

    color_alerta = None

    # Determina el color de alerta comparando el valor con los rangos activos
    for rango in rangos_activos:
        if rango.min_val <= valor_variable <= rango.max_val:
            color_alerta = rango.color
            break

    # Filtra usuarios interesados en esta alerta según sus preferencias activas
    usuarios_interesados = db.query(Usuario).join(Usuario_preferencias).filter(
        Usuario_preferencias.id_variable == variable,
        Usuario_preferencias.alerta == color_alerta,
        Usuario_preferencias.estado == True
    ).all()

    # Crea notificación solo si hay usuarios interesados
    if usuarios_interesados:
        nueva_notificacion = Notificacion(
            titulo=f"Alerta {color_alerta.upper()} {nombre_variable}",
            mensaje=f"Valor de {valor_variable}{unidad_variable}.",
            creada=datetime.now(),
            id_nodo=mensaje['id']
        )
        db.add(nueva_notificacion)
        db.commit()
        db.refresh(nueva_notificacion)

        # Crea un Estado_notificacion para cada usuario interesado
        for usuario in usuarios_interesados:
            estado_notificacion = Estado_notificacion(
                id_notificacion=nueva_notificacion.id,
                id_usuario=usuario.id,
                estado=False
            )
            db.add(estado_notificacion)

        # Enviar mensajes a los usuarios interesados
        for usuario in usuarios_interesados:
            otp_telegram = db.query(OTP).filter(OTP.id_usuario == usuario.id).first()
            if otp_telegram and otp_telegram.chat_id:
                try:
                    mensaje_telegram = (
                        f"⚠️ {nueva_notificacion.titulo}\n"
                        f"{nueva_notificacion.mensaje}\n"
                        f"Nodo: {mensaje['id']}"
                    )
                    enviar_mensaje_personal(otp_telegram.chat_id, mensaje_telegram)
                except Exception as e:
                    print(f"Error al enviar mensaje a {usuario.id}: {e}")

        db.commit()

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

