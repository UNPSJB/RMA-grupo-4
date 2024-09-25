from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from src.example import models, schemas, exceptions, services

router = APIRouter()

# Rutas para Usuarios

@router.post("/usuarios", response_model=schemas.Usuario)
def create_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    return services.crear_usuario(db, usuario)


@router.get("/usuarios", response_model=list[schemas.Usuario])
def read_usuarios(db: Session = Depends(get_db)):
    return services.listar_usuarios(db)


@router.get("/usuarios/{usuario_id}", response_model=schemas.Usuario)
def read_usuario(usuario_id: int, db: Session = Depends(get_db)):
    return services.leer_usuario(db, usuario_id)


@router.put("/usuarios/{usuario_id}", response_model=schemas.Usuario)
def update_usuario(
    usuario_id: int, usuario: schemas.UsuarioUpdate, db: Session = Depends(get_db)
):
    return services.modificar_usuario(db, usuario_id, usuario)


@router.delete("/usuarios/{usuario_id}", response_model=schemas.Usuario)
def delete_usuario(usuario_id: int, db: Session = Depends(get_db)):
    return services.eliminar_usuario(db, usuario_id)



