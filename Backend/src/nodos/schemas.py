from pydantic import BaseModel, StrictFloat, field_validator, root_validator
from typing import Optional
from enum import Enum
import enum


class CrearNodo(BaseModel):
    id_nodo: int
    alias: str
    longitud: float
    latitud: float
    descripcion: str


class ModificarNodo(BaseModel):
    id_nodo: Optional[int] = None
    alias: Optional[str] = None
    longitud: Optional[float] = None
    latitud: Optional[float] = None
    descripcion: Optional[str] = None


class RespuestaNodo(BaseModel): 
    id: int
    id_nodo: int
    alias: str
    longitud: float
    latitud: float
    descripcion: str
    estado:str
    
    
class EstadoNodo(str, Enum):
    ACTIVO = "ACTIVO"
    MANTENIMIENTO = "MANTENIMIENTO"
    FUERA_DE_SERVICIO = "FUERA_DE_SERVICIO"

class ActualizarEstadoNodo(BaseModel):
    estado: EstadoNodo
