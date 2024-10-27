from typing import List
from sqlalchemy.orm import Session
from src.nodos.models import Nodo
from src.nodos import exceptions
import os
from datetime import datetime, timedelta
import jwt
from dotenv import load_dotenv
from src.nodos.schemas import *
from fastapi import Security, Depends, HTTPException

load_dotenv()

ENV = os.getenv("ENV")

def crear_nodo(db: Session, alias: CrearNodo):
    db_nodo = Nodo(
        alias = alias.alias,
        longitud = alias.longitud,
        latitud = alias.latitud,
        descripcion = alias.descripcion
    )
    db.add(db_nodo)
    db.commit()
    db.refresh(db_nodo)
    return db_nodo

def get_nodo(db: Session, alias: str):
    return db.query(Nodo).filter(Nodo.alias == alias).first()

def get_nodo_por_id(db: Session, id: int):
    return db.query(Nodo).filter(Nodo.id == id).first()

def modificar_nodo(db: Session, db_nodo: Nodo, datos: ModificarNodo):
    if datos.alias is not None:
        db_nodo.alias = datos.alias
    if datos.longitud is not None:
        db_nodo.longitud = datos.longitud
    if datos.latitud is not None:
        db_nodo.latitud = datos.latitud
    if datos.descripcion is not None:
        db_nodo.descripcion = datos.descripcion
    
    db.commit()
    db.refresh(db_nodo)
    return db_nodo

def get_all_nodos(db: Session):
    return db.query(Nodo).all()
    