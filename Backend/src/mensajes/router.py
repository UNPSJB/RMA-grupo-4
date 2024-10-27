from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, time
from src.database import get_db  
from src.models import Mensaje, MensajeAuditoria
from src.mensajes.schemas import (
    TemperatureData, 
    TemperatureResponse,
    HumidityResponse,
    HumidityData,
    PressureResponse,
    PressureData,
    PrecipitationResponse,
    PrecipitationData,
    WindResponse,
    WindData,
    NodeSummary,
    NodeSummaryResponse,
    NodeHistoricalData,
    HistoricalDataPoint,
)
from fastapi.responses import StreamingResponse
from src.utils.qr_utils import obtener_enlace_invitacion, generar_qr

# Inicializa el router para definir las rutas de este módulo
router = APIRouter() 

@router.get("/generar_qr_telegram/")
async def generar_qr_telegram():
    """
    Genera un código QR a partir del enlace de invitación del canal de Telegram.
    """
    try:
        enlace_invitacion = obtener_enlace_invitacion()  # Obtiene el enlace del canal
        qr_image = generar_qr(enlace_invitacion)  # Genera QR con el enlace
        
        # Devuelve la imagen como respuesta en formato PNG
        return StreamingResponse(qr_image, media_type="image/png")
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.get("/clima/temperatura/", response_model=TemperatureResponse)
def get_temperature_data(
    node_id: Optional[int] = Query(None, description="Identificador del nodo"),
    start_time: Optional[datetime] = Query(None, description="Inicio del rango de tiempo (YYYY-MM-DDTHH:MM:SS)"),
    end_time: Optional[datetime] = Query(None, description="Fin del rango de tiempo (YYYY-MM-DDTHH:MM:SS)"),
    limit: Optional[int] = Query(10, description="Número máximo de registros a devolver"),
    sort: Optional[str] = Query("desc", description="Orden de los resultados (asc o desc)"),
    db: Session = Depends(get_db)  
):
    """
    Endpoint para obtener los datos de temperatura actual e histórica.
    """
    # Valida que el parámetro `sort` sea 'asc' o 'desc'
    if sort not in ["asc", "desc"]:
        raise HTTPException(status_code=400, detail="El parámetro 'sort' debe ser 'asc' o 'desc'.")

    # Construye la consulta base a la tabla Mensaje
    query = db.query(Mensaje).filter(Mensaje.type == "temp_t")

    # Agrega filtro por `node_id` si se proporciona
    if node_id is not None:
        query = query.filter(Mensaje.id_nodo == node_id)

    # Agrega filtro por `start_time` y `end_time` si se proporcionan
    if start_time:
        query = query.filter(Mensaje.time >= start_time)
    if end_time:
        query = query.filter(Mensaje.time <= end_time)

    # Ordena los resultados por `time`
    if sort == "asc":
        query = query.order_by(Mensaje.time.asc())
    else:
        query = query.order_by(Mensaje.time.desc())

    query = query.limit(limit) # Limitar el número de resultados

    results = query.all() # Ejecutar la consulta y obtener los resultados

    # Verificar si se encontraron registros
    if not results:
        raise HTTPException(status_code=404, detail="No se encontraron registros para los filtros proporcionados.")

    # Calcular el resumen de los resultados
    temperatures = [float(record.data) for record in results]  
    summary = {
        "total_records": len(results),
        "max_value": max(temperatures),
        "min_value": min(temperatures),
        "average_value": sum(temperatures) / len(temperatures)
    }

    # Formatear los datos de la respuesta
    response_data = [
        TemperatureData(
            id_nodo=record.id_nodo,
            type=record.type,
            data=record.data,  
            timestamp=record.time  
        ) for record in results
    ]

    # Devolver la respuesta formateada
    return TemperatureResponse(data=response_data, summary=summary)

# Endpoint para obtener los datos de humedad
@router.get("/clima/humedad/", response_model=HumidityResponse)
def get_humidity_data(
    node_id: Optional[int] = Query(None, description="Identificador del nodo"),
    start_time: Optional[datetime] = Query(None, description="Inicio del rango de tiempo (YYYY-MM-DDTHH:MM:SS)"),
    end_time: Optional[datetime] = Query(None, description="Fin del rango de tiempo (YYYY-MM-DDTHH:MM:SS)"),
    limit: Optional[int] = Query(10, description="Número máximo de registros a devolver"),
    sort: Optional[str] = Query("desc", description="Orden de los resultados (asc o desc)"),
    db: Session = Depends(get_db)  
):
    """
    Endpoint para obtener los datos de humedad actual e histórica.
    """
    if sort not in ["asc", "desc"]:
        raise HTTPException(status_code=400, detail="El parámetro 'sort' debe ser 'asc' o 'desc'.")

    query = db.query(Mensaje).filter(Mensaje.type == "humidity_t")

    if node_id is not None:
        query = query.filter(Mensaje.id_nodo == node_id)

    if start_time:
        query = query.filter(Mensaje.time >= start_time)
    if end_time:
        query = query.filter(Mensaje.time <= end_time)

    if sort == "asc":
        query = query.order_by(Mensaje.time.asc())
    else:
        query = query.order_by(Mensaje.time.desc())

    query = query.limit(limit)

    results = query.all()

    if not results:
        raise HTTPException(status_code=404, detail="No se encontraron registros para los filtros proporcionados.")

    humidities = [float(record.data) for record in results]
    summary = {
        "total_records": len(results),
        "max_value": max(humidities),
        "min_value": min(humidities),
        "average_value": sum(humidities) / len(humidities)
    }

    response_data = [
        HumidityData(
            id_nodo=record.id_nodo,
            type=record.type,
            data=record.data,  
            timestamp=record.time  
        ) for record in results
    ]

    return HumidityResponse(data=response_data, summary=summary)


# Endpoint para obtener los datos de presión
@router.get("/clima/presion/", response_model=PressureResponse)
def get_pressure_data(
    node_id: Optional[int] = Query(None, description="Identificador del nodo"),
    start_time: Optional[datetime] = Query(None, description="Inicio del rango de tiempo (YYYY-MM-DDTHH:MM:SS)"),
    end_time: Optional[datetime] = Query(None, description="Fin del rango de tiempo (YYYY-MM-DDTHH:MM:SS)"),
    limit: Optional[int] = Query(10, description="Número máximo de registros a devolver"),
    sort: Optional[str] = Query("desc", description="Orden de los resultados (asc o desc)"),
    db: Session = Depends(get_db)  
):
    """
    Endpoint para obtener los datos de presión actual e histórica.
    """
    if sort not in ["asc", "desc"]:
        raise HTTPException(status_code=400, detail="El parámetro 'sort' debe ser 'asc' o 'desc'.")
        
    query = db.query(Mensaje).filter(Mensaje.type == "pressure_t")

    if node_id is not None:
        query = query.filter(Mensaje.id_nodo == node_id)

    if start_time:
        query = query.filter(Mensaje.time >= start_time)
    if end_time:
        query = query.filter(Mensaje.time <= end_time)

    if sort == "asc":
        query = query.order_by(Mensaje.time.asc())
    else:
        query = query.order_by(Mensaje.time.desc())

    query = query.limit(limit)

    results = query.all()

    if not results:
        raise HTTPException(status_code=404, detail="No se encontraron registros para los filtros proporcionados.")

    pressures = [float(record.data) for record in results]
    summary = {
        "total_records": len(results),
        "max_value": max(pressures),
        "min_value": min(pressures),
        "average_value": sum(pressures) / len(pressures)
    }

    response_data = [
        PressureData(
            id_nodo=record.id_nodo,
            type=record.type,
            data=record.data,  
            timestamp=record.time  
        ) for record in results
    ]

    return PressureResponse(data=response_data, summary=summary)


# Endpoint para obtener los datos de precipitación
@router.get("/clima/precipitacion/", response_model=PrecipitationResponse)
def get_precipitation_data(
    node_id: Optional[int] = Query(None, description="Identificador del nodo"),
    start_time: Optional[datetime] = Query(None, description="Inicio del rango de tiempo (YYYY-MM-DDTHH:MM:SS)"),
    end_time: Optional[datetime] = Query(None, description="Fin del rango de tiempo (YYYY-MM-DDTHH:MM:SS)"),
    limit: Optional[int] = Query(10, description="Número máximo de registros a devolver"),
    sort: Optional[str] = Query("desc", description="Orden de los resultados (asc o desc)"),
    db: Session = Depends(get_db)  
):
    """
    Endpoint para obtener los datos de precipitación actual e histórica.
    """
    if sort not in ["asc", "desc"]:
        raise HTTPException(status_code=400, detail="El parámetro 'sort' debe ser 'asc' o 'desc'.")

    query = db.query(Mensaje).filter(Mensaje.type == "rainfall_t")

    if node_id is not None:
        query = query.filter(Mensaje.id_nodo == node_id)

    if start_time:
        query = query.filter(Mensaje.time >= start_time)
    if end_time:
        query = query.filter(Mensaje.time <= end_time)

    if sort == "asc":
        query = query.order_by(Mensaje.time.asc())
    else:
        query = query.order_by(Mensaje.time.desc())

    query = query.limit(limit)

    results = query.all()

    if not results:
        raise HTTPException(status_code=404, detail="No se encontraron registros para los filtros proporcionados.")

    precipitations = [float(record.data) for record in results]
    summary = {
        "total_records": len(results),
        "max_value": max(precipitations),
        "min_value": min(precipitations),
        "average_value": sum(precipitations) / len(precipitations)
    }

    response_data = [
        PrecipitationData(
            id_nodo=record.id_nodo,
            type=record.type,
            data=record.data,  
            timestamp=record.time  
        ) for record in results
    ]

    return PrecipitationResponse(data=response_data, summary=summary)


# Endpoint para obtener los datos de viento
@router.get("/clima/viento/", response_model=WindResponse)
def get_wind_data(
    node_id: Optional[int] = Query(None, description="Identificador del nodo"),
    start_time: Optional[datetime] = Query(None, description="Inicio del rango de tiempo (YYYY-MM-DDTHH:MM:SS)"),
    end_time: Optional[datetime] = Query(None, description="Fin del rango de tiempo (YYYY-MM-DDTHH:MM:SS)"),
    limit: Optional[int] = Query(10, description="Número máximo de registros a devolver"),
    sort: Optional[str] = Query("desc", description="Orden de los resultados (asc o desc)"),
    db: Session = Depends(get_db)  
):
    """
    Endpoint para obtener los datos de viento actual e histórica.
    """
    if sort not in ["asc", "desc"]:
        raise HTTPException(status_code=400, detail="El parámetro 'sort' debe ser 'asc' o 'desc'.")

    query = db.query(Mensaje).filter(Mensaje.type == "windspd_t")

    if node_id is not None:
        query = query.filter(Mensaje.id_nodo == node_id)

    if start_time:
        query = query.filter(Mensaje.time >= start_time)
    if end_time:
        query = query.filter(Mensaje.time <= end_time)

    if sort == "asc":
        query = query.order_by(Mensaje.time.asc())
    else:
        query = query.order_by(Mensaje.time.desc())

    query = query.limit(limit)

    results = query.all()

    if not results:
        raise HTTPException(status_code=404, detail="No se encontraron registros para los filtros proporcionados.")

    winds = [float(record.data) for record in results]
    summary = {
        "total_records": len(results),
        "max_value": max(winds),
        "min_value": min(winds),
        "average_value": sum(winds) / len(winds)
    }

    response_data = [
        WindData(
            id_nodo=record.id_nodo,
            type=record.type,
            data=record.data,  
            timestamp=record.time  
        ) for record in results
    ]

    return WindResponse(data=response_data, summary=summary)

@router.get("/clima/nodos/resumen", response_model=NodeSummaryResponse)
def get_node_summary(db: Session = Depends(get_db)):
    """
    Endpoint para obtener el resumen de todos los nodos con el último valor registrado de cada variable.
    """
    subquery = (
        db.query(
            Mensaje.id_nodo,
            Mensaje.type,
            Mensaje.data,
            func.max(Mensaje.time).label("latest_time")
        )
        .group_by(Mensaje.id_nodo, Mensaje.type)
        .subquery()
    )

    results = (
        db.query(
            subquery.c.id_nodo,
            subquery.c.type,
            subquery.c.data,
            subquery.c.latest_time.label("time")
        )
        .order_by(subquery.c.id_nodo, subquery.c.type)
        .all()
    )

    node_data = {}
    type_to_field = {
        "temp_t": "last_temperature",
        "humidity_t": "last_humidity",
        "pressure_t": "last_pressure",
        "rainfall_t": "last_precipitation",
        "windspd_t": "last_wind"
    }

    for record in results:
        node_id = record.id_nodo
        if node_id not in node_data:
            node_data[node_id] = {
                "id_nodo": node_id,
                "last_temperature": None,
                "last_humidity": None,
                "last_pressure": None,
                "last_precipitation": None,
                "last_wind": None,
                "last_update": None
            }

        if record.type in type_to_field:
            try:
                node_data[node_id][type_to_field[record.type]] = float(record.data)
            except ValueError:
                node_data[node_id][type_to_field[record.type]] = None

        if node_data[node_id]["last_update"] is None or record.time > node_data[node_id]["last_update"]:
            node_data[node_id]["last_update"] = record.time

    summary_response = [
        NodeSummary(**data) for data in node_data.values()
    ]

    return NodeSummaryResponse(summary=summary_response)

@router.get("/clima/nodos/historico", response_model=List[NodeHistoricalData])
def get_node_historical_data(
    db: Session = Depends(get_db),
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    variable: Optional[str] = None
):
    # Mapeo de tipos de variables a campos
    type_to_field = {
        "temp_t": "temperature",
        "humidity_t": "humidity",
        "pressure_t": "pressure",
        "rainfall_t": "precipitation",
        "windspd_t": "wind"
    }

    # Ajustes de fechas (sin cambios)
    if start_date:
        if start_date == start_date.date():
            start_date = datetime.combine(start_date, time.min)
    if end_date:
        if end_date == end_date.date():
            end_date = datetime.combine(end_date, time.max)

    # Query base
    query = db.query(
        Mensaje.id_nodo,
        Mensaje.type,
        Mensaje.data,
        Mensaje.time.label("timestamp")
    )

    # Aplicar filtros de fecha
    if start_date:
        query = query.filter(Mensaje.time >= start_date)
    if end_date:
        query = query.filter(Mensaje.time <= end_date)

    # Aplicar filtro de variable
    if variable:
        if variable in type_to_field:
            query = query.filter(Mensaje.type == variable)
        else:
            raise HTTPException(status_code=400, detail="Variable inválida")

    results = query.order_by(Mensaje.id_nodo, Mensaje.type, Mensaje.time).all()

    node_data = {}

    for record in results:
        node_id = record.id_nodo
        if node_id not in node_data:
            node_data[node_id] = {
                "id_nodo": node_id,
                "temperature": [],
                "humidity": [],
                "pressure": [],
                "precipitation": [],
                "wind": []
            }

        if record.type in type_to_field:
            try:
                data_point = HistoricalDataPoint(
                    timestamp=record.timestamp,
                    value=float(record.data)
                )
                node_data[node_id][type_to_field[record.type]].append(data_point)
            except ValueError:
                pass  # Ignora datos inválidos

    # Filtrar nodos sin datos
    historical_response = []
    for data in node_data.values():
        # Verifica si hay al menos un valor válido para la variable seleccionada
        if any(data[var] for var in type_to_field.values()):
            historical_response.append(NodeHistoricalData(**data))

    return historical_response


@router.get("/mensajes/auditoria")
def obtener_mensajes_auditoria(tipo_mensaje: str = None, db: Session = Depends(get_db)):
    query = db.query(MensajeAuditoria)
    if tipo_mensaje:
        query = query.filter(MensajeAuditoria.tipo_mensaje == tipo_mensaje)
    return query.all()