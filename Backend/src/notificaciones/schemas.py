from pydantic import BaseModel, StrictFloat, field_validator, ConfigDict
from datetime import datetime
from typing import Optional

class CrearNotificacion(BaseModel):
    id: int
    titulo: str
    mensaje: str
    creada:datetime
    id_nodo: int
    
    model_config = ConfigDict(arbitrary_types_allowed=True)  # Permitir tipos arbitrarios

class ModificarNotificacion(BaseModel):
    id: Optional[int] = None
    titulo: Optional[str] = None
    mensaje: Optional[str] = None
    creada: Optional[datetime] = None
    id_nodo: Optional[int] = None
    
    model_config = ConfigDict(arbitrary_types_allowed=True)  # Permitir tipos arbitrarios

class RespuestaEstadoNotificacion(BaseModel):
    id: int
    id_notificacion: int
    id_usuario: int
    estado: bool
    leido_el: Optional[datetime] = None

class RespuestaNotificacion(BaseModel): 
    id: int
    titulo: str
    mensaje: str
    creada: datetime
    id_nodo: int
    estado_notificacion: RespuestaEstadoNotificacion


class CrearEstadoNotificacion(BaseModel):
    id_notificacion: int
    id_usuario: int
    estado: bool = False  
    leido_el: Optional[datetime] = None  # Campo opcional, puede ser None si no se ha leído aún

class ModificarEstadoNotificacion(BaseModel):
    estado: Optional[bool] = None
    leido_el: Optional[datetime] = None  # Campo opcional, puede ser actualizado con la fecha de lectura

class RespuestaEstadoNotificacion(BaseModel):
    id: int
    id_notificacion: int
    id_usuario: int
    estado: bool
    leido_el: Optional[datetime] = None
