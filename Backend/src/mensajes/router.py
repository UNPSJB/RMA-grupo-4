from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Float
from datetime import datetime, timedelta, timezone
from src.database import get_db
from src.models import Mensaje
from typing import List, Optional

router = APIRouter()

@router.get("/mensajes")
def get_messages(
    db: Session = Depends(get_db),
    id_nodo: Optional[int] = Query(None, description="ID del nodo"),
    type: Optional[str] = Query(None, description="Tipo de mensaje"),
    time_range: str = Query("1h", description="Rango de tiempo (1h, 24h, 7d)")
):
    """
    Obtiene los mensajes agrupados en intervalos de 10 minutos,
    con opción de filtrar por nodo, tipo y rango de tiempo.
    """
    # Obtener la fecha y hora actual en UTC
    now = datetime.utcnow().replace(tzinfo=timezone.utc)

    # Definir el tiempo de inicio basado en el rango de tiempo
    if time_range == "1h":
        start_time = now - timedelta(hours=1)
    elif time_range == "24h":
        start_time = now - timedelta(days=1)
    elif time_range == "7d":
        start_time = now - timedelta(days=7)
    else:
        start_time = now - timedelta(hours=1)  # Por defecto, última hora

    print(f"Tiempo de inicio: {start_time.isoformat()}")
    print(f"Tiempo actual: {now.isoformat()}")

    # Ajuste de la zona horaria (por ejemplo, UTC-3 para Argentina)
    utc_offset = timedelta(hours=-3)  # Cambiar según tu zona horaria local
    adjusted_start_time = start_time + utc_offset
    adjusted_now = now + utc_offset

    # Construir la consulta base
    query = db.query(
        Mensaje.id_nodo,
        Mensaje.type,
        func.strftime('%Y-%m-%d %H:%M', Mensaje.time).label('time_interval'),
        func.avg(cast(Mensaje.data, Float)).label('avg_data')
    ).filter(Mensaje.time >= adjusted_start_time)

    # Aplicar filtros adicionales si se proporcionan
    if id_nodo is not None:
        query = query.filter(Mensaje.id_nodo == id_nodo)
    if type is not None:
        query = query.filter(Mensaje.type == type)

    # Agrupar y ordenar los resultados
    mensajes = query.group_by(
        Mensaje.id_nodo,
        Mensaje.type,
        func.strftime('%Y-%m-%d %H:%M', Mensaje.time)
    ).order_by(Mensaje.time).all()

    print(f"Mensajes recuperados: {len(mensajes)}")
    if len(mensajes) == 0:
        print("No se encontraron mensajes. Verificando datos más antiguos...")

        # Intenta obtener el mensaje más reciente sin filtro de tiempo
        ultimo_mensaje = db.query(Mensaje).order_by(Mensaje.time.desc()).first()
        if ultimo_mensaje:
            print(f"Último mensaje en la base de datos: {ultimo_mensaje.time}")
        else:
            print("No hay mensajes en la base de datos.")

    # Convertir a un formato de lista para enviar como JSON
    result = [
        {
            "id_nodo": m.id_nodo,
            "type": m.type,
            "time": m.time_interval,
            "data": float(m.avg_data) if m.avg_data is not None else None
        } for m in mensajes
    ]

    return result

#------------------------------------------------------------
@router.get("/clima/temperatura")
def get_temperatura(
    db: Session = Depends(get_db),
    id_nodo: Optional[int] = Query(None, description="ID del nodo"),
    time_range: str = Query("1h", description="Rango de tiempo (1h, 24h, 7d)")
):
    """
    Obtiene las lecturas de temperatura agrupadas en intervalos de 10 minutos.
    """
    # Se reutiliza la lógica para obtener el rango de tiempo y la consulta base.
    now = datetime.utcnow().replace(tzinfo=timezone.utc)
    start_time = now - timedelta(hours=1) if time_range == "1h" else (
        now - timedelta(days=1) if time_range == "24h" else now - timedelta(days=7)
    )
    utc_offset = timedelta(hours=-3)  # Ajuste de zona horaria, cambiar según sea necesario
    adjusted_start_time = start_time + utc_offset
    adjusted_now = now + utc_offset

    query = db.query(
        Mensaje.id_nodo,
        func.strftime('%Y-%m-%d %H:%M', Mensaje.time).label('time_interval'),
        func.avg(cast(Mensaje.data, Float)).label('avg_temperatura')
    ).filter(Mensaje.time >= adjusted_start_time, Mensaje.type == "temp_t")#temperatura

    if id_nodo is not None:
        query = query.filter(Mensaje.id_nodo == id_nodo)

    mensajes = query.group_by(
        Mensaje.id_nodo,
        func.strftime('%Y-%m-%d %H:%M', Mensaje.time)
    ).order_by(Mensaje.time).all()

    return [
        {"id_nodo": m.id_nodo, "time": m.time_interval, "temperatura": float(m.avg_temperatura)}
        for m in mensajes
    ]
