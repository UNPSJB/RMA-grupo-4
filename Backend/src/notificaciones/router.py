from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from src.notificaciones import models, exceptions
from src.notificaciones.services import *
from src.notificaciones.schemas import *

router = APIRouter()

@router.post("/CrearNotificacion", response_model=RespuestaNotificacion)
def crear_notificacion_router(notificacion: CrearNotificacion, db: Session = Depends(get_db)):
    db_notificacion = get_notificacion_por_id(db, id=notificacion.id)
    if db_notificacion:
        raise HTTPException(status_code=400, detail="Ya existe una notificacion con ese id")
    return crear_notificacion(db=db, notificacion_data=notificacion)  # Cambié 'notificacion' por 'notificacion_data'


@router.put("/modificar_datos_notificacion/{id}", response_model=RespuestaNotificacion)
def modificar_datos_notificacion(id: int, datos: ModificarNotificacion, db: Session = Depends(get_db)):
    db_notificacion = get_notificacion_por_id(db, id)  # Cambiar a la función que busca por ID
    if db_notificacion is None:
        raise HTTPException(status_code=404, detail="Notificacion no encontrada")
    
    # Llamamos a la función de servicio para modificar el nodo
    notificacion_modificada = modificar_notificacion(db, db_notificacion, datos)
    
    return notificacion_modificada

@router.post("/crear_estado_notificacion", response_model=CrearEstadoNotificacion)
def crear_estado_notificacion(estado_data: CrearEstadoNotificacion, db: Session = Depends(get_db)):
    db_estado = db.query(Estado_notificacion).filter(
        Estado_notificacion.id_notificacion == estado_data.id_notificacion,
        Estado_notificacion.id_usuario == estado_data.id_usuario
    ).first()
    if db_estado:
        raise exceptions.EstadoNotificacionExistenteError("Ya existe un estado de notificación para este usuario.")
    db_estado = Estado_notificacion(
        id_notificacion=estado_data.id_notificacion,
        id_usuario=estado_data.id_usuario,
        estado=estado_data.estado,
        leido_el=estado_data.leido_el
    )
    db.add(db_estado)
    db.commit()
    db.refresh(db_estado)
    return db_estado

# Endpoint para modificar el estado de una notificación
@router.put("/modificar_estado_notificacion/{id_notificacion}/{id_usuario}", response_model=ModificarEstadoNotificacion)
def modificar_estado_notificacion_endpoint(id_notificacion: int, id_usuario: int, datos: ModificarEstadoNotificacion, db: Session = Depends(get_db)):
    estado = get_estado_notificacion_por_usuario(db, id_notificacion=id_notificacion, id_usuario=id_usuario)
    if estado is None:
        raise HTTPException(status_code=404, detail="Estado de notificación no encontrado")

    estado_modificado = modificar_estado_notificacion(db, estado, datos)
    return estado_modificado


@router.delete("/eliminar_notificacion/{id}", response_model=RespuestaNotificacion)
def eliminar_notificacion_endpoint(id: int, db: Session = Depends(get_db)):
    notificacion = get_notificacion_por_id(db, id=id)
    if not notificacion:
        raise HTTPException(status_code=404, detail="Notificación no encontrada")
    
    db.delete(notificacion)
    db.commit()
    return notificacion

# Endpoint para eliminar el estado de una notificación específica para un usuario
@router.delete("/eliminar_estado_notificacion/{id_notificacion}/{id_usuario}", response_model=CrearEstadoNotificacion)
def eliminar_estado_notificacion_endpoint(id_notificacion: int, id_usuario: int, db: Session = Depends(get_db)):
    db_estado = get_estado_notificacion_por_usuario(db, id_notificacion=id_notificacion, id_usuario=id_usuario)
    if not db_estado:
        raise HTTPException(status_code=404, detail="Estado de notificación no encontrado")

    db.delete(db_estado)
    db.commit()
    return db_estado


@router.get("/obtenerNotificaciones", response_model=List[RespuestaNotificacion])
def obtener_notificaciones(db: Session = Depends(get_db)):
    notificaciones = get_all_notificaciones(db)
    return notificaciones

@router.get("/obtenerEstadoNotificaciones", response_model=List[RespuestaEstadoNotificacion])
def obtener_estado_notificaciones(db: Session = Depends(get_db)):
    notificaciones = get_all_estados_notificacion(db)
    return notificaciones

@router.get("/obtenerNotificacion/{id}", response_model=RespuestaNotificacion)
def obtener_notificacion_por_id(id: int, db: Session = Depends(get_db)):
    # Buscar el nodo por ID
    notificacion = db.query(Notificacion).filter(Notificacion.id == id).first()
    
    # Si no se encuentra el nodo, lanzar una excepción
    if not notificacion:
        raise HTTPException(status_code=404, detail="Nodo no encontrado")
    
    return notificacion

@router.get("/obtenerEstadoNotificacion/{id}", response_model=RespuestaEstadoNotificacion)
def obtener_estado_notificacion_por_id(id: int, db: Session = Depends(get_db)):
    # Buscar el nodo por ID
    notificacion = db.query(Estado_notificacion).filter(Estado_notificacion.id == id).first()
    
    # Si no se encuentra el nodo, lanzar una excepción
    if not notificacion:
        raise HTTPException(status_code=404, detail="Nodo no encontrado")
    
    return notificacion