from typing import List
from sqlalchemy.orm import Session
from src.example.models import Usuario
from src.example import exceptions
import bcrypt
import os
from datetime import datetime, timedelta
import jwt
from dotenv import load_dotenv
from src.example.schemas import *
from fastapi import Security, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

# Cargo las variables del env
load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

ENV = os.getenv("ENV")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def crear_usuario(db: Session, usuario: CrearUsuario):
    hashed_password = bcrypt.hashpw(usuario.password.encode('utf-8'), bcrypt.gensalt())
    db_usuario = Usuario(
        usuario=usuario.usuario,
        email=usuario.email,
        edad=usuario.edad,
        password=hashed_password.decode('utf-8'),
        rol=usuario.rol  # Asignar el rol
    )
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

def get_usuario(db: Session, usuario: str):
    return db.query(Usuario).filter(Usuario.usuario == usuario).first()

def crear_token(usuario: str, rol: str):
    expiration = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": usuario,
        "rol": rol,  # Incluimos el rol en el payload del token
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


def modificar_usuario(db: Session, db_usuario: Usuario, datos: ModificarUsuario):
    # Actualizamos los campos del usuario según los datos proporcionados
    if datos.email is not None:
        db_usuario.email = datos.email
    if datos.edad is not None:
        db_usuario.edad = datos.edad
    
    db.commit()  # Guardamos los cambios en la base de datos
    db.refresh(db_usuario)  # Actualizamos la instancia del usuario
    return db_usuario  # Devolvemos el usuario modificado

def modificar_password_service(usuario: str, datos: ModificarContrasena, db: Session) -> RespuestaUsuario:
    db_usuario = get_usuario(db, usuario)  
    if db_usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Validar que las contraseñas coincidan
    if datos.password != datos.repetir_password:
        raise HTTPException(status_code=400, detail="Las contraseñas no coinciden")

    # Actualizar la contraseña
    hashed_password = bcrypt.hashpw(datos.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    db_usuario.password = hashed_password
    db.commit()
    db.refresh(db_usuario)

    return db_usuario

def verificar_rol(rol_requerido: str):
    def verificar_rol_internal(token: str = Depends(oauth2_scheme)):
        payload = verificar_token(token)
        rol = payload.get("rol")
        #verifica el rol del usuario con el que necesita el endpoint
        if rol != rol_requerido: 
            raise HTTPException(status_code=403, detail="No tienes permiso para acceder a este recurso")
        return rol
    return verificar_rol_internal




#Propósito: Implementa las operaciones de creación, lectura, actualización y eliminación (CRUD) en la base de datos.
#Función: Las funciones en el archivo crud.py interactúan directamente con la base de datos a través de SQLAlchemy. 
#Estas funciones contienen la lógica para realizar operaciones como insertar nuevos registros, recuperar usuarios, etc.

