from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from src.models import Variable, Rango, Unidad, TipoMensaje
from src.variables import exceptions
from src.variables.services import *
from src.variables.schemas import *
from typing import List
from sqlalchemy.exc import SQLAlchemyError

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

@router.get("/obtener_variables")
def obtener_variables(db: Session = Depends(get_db)):
    variables = db.query(Variable).all()
    response = []
    for variable in variables:
        rangos = db.query(Rango).filter(Rango.variable_id == variable.id).all()
        response.append({
            "id": variable.id,
            "numero": variable.numero,
            "nombre": variable.nombre,
            "unidad": variable.unidad,
            "minimo": variable.minimo,
            "maximo": variable.maximo,
            "rangos": [
                {"color": rango.color, "min_val": rango.min_val, "max_val": rango.max_val}
                for rango in rangos
            ]
        })
    return response

@router.post("/guardar_rangos", response_model=RespuestaBase)
def guardar_rangos(rangos: List[RangoSchema], db: Session = Depends(get_db)):
    """
    Modifica o crea una lista de rangos para diferentes variables, asegurando que los valores
    estén dentro de los límites de cada variable.
    """
    try:
        for rango_data in rangos:
            # Extrae los datos necesarios para cada rango
            variable_id = rango_data.variable_id
            color = rango_data.color
            min_val = rango_data.min_val
            max_val = rango_data.max_val
            activo = rango_data.activo
            
            # Busca la variable en la base de datos para validar los límites
            variable = db.query(Variable).filter_by(id=variable_id).first()
            if not variable:
                raise HTTPException(status_code=404, detail=f"La variable con ID {variable_id} no existe.")

            # Verifica si el rango está dentro de los límites definidos en Variable
            if min_val < variable.minimo or max_val > variable.maximo:
                raise HTTPException(
                    status_code=400,
                    detail=f"Los valores para el rango {color} están fuera de los límites permitidos para la variable."
                )

            # Busca el rango existente por variable_id y color
            rango_existente = db.query(Rango).filter_by(variable_id=variable_id, color=color).first()

            if rango_existente:
                # Si el rango existe, actualiza sus valores
                rango_existente.min_val = min_val
                rango_existente.max_val = max_val
                rango_existente.activo = activo
            else:
                # Si el rango no existe, crea uno nuevo
                nuevo_rango = Rango(
                    variable_id=variable_id,
                    color=color,
                    min_val=min_val,
                    max_val=max_val,
                    activo=activo
                )
                db.add(nuevo_rango)
        
        db.commit()
        return {"message": "Rangos guardados exitosamente."}
    
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error de base de datos")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/obtener_unidades")
def obtener_unidades(db: Session = Depends(get_db)):
    unidades = db.query(Unidad).all()
    return unidades

@router.get("/obtener_tipos_mensaje")
def obtener_ipos_mensaje(db: Session = Depends(get_db)):
    tiposMensaje = db.query(TipoMensaje).all()
    return tiposMensaje