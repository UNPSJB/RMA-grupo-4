from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from src.database import get_db  
from src.models import Mensaje  
from .schemas import (
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
)
# Inicializa el router para definir las rutas de este módulo
router = APIRouter() 

@router.get("/clima/temperatura/", response_model=TemperatureResponse)
def get_temperature_data(
    node_id: Optional[int] = Query(None, description="Identificador del nodo"),
    start_time: Optional[datetime] = Query(None, description="Inicio del rango de tiempo (YYYY-MM-DDTHH:MM:SS)"),
    end_time: Optional[datetime] = Query(None, description="Fin del rango de tiempo (YYYY-MM-DDTHH:MM:SS)"),
    limit: Optional[int] = Query(10, description="Número máximo de registros a devolver"),
    sort: Optional[str] = Query("asc", description="Orden de los resultados (asc o desc)"),
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
    sort: Optional[str] = Query("asc", description="Orden de los resultados (asc o desc)"),
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
    sort: Optional[str] = Query("asc", description="Orden de los resultados (asc o desc)"),
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
    sort: Optional[str] = Query("asc", description="Orden de los resultados (asc o desc)"),
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
    sort: Optional[str] = Query("asc", description="Orden de los resultados (asc o desc)"),
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