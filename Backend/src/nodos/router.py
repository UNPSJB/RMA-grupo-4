from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from src.nodos import models, exceptions
from src.nodos.services import *
from src.nodos.schemas import *

router = APIRouter()

@router.post("/CrearNodo")
def Crear_Nodo(alias: CrearNodo, db: Session = Depends(get_db)):
    # Validar si existe un nodo con el mismo alias
    db_nodo_alias = get_alias(db, alias=alias.alias)
    if db_nodo_alias:
        raise HTTPException(status_code=400, detail="Ya existe un nodo con ese alias.")
    # Validar si existe un nodo con el mismo id_nodo
    db_nodo_id = get_nodo_por_id(db, id_nodo=alias.id_nodo)
    if db_nodo_id:
        raise HTTPException(status_code=400, detail="Ya existe un nodo con ese ID.")
    
    # Crear el nodo si pasa ambas validaciones
    nuevo_nodo = crear_nodo(db=db, alias=alias)
    return {"message": "Nodo creado con éxito.", "nodo": nuevo_nodo}


@router.put("/modificar_datos_nodo/{id}", response_model=RespuestaNodo)
def modificar_datos_nodo(id: int, datos: ModificarNodo, db: Session = Depends(get_db)):
    db_nodo = get_nodo_por_id(db, id)  # Cambiar a la función que busca por ID
    if db_nodo is None:
        raise HTTPException(status_code=404, detail="Nodo no encontrado")
    
    # Llamamos a la función de servicio para modificar el nodo
    nodo_modificado = modificar_nodo(db, db_nodo, datos)
    
    return nodo_modificado



@router.delete("/eliminar_nodo/{alias}", response_model=RespuestaNodo)
def eliminar_nodo(alias: str, db: Session = Depends(get_db)):
    db_nodo = get_alias(db, alias)
    if db_nodo is None:
        raise HTTPException(status_code=404, detail="Nodo no encontrado")
    
    db.delete(db_nodo)
    db.commit()
    
    return db_nodo  # Devuelve el nodo eliminado (opcional)

@router.get("/obtenerNodos", response_model=List[RespuestaNodo])
def obtener_nodos(db: Session = Depends(get_db)):
    nodos = get_all_nodos(db)
    return nodos

@router.get("/obtenerNodo/{id}", response_model=RespuestaNodo)
def obtener_nodo_por_id(id: int, db: Session = Depends(get_db)):
    # Buscar el nodo por ID
    nodo = db.query(Nodo).filter(Nodo.id_nodo == id).first()
    
    # Si no se encuentra el nodo, lanzar una excepción
    if not nodo:
        raise HTTPException(status_code=404, detail="Nodo no encontrado")
    
    return nodo