from typing import Optional, List
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship
from enum import auto, StrEnum
from datetime import datetime, UTC
from src.models import BaseModel

class Usuario(BaseModel):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    usuario = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    edad = Column(Integer)
    password = Column(String)
    rol = Column(String, default="estudiante")  # Nuevo campo para el rol
