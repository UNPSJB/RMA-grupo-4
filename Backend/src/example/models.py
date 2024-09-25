from typing import Optional, List
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship
from enum import auto, StrEnum
from datetime import datetime, UTC
from src.models import BaseModel

class Usuario(BaseModel):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    fecha_creacion: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(UTC))
    fecha_modificacion: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC)
    )
