from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime

# Esquema base para representar datos con campos comunes
class BaseDataSchema(BaseModel):
    id_nodo: int
    type: str
    data: str
    timestamp: datetime

    class Config:
        orm_mode = True

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

# Esquemas para las respuestas de datos específicos
class TemperatureData(BaseDataSchema):
    pass

class HumidityData(BaseDataSchema):
    pass

class WindData(BaseDataSchema):
    pass

class PrecipitationData(BaseDataSchema):
    pass

class PressureData(BaseDataSchema):
    pass

# Esquemas para la respuesta final del endpoint con un resumen
class DataResponse(BaseModel):
    data: List[BaseDataSchema]  
    summary: Dict[str, any]  

    class Config:
        orm_mode = True


class TemperatureResponse(DataResponse):
    data: List[TemperatureData]

class HumedadResponse(DataResponse):
    data: List[HumidityData]

class VientoResponse(DataResponse):
    data: List[WindData]

class PrecipitacionResponse(DataResponse):
    data: List[PrecipitationData]

class PresionResponse(DataResponse):
    data: List[PressureData]
