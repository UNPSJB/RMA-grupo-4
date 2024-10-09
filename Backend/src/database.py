import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

# Crear la instancia de base para nuestros modelos
Base = declarative_base()

# Crear el motor de la base de datos
# Verifica que DB_URL esté presente y no sea None
DB_URL = os.getenv("DB_URL")
if not DB_URL:
    raise ValueError("La variable de entorno DB_URL no está configurada correctamente.")

engine = create_engine(DB_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# para creacion de tablas de mensajes recibidos 
def create_tables():
    from src.models import Base
    Base.metadata.create_all(bind=engine)