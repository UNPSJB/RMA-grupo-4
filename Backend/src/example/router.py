from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from src.example import models, exceptions
from src.example.services import *
from src.example.schemas import *
import bcrypt
from fastapi.security import OAuth2PasswordBearer

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

    # Crear el token con el nombre del rol correspondiente
    token = crear_token(request.usuario, db_usuario.rol_id, db)  
    return {"token": token}  # Devuelve el token al frontend

@router.get("/usuarios/{usuario}", response_model=RespuestaUsuario)
def obtener_usuario(usuario: str, db: Session = Depends(get_db)):
    db_usuario = get_usuario(db, usuario)
    if db_usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return db_usuario

@router.put("/modificar_datos_usuario/{usuario}", response_model=RespuestaUsuario)
def modificar_datos_usuario(usuario: str, datos: ModificarUsuario, db: Session = Depends(get_db)):
    db_usuario = get_usuario(db, usuario)
    if db_usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Llamamos a la función de servicio para modificar el usuario
    usuario_modificado = modificar_usuario(db, db_usuario, datos)
    
    return usuario_modificado

@router.put("/modificar_password/{usuario}", response_model=RespuestaUsuario)
def modificar_password(usuario: str, datos: ModificarContrasena, db: Session = Depends(get_db)):
    return modificar_password_service(usuario, datos, db)  

@router.delete("/eliminar_usuario/{usuario}", response_model=RespuestaUsuario)
def eliminar_usuario(usuario: str, db: Session = Depends(get_db)):
    db_usuario = get_usuario(db, usuario)
    if db_usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Eliminar el usuario de la base de datos
    db.delete(db_usuario)
    db.commit()
    
    return db_usuario  # Devuelve el usuario eliminado (opcional)

@router.get("/test_rol", dependencies=[Depends(verificar_rol("profesional", "universidad"))])
def acceso_roles(db: Session = Depends(get_db)):
    return {"mensaje": "Acceso permitido "}

@router.get("/roles", response_model=list[str])
def get_roles(db: Session = Depends(get_db)):
    """Endpoint temporal para obtener los roles válidos."""
    return obtener_roles_validos(db)

@router.get("/rol_invitado", response_model=int)
def get_roles(db: Session = Depends(get_db)):
    """Endpoint temporal para obtener los roles válidos."""
    return obtener_rol_invitado(db)