from typing import List
from sqlalchemy.orm import Session
from src.models import Variable
from src.variables import exceptions
import os
from datetime import datetime, timedelta
import jwt
from dotenv import load_dotenv
from src.variables.schemas import *
from fastapi import Security, Depends, HTTPException

load_dotenv()

ENV = os.getenv("ENV")

def crear_variable(db: Session, variable_data: CrearVariable):
    db_variable = Variable(
        numero=variable_data.numero,
        nombre=variable_data.nombre,
        minimo=variable_data.minimo,
        maximo=variable_data.maximo,
        unidad=variable_data.unidad 
    )
    db.add(db_variable)
    db.commit()
    db.refresh(db_variable)
    return db_variable

def get_variable_por_nombre(db: Session, nombre: str):
    return db.query(Variable).filter(Variable.nombre == nombre).first()

def get_variable_por_numero(db: Session, numero: int):
    return db.query(Variable).filter(Variable.numero == numero).first()

def get_variable_por_id(db: Session, id: int):
    return db.query(Variable).filter(Variable.id == id).first()

def modificar_variable(db: Session, db_variable: Variable, datos: ModificarVariable):
    if datos.numero is not None:
        db_variable.numero = datos.numero
    if datos.nombre is not None:
        db_variable.nombre = datos.nombre
    if datos.minimo is not None:
        db_variable.minimo = datos.minimo
    if datos.maximo is not None:
        db_variable.maximo = datos.maximo
    if datos.unidad is not None:
        db_variable.unidad = datos.unidad
    
    db.commit()
    db.refresh(db_variable)
    return db_variable

def get_all_variables(db: Session):
    return db.query(Variable).all()