from sqlalchemy import Column, Integer, String,Float, Enum
import enum
from src.models import BaseModel


class EstadoNodo(enum.Enum):
    ACTIVO = "activo"
    MANTENIMIENTO = "mantenimiento"
    FUERA_DE_SERVICIO = "fuera de servicio"


class Nodo(BaseModel):
    __tablename__ = "nodos"

    id = Column(Integer, primary_key=True, index=True)
    id_nodo = Column(Integer, index=True, unique=True, nullable=False)
    alias = Column(String, unique=True, index=True, nullable=False)
    longitud = Column(Float,nullable=False)
    latitud = Column(Float, nullable=False)
    descripcion = Column(String)
    estado = Column(Enum(EstadoNodo), default=EstadoNodo.ACTIVO, nullable=False)


