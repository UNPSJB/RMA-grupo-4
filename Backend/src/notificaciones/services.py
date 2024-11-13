from typing import List
from sqlalchemy.orm import Session
from src.notificaciones.models import Notificacion, Estado_notificacion
from src.notificaciones import exceptions
import os
from datetime import datetime, timedelta
import jwt
from dotenv import load_dotenv
from src.notificaciones.schemas import *
from fastapi import Security, Depends, HTTPException

load_dotenv()

ENV = os.getenv("ENV")

def crear_notificacion(db: Session, notificacion_data: CrearNotificacion):
    db_notificacion = Notificacion(
        titulo =notificacion_data.titulo,
        mensaje = notificacion_data.mensaje,
        creada = notificacion_data.creada,
        id_nodo = notificacion_data.id_nodo
        
    )
    db.add(db_notificacion)
    db.commit()
    db.refresh(db_notificacion)
    return db_notificacion

def get_notificacion_por_id(db: Session, id:int):
    return db.query(Notificacion).filter(Notificacion.id == id).first()

def get_notificaciones_por_nodo(db:Session, id_nodo:int):
    return db.query(Notificacion).filter(Notificacion.id_nodo == id_nodo).all()


def modificar_notificacion(db: Session, db_notificacion: Notificacion, datos: ModificarNotificacion):
    if datos.titulo is not None:
        db_notificacion.titulo = datos.titulo
    if datos.mensaje is not None:
        db_notificacion.mensaje = datos.mensaje
    if datos.creada is not None:
        db_notificacion.creada = datos.creada
    
    
    db.commit()
    db.refresh(db_notificacion)
    return db_notificacion

def get_all_notificaciones(db: Session):
    return db.query(Notificacion).all()

def crear_estado_notificacion(db: Session, estado_data: CrearEstadoNotificacion):
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

# Función para obtener el estado de una notificación específica por usuario
def get_estado_notificacion_por_usuario(db: Session, id_notificacion: int, id_usuario: int):
    return db.query(Estado_notificacion).filter(
        Estado_notificacion.id_notificacion == id_notificacion,
        Estado_notificacion.id_usuario == id_usuario
    ).first()
    
def get_estado_notificacion_por_id(db: Session, id_notificacion: int):
    return db.query(Estado_notificacion).filter(
        Estado_notificacion.id_notificacion == id_notificacion
        
    ).first()

# Función para modificar el estado de una notificación
def modificar_estado_notificacion(db: Session, db_estado: Estado_notificacion, datos: ModificarEstadoNotificacion):
    if datos.estado is not None:
        db_estado.estado = datos.estado
    if datos.leido_el is not None:
        db_estado.leido_el = datos.leido_el
    
    db.commit()
    db.refresh(db_estado)
    return db_estado

# Función para obtener todos los estados de notificación
def get_all_estados_notificacion(db: Session):
    return db.query(Estado_notificacion).all()

    