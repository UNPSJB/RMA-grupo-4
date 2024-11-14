from datetime import datetime, timedelta
from src.models import Mensaje
from src.database import SessionLocal
from src.models import Variable

def obtener_rango(tipo):
    session = SessionLocal()
    try:
        variable = session.query(Variable).filter(Variable.numero == tipo).first()
        if variable:
            return variable.minimo, variable.maximo
        else:
            return None  
    finally:
        session.close()
        
def validar_mensaje(mensaje_json):    
    # Obtener el tipo y el dato
    tipo = mensaje_json.get('type')
    try:
        data = float(mensaje_json.get('data'))  # Convertir el valor a float
    except (TypeError, ValueError):
        return False  # Si no se puede convertir a float, el mensaje no es válido
    
    rango = obtener_rango(tipo)
    
    if rango:
        minimo, maximo = rango
        return minimo <= data <= maximo  # Verificar si el dato está dentro del rango
    else:
        return False  # Tipo no válido o rango no encontrado en la base de datos
    
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