import os

def obtener_configuracion_mqtt():
    """Función para recuperar la configuración de MQTT desde variables de entorno o valores por defecto."""
    mqtt_config = {
        "host": os.getenv("MQTT_HOST", "localhost"),
        "port": int(os.getenv("MQTT_PORT", 1883)),
        "keepalive": int(os.getenv("MQTT_KEEPALIVE", 60)),
        "topics": os.getenv("MQTT_TOPICS", "test_topic").split(","),  # Recupera los tópicos como una lista separada por comas
    }
    return mqtt_config
