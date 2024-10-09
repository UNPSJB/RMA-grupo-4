from pydantic import BaseModel
from typing import List
from datetime import datetime

# Esquema para representar un mensaje individual desde la base de datos
class MensajeSchema(BaseModel):
    id: int
    id_nodo: int
    type: str
    data: str  
    time: datetime

    class Config:
        orm_mode = True  

# Esquema para representar una lista de mensajes
class MensajeListSchema(BaseModel):
    messages: List[MensajeSchema] 

    class Config:
        orm_mode = True

# Esquema para la respuesta de datos de temperatura
class TemperatureData(BaseModel):
    id_nodo: int
    type: str
    data: str  
    timestamp: datetime  

    class Config:
        orm_mode = True

# Esquema para la respuesta final del endpoint con un resumen de temperatura
class TemperatureResponse(BaseModel):
    data: List[TemperatureData]  
    summary: dict  

    class Config:
        orm_mode = True

