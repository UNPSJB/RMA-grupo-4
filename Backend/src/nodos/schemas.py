from pydantic import BaseModel, StrictFloat, EmailStr, field_validator
from typing import List
from datetime import datetime
from src.example.constants import ErrorCode
from src.example import exceptions
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
    id:int
    alias:str
    longitud:float
    latitud: float
    descripcion: str