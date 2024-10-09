from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from src.database import get_db  
from src.models import Mensaje  
from src.mensajes.schemas import TemperatureData, TemperatureResponse  

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
