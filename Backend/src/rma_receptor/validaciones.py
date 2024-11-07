from datetime import datetime, timedelta
from src.models import Mensaje

def validar_mensaje(mensaje_json):    
    # Definir rangos permitidos para cada tipo
    rangos = {
        1: (0, 45),         # Rango de temperatura en grados Celsius
        3: (30, 85),    # Rango de humedad en porcentaje HUMIDITY_T
        4: (900, 1100), # Rango de presión en hPa
        12: (0, 150),     # Rango de velocidad del viento en km/h
        14: (0, 150),     # Rango de precipitación en mm
        16: (10, 14),  # bateria
        25: (0, 200)      # nivel del agua
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
    
def validar_fecha_hora_actual(timestamp):
    """Valida si el timestamp está en UTC y es cercano a la hora actual (dentro de 5 minutos)."""
    try:
        ahora = datetime.utcnow() - timedelta(hours=3)
        diferencia = timedelta(minutes=5)
        return ahora - diferencia <= timestamp <= ahora + diferencia
    except TypeError:
        return False
    
def validar_duplicado(db, mensaje_json):
    return db.query(Mensaje).filter(
        Mensaje.id_nodo == mensaje_json['id'],
        Mensaje.type == mensaje_json['type'],
        Mensaje.data == mensaje_json['data'],
        Mensaje.time == datetime.fromtimestamp(mensaje_json['time'])
    ).first() is not None