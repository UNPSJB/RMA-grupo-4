from pydantic import BaseModel, StrictFloat, field_validator, root_validator
from typing import Optional

class CrearNodo(BaseModel):
    alias: str
    longitud: float
    latitud: float
    descripcion: str


class ModificarNodo(BaseModel):
    alias: Optional[str] = None
    longitud: Optional[float] = None
    latitud: Optional[float] = None
    descripcion: Optional[str] = None


class RespuestaNodo(BaseModel): 
    id: int
    alias: str
    longitud: float
    latitud: float
    descripcion: str
