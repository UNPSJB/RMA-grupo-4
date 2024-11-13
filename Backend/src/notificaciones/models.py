from typing import Optional, List
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table, Float, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from enum import auto, StrEnum
from datetime import datetime, UTC
from src.example.models import Usuario
from src.nodos.models import Nodo
from src.models import BaseModel


class Notificacion (BaseModel):
    __tablename__ = "notificaciones"
    
    id = Column(Integer, primary_key=True, index= True)
    titulo = Column(String, index=True)
    mensaje = Column(String, index=True)
    creada = Column(DateTime, index=True)
    id_nodo = Column(Integer, ForeignKey("nodos.id"),index=True)
    #nodo?
    nodo = relationship("Nodo")
    
    
class Estado_notificacion(BaseModel):
    __tablename__ = "estado"
    
    id = Column(Integer, primary_key=True, index=True)
    id_notificacion = Column(Integer, ForeignKey("notificaciones.id"), index = True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id"), index=True)
    estado = Column(Boolean, default=False, index=True)
    leido_el = Column(DateTime, nullable=True)
    
    notificacion = relationship("Notificacion")
    usuario = relationship("Usuario")
