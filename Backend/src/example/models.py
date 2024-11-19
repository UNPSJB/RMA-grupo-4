from typing import Optional, List
from sqlalchemy import Column, Integer, String,Boolean, DateTime, ForeignKey, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship
from enum import auto, StrEnum
from datetime import datetime, UTC
from src.models import BaseModel

class Rol(BaseModel):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, index=True)

class Usuario(BaseModel):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    usuario = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    edad = Column(Integer)
    password = Column(String)
    rol_id = Column(Integer, ForeignKey("roles.id"), nullable=False)  # FK al rol
    rol = relationship("Rol", backref="usuarios")



class Usuario_preferencias(BaseModel):
    __tablename__ = "preferencias"

    id = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id"))
    id_variable = Column(Integer, ForeignKey("variables.id"))
    alerta = Column(String, index=True)
    estado = Column(Boolean, default=True)


