from pydantic import BaseModel, StrictFloat, field_validator, root_validator
from typing import Optional

class CrearVariable(BaseModel):
    numero : int
    nombre: str
    unidad: str
    


class ModificarVariable(BaseModel):
    numero : Optional[int] = None
    nombre: Optional[str] = None
    unidad: Optional[str] = None
    

class RespuestaVariable(BaseModel): 
    id: int
    numero : int
    nombre: str
    unidad: str
    
