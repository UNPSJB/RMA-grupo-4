from pydantic import BaseModel, ConfigDict
from typing import List, Dict, Optional
from datetime import datetime

# Esquema base para representar datos con campos comunes
class BaseDataSchema(BaseModel):
    id_nodo: int
    type: str
    data: str
    timestamp: datetime

    model_config = ConfigDict(arbitrary_types_allowed=True)  # Permitir tipos arbitrarios


# Esquema para representar un mensaje individual desde la base de datos
class MensajeSchema(BaseModel):
    id: int
    id_nodo: int
    type: str
    data: str  
    time: datetime

    model_config = ConfigDict(arbitrary_types_allowed=True)  # Permitir tipos arbitrarios


# Esquema para representar una lista de mensajes
class MensajeListSchema(BaseModel):
    messages: List[MensajeSchema] 

    model_config = ConfigDict(arbitrary_types_allowed=True)  # Permitir tipos arbitrarios


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

    model_config = ConfigDict(arbitrary_types_allowed=True)  # Permitir tipos arbitrarios


class TemperatureResponse(DataResponse):
    data: List[TemperatureData]

class HumidityResponse(DataResponse):
    data: List[HumidityData]

class WindResponse(DataResponse):
    data: List[WindData]

class PrecipitationResponse(DataResponse):
    data: List[PrecipitationData]

class PressureResponse(DataResponse):
    data: List[PressureData]
    
class NodeSummary(BaseModel):
    id_nodo: int
    last_temperature: Optional[float] = None
    last_humidity: Optional[float] = None
    last_pressure: Optional[float] = None
    last_precipitation: Optional[float] = None
    last_wind: Optional[float] = None
    last_update: Optional[datetime] = None

class NodeSummaryResponse(BaseModel):
    summary: List[NodeSummary]