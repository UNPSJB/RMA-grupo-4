from datetime import datetime, timedelta
from src.models import Mensaje

def validar_mensaje(mensaje_json):    
    # Definir rangos permitidos para cada tipo
    rangos = {
        'temp_t': (0, 45),         # Rango de temperatura en grados Celsius
        'humidity_t': (30, 85),    # Rango de humedad en porcentaje HUMIDITY_T
        'pressure_t': (900, 1100), # Rango de presión en hPa
        'windspd_t': (0, 150),     # Rango de velocidad del viento en km/h
        'rainfall_t': (0, 150),     # Rango de precipitación en mm
        'altitude_t': (0, 2),
        'voltage_t': (10, 14)  
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
    
def validar_duplicado(db, mensaje_json):
    return db.query(Mensaje).filter(
        Mensaje.id_nodo == mensaje_json['id'],
        Mensaje.type == mensaje_json['type'],
        Mensaje.data == mensaje_json['data'],
        Mensaje.time == datetime.strptime(mensaje_json['time'], "%Y-%m-%d %H:%M:%S.%f")
    ).first() is not None