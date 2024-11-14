from pydantic import BaseModel, StrictFloat, field_validator, root_validator
from typing import Optional

class CrearVariable(BaseModel):
    numero : int
    nombre: str
    minimo: float
    maximo: float
    unidad: str
    


class ModificarVariable(BaseModel):
    numero : Optional[int] = None
    nombre: Optional[str] = None
    minimo: Optional[float] = None
    maximo: Optional[float] = None
    unidad: Optional[str] = None
    

class RespuestaVariable(BaseModel): 
    id: int
    numero : int
    nombre: str
    minimo: float
    maximo: float
    unidad: str
    
