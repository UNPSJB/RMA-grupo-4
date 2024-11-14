from pydantic import BaseModel, StrictFloat, field_validator, root_validator, Field
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
    
class RangoSchema(BaseModel):
    variable_id: int
    color: str
    min_val: float
    max_val: float
    activo: bool = Field(default=False)

class RespuestaBase(BaseModel):
    message: str