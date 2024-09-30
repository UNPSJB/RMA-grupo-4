import os
import paho.mqtt.client as paho
from dotenv import load_dotenv
from src.rma_receptor.mqtt_handler import mensaje_recibido  # Importamos el handler de mensajes
from src.rma_receptor.mqtt_config import obtener_configuracion_mqtt  # Importamos la configuración de MQTT

# Cargar las variables de entorno
load_dotenv()

# Definir un cliente MQTT global para toda la aplicación
client = paho.Client()

def conectar_mqtt():
    """Función para conectar el cliente MQTT al broker."""
    config = obtener_configuracion_mqtt()  # Recuperar configuración desde un módulo separado
    client.connect(config["host"], config["port"], config["keepalive"])
    print(f"Conectado al broker MQTT en {config['host']}:{config['port']}")

    # Suscribirse a los tópicos indicados
    for topic in config["topics"]:
        client.subscribe(topic)
        print(f"Suscripción exitosa al tópico: {topic}")

    # Asignar el callback para manejo de mensajes
    client.on_message = mensaje_recibido

    # Iniciar el loop del cliente MQTT en segundo plano
    client.loop_start()

def detener_mqtt():
    """Función para detener y desconectar el cliente MQTT."""
    client.loop_stop()
    client.disconnect()
    print("Cliente MQTT desconectado.")
