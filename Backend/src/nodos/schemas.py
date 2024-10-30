from pydantic import BaseModel, StrictFloat, field_validator, root_validator
from typing import Optional

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
