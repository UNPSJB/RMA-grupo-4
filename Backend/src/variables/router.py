from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from src.models import Variable
from src.variables import exceptions
from src.variables.services import *
from src.variables.schemas import *

router = APIRouter()

@router.post("/crear_variable", response_model=RespuestaVariable)
def crear_variable_endpoint(variable_data: CrearVariable, db: Session = Depends(get_db)):
    if get_variable_por_nombre(db, nombre=variable_data.nombre):
        raise HTTPException(status_code=400, detail="Ya existe una variable con ese nombre")
    if get_variable_por_numero(db, numero=variable_data.numero):
        raise HTTPException(status_code=400, detail="Ya existe una variable con ese numero")
    
    return crear_variable(db=db, variable_data=variable_data)

@router.put("/modificar_variable/{id}", response_model=RespuestaVariable)
def modificar_variable_endpoint(id: int, datos: ModificarVariable, db: Session = Depends(get_db)):
    """
    Modifica una variable existente en la base de datos por su ID.
    """
    db_variable = get_variable_por_id(db, id)
    if db_variable is None:
        raise HTTPException(status_code=404, detail="Variable con ese id no encontrada")
    
    variable_modificada = modificar_variable(db, db_variable, datos)
    return variable_modificada

@router.delete("/eliminar_variable_por_nombre/{nombre}", response_model=RespuestaVariable)
def eliminar_variable_por_nombre(nombre: str, db: Session = Depends(get_db)):
    db_variable = get_variable_por_nombre(db, nombre)
    if db_variable is None:
        raise HTTPException(status_code=404, detail="Variable con ese nombre no encontrada")
    
    db.delete(db_variable)
    db.commit()
    
    return db_variable

@router.delete("/eliminar_variable_por_numero/{numero}", response_model=RespuestaVariable)
def eliminar_variable_por_numero(numero: int, db: Session = Depends(get_db)):
    db_variable = get_variable_por_numero(db, numero)
    if db_variable is None:
        raise HTTPException(status_code=404, detail="Variable con ese numero no encontrada")
    
    db.delete(db_variable)
    db.commit()
    
    return db_variable   

@router.get("/obtener_variables", response_model=List[RespuestaVariable])
def obtener_variables(db: Session = Depends(get_db)):
    variables = get_all_variables(db)
    return variables