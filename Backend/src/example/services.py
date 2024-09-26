from typing import List
from sqlalchemy.orm import Session
from src.example.models import Usuario
from src.example import exceptions
import bcrypt
import os
from datetime import datetime, timedelta
import jwt
from dotenv import load_dotenv
from src.example.schemas import CrearUsuario, RespuestaUsuario, LoginRequest

# Cargo las variabels del env
load_dotenv()

ENV = os.getenv("ENV")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def crear_usuario(db: Session, usuario: CrearUsuario): 
    hashed_password = bcrypt.hashpw(usuario.password.encode('utf-8'), bcrypt.gensalt())
    db_usuario = Usuario(usuario=usuario.usuario, email=usuario.email, edad=usuario.edad, password=hashed_password.decode('utf-8'))
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

def get_usuario(db: Session, usuario: str):
    return db.query(Usuario).filter(Usuario.usuario == usuario).first()

def crear_token(usuario: str):
    expiration = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": usuario,
        "exp": expiration,
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

def verificar_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise exceptions.HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise exceptions.HTTPException(status_code=401, detail="Token inválido")


#Propósito: Implementa las operaciones de creación, lectura, actualización y eliminación (CRUD) en la base de datos.
#Función: Las funciones en el archivo crud.py interactúan directamente con la base de datos a través de SQLAlchemy. 
#Estas funciones contienen la lógica para realizar operaciones como insertar nuevos registros, recuperar usuarios, etc.