from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from src.example import models, exceptions
from src.example.services import *
from src.example.schemas import *
import bcrypt

router = APIRouter()

@router.post("/registrar", response_model= RespuestaUsuario)
def registrar(usuario: CrearUsuario, db: Session = Depends(get_db)):
    db_usuario = get_usuario(db, usuario=usuario.usuario)
    if db_usuario:
        raise HTTPException(status_code=400, detail="el usuario ya fue registrado")
    return crear_usuario(db=db, usuario=usuario)

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    db_usuario = get_usuario(db, request.usuario)
    if db_usuario is None:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    if not bcrypt.checkpw(request.password.encode('utf-8'), db_usuario.password.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    token = crear_token(request.usuario)  # Crear el token JWT
    return {"token": token}  # Devuelve el token al frontend

