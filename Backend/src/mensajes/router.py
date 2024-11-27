from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, time, timezone, timedelta
from collections import defaultdict
from src.database import get_db  
from src.models import Mensaje
from src.mensajes.schemas import (TemperatureData, TemperatureResponse,HumidityResponse,HumidityData,PressureResponse,PressureData,PrecipitationResponse,WaterLevelData,PrecipitationData,WindResponse,WindData,NodeSummary,NodeSummaryResponse,WaterLevelResponse,NodeHistoricalData,HistoricalDataPoint,)
from fastapi.responses import StreamingResponse
from src.example.services import *
from src.nodos.models import *

# Inicializa el router para definir las rutas de este módulo
router = APIRouter() 

@router.get("/clima/temperatura/", response_model=TemperatureResponse)
def get_temperature_data(
    node_id: Optional[int] = Query(None, description="Identificador del nodo"),
    start_time: Optional[datetime] = Query(None, description="Inicio del rango de tiempo (YYYY-MM-DDTHH:MM:SS)"),
    end_time: Optional[datetime] = Query(None, description="Fin del rango de tiempo (YYYY-MM-DDTHH:MM:SS)"),
    limit: Optional[int] = Query(10, description="Número máximo de registros a devolver"),
    sort: Optional[str] = Query("desc", description="Orden de los resultados (asc o desc)"),
    db: Session = Depends(get_db),
    rol: str = Depends(verificar_rol("admin","profesional","cooperativa"))
):
    """
    Endpoint para obtener los datos de temperatura actual e histórica.
    """
    # Valida que el parámetro `sort` sea 'asc' o 'desc'
    if sort not in ["asc", "desc"]:
        raise HTTPException(status_code=400, detail="El parámetro 'sort' debe ser 'asc' o 'desc'.")

    # Ajuste de zona horaria a UTC y eliminación de milisegundos
    if start_time:
        start_time = start_time.replace(tzinfo=timezone.utc, microsecond=0) - timedelta(hours=3)
    if end_time:
        end_time = end_time.replace(tzinfo=timezone.utc, microsecond=0) - timedelta(hours=3)

    # Configuración de la consulta base
    base_query = db.query(Mensaje).filter(
        Mensaje.type == "Temperatura",
        Mensaje.tipo_mensaje == "correcto" 
    )

    if node_id is not None:
        base_query = base_query.filter(Mensaje.id_nodo == node_id)

    if start_time:
        base_query = base_query.filter(Mensaje.time >= start_time)
    if end_time:
        base_query = base_query.filter(Mensaje.time <= end_time)

    # Consulta para calcular el resumen sin límite
    summary_query = base_query.all()
    if not summary_query:
        raise HTTPException(status_code=404, detail="No se encontraron registros para los filtros proporcionados.")

    temperatures = [float(record.data) for record in summary_query]
    summary = {
        "total_records": len(summary_query),
        "max_value": max(temperatures),
        "min_value": min(temperatures),
        "average_value": sum(temperatures) / len(temperatures)
    }

    # Consulta para los datos, aplicando el límite si es necesario
    if sort == "asc":
        data_query = base_query.order_by(Mensaje.time.asc()).limit(limit)
    else:
        data_query = base_query.order_by(Mensaje.time.desc()).limit(limit)

    results = data_query.all()

    response_data = [
        TemperatureData(
            id_nodo=record.id_nodo,
            type=record.type,
            data=record.data,  
            timestamp=record.time  
        ) for record in results
    ]

    return TemperatureResponse(data=response_data, summary=summary)


@router.get("/clima/nivel-agua/", response_model=WaterLevelResponse)
def get_water_level_data(
    node_id: Optional[int] = Query(None, description="Identificador del nodo"),
    start_time: Optional[datetime] = Query(None, description="Inicio del rango de tiempo (YYYY-MM-DDTHH:MM:SS)"),
    end_time: Optional[datetime] = Query(None, description="Fin del rango de tiempo (YYYY-MM-DDTHH:MM:SS)"),
    limit: Optional[int] = Query(10, description="Número máximo de registros a devolver"),
    sort: Optional[str] = Query("desc", description="Orden de los resultados (asc o desc)"),
    db: Session = Depends(get_db),
    rol: str = Depends(verificar_rol("admin", "profesional", "cooperativa"))
):
    """
    Endpoint para obtener los datos de nivel de agua actual e histórico.
    """
    # Valida que el parámetro `sort` sea 'asc' o 'desc'
    if sort not in ["asc", "desc"]:
        raise HTTPException(status_code=400, detail="El parámetro 'sort' debe ser 'asc' o 'desc'.")

    # Ajuste de zona horaria a UTC y eliminación de milisegundos
    if start_time:
        start_time = start_time.replace(tzinfo=timezone.utc, microsecond=0) - timedelta(hours=3)
    if end_time:
        end_time = end_time.replace(tzinfo=timezone.utc, microsecond=0) - timedelta(hours=3)


    # Configuración de la consulta base
    base_query = db.query(Mensaje).filter(
        Mensaje.type == "Nivel de agua",  # Ajuste para nivel de agua
        Mensaje.tipo_mensaje == "correcto"
    )

    if node_id is not None:
        base_query = base_query.filter(Mensaje.id_nodo == node_id)

    if start_time:
        base_query = base_query.filter(Mensaje.time >= start_time)
    if end_time:
        base_query = base_query.filter(Mensaje.time <= end_time)

    # Consulta para calcular el resumen sin límite
    summary_query = base_query.all()
    if not summary_query:
        raise HTTPException(status_code=404, detail="No se encontraron registros para los filtros proporcionados.")

    water_levels = [float(record.data) for record in summary_query]
    summary = {
        "total_records": len(summary_query),
        "max_value": max(water_levels),
        "min_value": min(water_levels),
        "average_value": sum(water_levels) / len(water_levels)
    }

    # Consulta para los datos, aplicando el límite si es necesario
    if sort == "asc":
        data_query = base_query.order_by(Mensaje.time.asc()).limit(limit)
    else:
        data_query = base_query.order_by(Mensaje.time.desc()).limit(limit)

    results = data_query.all()

    response_data = [
        WaterLevelData(
            id_nodo=record.id_nodo,
            type=record.type,
            data=record.data,  
            timestamp=record.time
        ) for record in results
    ]

    return WaterLevelResponse(data=response_data, summary=summary)
# Endpoint para obtener los datos de humedad
@router.get("/clima/humedad/", response_model=HumidityResponse)
def get_humidity_data(
    node_id: Optional[int] = Query(None, description="Identificador del nodo"),
    start_time: Optional[datetime] = Query(None, description="Inicio del rango de tiempo (YYYY-MM-DDTHH:MM:SS)"),
    end_time: Optional[datetime] = Query(None, description="Fin del rango de tiempo (YYYY-MM-DDTHH:MM:SS)"),
    limit: Optional[int] = Query(10, description="Número máximo de registros a devolver"),
    sort: Optional[str] = Query("desc", description="Orden de los resultados (asc o desc)"),
    db: Session = Depends(get_db),
    rol: str = Depends(verificar_rol("admin", "profesional", "cooperativa"))
):
    """
    Endpoint para obtener los datos de humedad actual e histórica.
    """
    if sort not in ["asc", "desc"]:
        raise HTTPException(status_code=400, detail="El parámetro 'sort' debe ser 'asc' o 'desc'.")

    # Ajuste de zona horaria a UTC y eliminación de milisegundos
    if start_time:
        start_time = start_time.replace(tzinfo=timezone.utc, microsecond=0) - timedelta(hours=3)
    if end_time:
        end_time = end_time.replace(tzinfo=timezone.utc, microsecond=0) - timedelta(hours=3)

    query = db.query(Mensaje).filter(
        Mensaje.type == "Humedad",
        Mensaje.tipo_mensaje == "correcto"
    )

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
    db: Session = Depends(get_db),
    rol: str = Depends(verificar_rol("admin", "profesional", "cooperativa"))
):
    """
    Endpoint para obtener los datos de presión actual e histórica.
    """
    if sort not in ["asc", "desc"]:
        raise HTTPException(status_code=400, detail="El parámetro 'sort' debe ser 'asc' o 'desc'.")

    # Ajuste de zona horaria a UTC y eliminación de milisegundos
    if start_time:
        start_time = start_time.replace(tzinfo=timezone.utc, microsecond=0) - timedelta(hours=3)
    if end_time:
        end_time = end_time.replace(tzinfo=timezone.utc, microsecond=0) - timedelta(hours=3)

    query = db.query(Mensaje).filter(
        Mensaje.type == "Presion",
        Mensaje.tipo_mensaje == "correcto"
    )

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
    db: Session = Depends(get_db),
    rol: str = Depends(verificar_rol("admin", "profesional", "cooperativa"))
):
    """
    Endpoint para obtener los datos de precipitación actual e histórica.
    """
    if sort not in ["asc", "desc"]:
        raise HTTPException(status_code=400, detail="El parámetro 'sort' debe ser 'asc' o 'desc'.")

    # Ajuste de zona horaria a UTC y eliminación de milisegundos
    if start_time:
        start_time = start_time.replace(tzinfo=timezone.utc, microsecond=0) - timedelta(hours=3)
    if end_time:
        end_time = end_time.replace(tzinfo=timezone.utc, microsecond=0) - timedelta(hours=3)

    query = db.query(Mensaje).filter(
        Mensaje.type == "Precipitacion",
        Mensaje.tipo_mensaje == "correcto"
    )

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
    db: Session = Depends(get_db),
    rol: str = Depends(verificar_rol("admin", "profesional", "cooperativa"))
):
    """
    Endpoint para obtener los datos de viento actual e histórico.
    """
    if sort not in ["asc", "desc"]:
        raise HTTPException(status_code=400, detail="El parámetro 'sort' debe ser 'asc' o 'desc'.")

    # Ajuste de zona horaria a UTC y eliminación de milisegundos
    if start_time:
        start_time = start_time.replace(tzinfo=timezone.utc, microsecond=0) - timedelta(hours=3)
    if end_time:
        end_time = end_time.replace(tzinfo=timezone.utc, microsecond=0) - timedelta(hours=3)

    query = db.query(Mensaje).filter(
        Mensaje.type == "Viento",
        Mensaje.tipo_mensaje == "correcto"
    )

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
def get_node_summary(db: Session = Depends(get_db), rol: str = Depends(verificar_rol("admin", "profesional", "cooperativa"))):
    """
    Endpoint para obtener el resumen de todos los nodos con el último valor registrado de cada variable.
    Solo incluye mensajes cuyo tipo de mensaje es 'correcto'.
    """
    subquery = (
        db.query(
            Mensaje.id_nodo,
            Mensaje.type,
            Mensaje.data,
            func.max(Mensaje.time).label("latest_time")
        )
        .filter(Mensaje.tipo_mensaje == "correcto")  
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
        "Temperatura": "last_temperature",
        "Humedad": "last_humidity",
        "Presion": "last_pressure",
        "Precipitacion": "last_precipitation",
        "Viento": "last_wind"
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

@router.get("/clima/nodos/resumen/{id_nodo}", response_model=NodeSummaryResponse)
def get_summary(
    id_nodo: str,  # Recibes el id como cadena
    db: Session = Depends(get_db),
):
    """
    Endpoint para obtener el resumen del último valor registrado de cada variable de un nodo específico.
    Solo incluye mensajes cuyo tipo de mensaje es 'correcto'.
    """
    # Convertir id_nodo a entero
    try:
        id_nodo_int = int(id_nodo)  # Convertir a entero
    except ValueError:
        raise HTTPException(status_code=400, detail="El id_nodo debe ser un número entero válido")

    print(f"Recibiendo id_nodo: {id_nodo_int}")

    # Subconsulta para obtener el último mensaje por tipo y nodo
    subquery = (
        db.query(
            Mensaje.type,
            func.max(Mensaje.time).label("latest_time")
        )
        .filter(Mensaje.tipo_mensaje == "correcto", Mensaje.id_nodo == id_nodo_int)
        .group_by(Mensaje.type)
        .subquery()
    )

    # Realiza el join con la subconsulta para obtener los datos más recientes por tipo
    results = (
        db.query(
            Mensaje.id_nodo,
            Mensaje.type,
            Mensaje.data,
            Mensaje.time
        )
        .join(subquery, Mensaje.type == subquery.c.type)
        .filter(
            Mensaje.id_nodo == id_nodo_int,
            Mensaje.time == subquery.c.latest_time
        )
        .all()
    )

    # Si no se encuentran resultados, retornar un error 404
    if not results:
        raise HTTPException(status_code=404, detail="Nodo no encontrado o sin datos correctos.")

    # Estructura para almacenar los datos del nodo
    node_data = {
        "id_nodo": id_nodo_int,
        "last_temperature": None,
        "last_humidity": None,
        "last_pressure": None,
        "last_precipitation": None,
        "last_wind": None,
        "last_update": None
    }

    # Mapeo de los tipos de mensajes a los campos correspondientes
    type_to_field = {
        "Temperatura": "last_temperature",
        "Humedad": "last_humidity",
        "Presion": "last_pressure",
        "Precipitacion": "last_precipitation",
        "Viento": "last_wind"
    }

    # Recorre los resultados y asigna los valores a los campos adecuados
    for record in results:
        if record.type in type_to_field:
            try:
                node_data[type_to_field[record.type]] = float(record.data)
            except ValueError:
                node_data[type_to_field[record.type]] = None

        # Actualiza la fecha de la última medición
        if node_data["last_update"] is None or record.time > node_data["last_update"]:
            node_data["last_update"] = record.time

    # Responde con los datos del nodo en formato de resumen
    summary_response = NodeSummary(**node_data)
    return NodeSummaryResponse(summary=[summary_response])




@router.get("/clima/nodos/historico", response_model=List[NodeHistoricalData])
def get_node_historical_data(
    db: Session = Depends(get_db),
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    variable: Optional[str] = None,
    rol: str = Depends(verificar_rol("admin","invitado","universidad"))
):
    # Mapeo de tipos de variables a campos
    type_to_field = {
        "Temperatura": "temperature",
        "Humedad": "humidity",
        "Presion": "pressure",
        "Precipitacion": "precipitation",
        "Viento": "wind"
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
    ).filter(Mensaje.tipo_mensaje == "correcto")  

    # Aplica filtros de fecha
    if start_date:
        query = query.filter(Mensaje.time >= start_date)
    if end_date:
        query = query.filter(Mensaje.time <= end_date)

    # Aplica filtro de variable
    if variable:
        if variable in type_to_field:
            query = query.filter(Mensaje.type == variable)
        else:
            raise HTTPException(status_code=400, detail="Variable inválida")

    # Obtiene resultados ordenados
    results = query.order_by(Mensaje.id_nodo, Mensaje.type, Mensaje.time).all()

    # Diccionario para almacenar datos agrupados
    node_data = defaultdict(lambda: {
        "id_nodo": None,
        "temperature": defaultdict(list),
        "humidity": defaultdict(list),
        "pressure": defaultdict(list),
        "precipitation": defaultdict(list),
        "wind": defaultdict(list)
    })

    # Agrupa por nodo, tipo y hora
    for record in results:
        node_id = record.id_nodo
        variable_type = record.type
        hourly_timestamp = record.timestamp.replace(minute=0, second=0, microsecond=0)  # Redondea a la hora

        # Convierte el valor a flotante y agrega al acumulador correspondiente
        if variable_type in type_to_field:
            try:
                data_point = float(record.data)
                # Agrega el dato al grupo de la hora redondeada
                node_data[node_id][type_to_field[variable_type]][hourly_timestamp].append(data_point)
                node_data[node_id]["id_nodo"] = node_id
            except ValueError:
                pass  # Ignora datos inválidos

    # Crea respuesta final calculando promedios por hora
    historical_response = []
    for node_id, data in node_data.items():
        # Crea diccionario con datos promediados
        averaged_data = {
            "id_nodo": node_id,
            "temperature": [],
            "humidity": [],
            "pressure": [],
            "precipitation": [],
            "wind": []
        }

        # Calcula el promedio para cada hora
        for variable, hourly_data in data.items():
            if variable != "id_nodo":  # Omite id_nodo en el cálculo
                for timestamp, values in hourly_data.items():
                    # Crea punto de datos promedio
                    if values:  # se asegura de que haya valores
                        avg_value = sum(values) / len(values)
                        averaged_data[variable].append(HistoricalDataPoint(timestamp=timestamp, value=avg_value))

        # Verifica si hay al menos un dato válido para la respuesta
        if any(averaged_data[var] for var in type_to_field.values()):
            historical_response.append(NodeHistoricalData(**averaged_data))

    return historical_response

@router.get("/mensajes/auditoria")
def obtener_mensajes_auditoria(tipo_mensaje: str = None, db: Session = Depends(get_db), rol: str = Depends(verificar_rol("admin"))):
    query = db.query(Mensaje)
    if tipo_mensaje:
        query = query.filter(Mensaje.tipo_mensaje == tipo_mensaje)
    return query.all()

@router.get("/clima/nodos", response_model=List[int])
def get_node_summary(
    db: Session = Depends(get_db), 
    rol: str = Depends(verificar_rol("admin", "profesional", "cooperativa"))
):
    """
    Endpoint para obtener todos los id_nodos únicos con estado ACTIVO.
    """
    # Subquery para obtener los id_nodo únicos de los mensajes
    subquery = (
        db.query(Mensaje.id_nodo)
        .distinct(Mensaje.id_nodo)
        .subquery()
    )

    # Consulta principal con join a la tabla nodos para filtrar por estado
    results = (
        db.query(Nodo.id_nodo)
        .join(subquery, subquery.c.id_nodo == Nodo.id_nodo)
        .filter(Nodo.estado == EstadoNodo.ACTIVO)  # Filtrar nodos activos
        .order_by(Nodo.id_nodo)
        .all()
    )

    # Extraer los id_nodo del resultado
    node_ids = [result.id_nodo for result in results]

    return node_ids
