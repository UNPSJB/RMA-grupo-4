from typing import Optional, List
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from enum import auto, StrEnum
from datetime import datetime, UTC
from src.models import BaseModel


class Nodo(BaseModel):
    __tablename__ = "nodos"

    id = Column(Integer, primary_key=True, index=True)
    id_nodo = Column(Integer, index=True)
    alias = Column(String, unique=True, index=True)
    longitud = Column(Float)
    latitud = Column(Float)
    descripcion = Column(String)


