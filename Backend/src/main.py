import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database import engine
from src.models import BaseModel
from src.notificaciones.router import router as notificaciones_router
from src.example.router import router as example_router
from src.variables.router import router as variables_router
from src.nodos.router import router as nodos_router
from src.rma_receptor.mqtt_client import conectar_mqtt, detener_mqtt  # Importar las funciones de conexión y desconexión de MQTT
from src.mensajes.router import router as mensajes_router # para endpoint que devuelve todos los mensajes de la base de datos como una lista de objetos JSON.

# Cargar variables de entorno desde el archivo .env
load_dotenv()

# Configurar entorno
ENV = os.getenv("ENV", "development")
ROOT_PATH = os.getenv(f"ROOT_PATH_{ENV.upper()}")

# Definir el contexto de lifespan para gestionar el ciclo de vida de la app
@asynccontextmanager
async def app_lifespan(app: FastAPI):
    # Crear la base de datos y las tablas
    BaseModel.metadata.create_all(bind=engine)
    
    # Conectar al broker MQTT al iniciar la aplicación
    conectar_mqtt()
    yield
    # Desconectar del broker MQTT al cerrar la aplicación
    detener_mqtt()

# Crear la aplicación FastAPI con el lifespan definido
app = FastAPI(root_path=ROOT_PATH, lifespan=app_lifespan)

# Configurar CORS
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir los routers de los módulos en la aplicación
app.include_router(example_router)
app.include_router(nodos_router)
app.include_router(variables_router)
app.include_router(mensajes_router, prefix="/api/v1")
app.include_router(notificaciones_router)