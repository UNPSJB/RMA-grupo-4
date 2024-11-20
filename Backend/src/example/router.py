from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from src.example import models, exceptions
from src.example.services import *
from src.example.schemas import *
import bcrypt
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()

@router.post("/crear_preferencia")
def crear_preferencia(preferencia: CrearPreferencia, db: Session = Depends(get_db)):
    # Obtén las preferencias actuales de `id_variable` para `id_usuario`
    preferencias_actuales = db.query(Usuario_preferencias).filter(
        Usuario_preferencias.id_usuario == preferencia.id_usuario,
        Usuario_preferencias.id_variable == preferencia.id_variable
    ).all()
    
    # Verifica la cantidad máxima de estados
    if len(preferencias_actuales) >= 4:
        raise HTTPException(status_code=400, detail="Cada variable puede tener un máximo de 4 estados distintos.")

    # Verifica que el estado/alerta no se repita
    for pref in preferencias_actuales:
        if pref.alerta == preferencia.alerta:
            raise HTTPException(status_code=400, detail="Ya existe una preferencia con este estado para la variable.")
    
    # Crear la nueva preferencia
    nueva_preferencia = Usuario_preferencias(
        id_usuario=preferencia.id_usuario,
        id_variable=preferencia.id_variable,
        alerta=preferencia.alerta,
        estado=preferencia.estado
    )
    db.add(nueva_preferencia)
    db.commit()
    db.refresh(nueva_preferencia)
    
    return nueva_preferencia

#Todas las preferencias de un usuario en especifico segun el id
@router.get("/preferencias/{id_usuario}", response_model=List[RespuestaPreferencia])
def obtener_preferencias_usuario(id_usuario: int, db: Session = Depends(get_db)):
    preferencias = db.query(Usuario_preferencias).filter(Usuario_preferencias.id_usuario == id_usuario).all()
    return preferencias

#Una preferencia en especifico de un usuario
@router.get("/preferencia/{id_usuario}/{id}", response_model=RespuestaPreferencia)
def obtener_preferencia_usuario(id_usuario: int, id: int, db: Session = Depends(get_db)):
    preferencia = db.query(Usuario_preferencias).filter(
        Usuario_preferencias.id == id, 
        Usuario_preferencias.id_usuario == id_usuario
    ).first()
    
    if preferencia is None:
        raise HTTPException(status_code=404, detail="Preferencia no encontrada o no pertenece al usuario")
    
    return preferencia


@router.put("/modificar_preferencia/{id}", response_model=RespuestaPreferencia)
def modificar_preferencia(id: int, datos: ModificarPreferencia, db: Session = Depends(get_db)):
    db_preferencia = get_preferencia(db, id)
    
    # Validar que la preferencia pertenece al usuario que hace la solicitud
    if db_preferencia is None or db_preferencia.id_usuario != datos.id_usuario:
        raise HTTPException(status_code=404, detail="Preferencia no encontrada o no pertenece al usuario")
    
    # Actualizar los campos permitidos
    for key, value in datos.dict(exclude_unset=True).items():
        setattr(db_preferencia, key, value)

    db.commit()
    db.refresh(db_preferencia)
    
    return db_preferencia


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

@router.get("/roles", response_model=list[str])
def get_roles(db: Session = Depends(get_db)):
    """Endpoint temporal para obtener los roles válidos."""
    return obtener_roles_validos(db)

@router.get("/rolesnombresId", response_model=List[RolResponse])
def roles_nombres_id(db: Session = Depends(get_db)):
    """Endpoint para obtener los roles con sus IDs y nombres."""
    return obtener_roles_con_id(db)

@router.get("/rol_invitado", response_model=int)
def get_roles(db: Session = Depends(get_db)):
    """Endpoint temporal para obtener los roles válidos."""
    return obtener_rol_invitado(db)

@router.put("/asignar_rol/{usuario_id}", response_model=RespuestaUsuario)
def asignar_rol(usuario_id: int, rol_asignacion: RolAsignacion, db: Session = Depends(get_db), rol: str = Depends(verificar_rol("admin"))):
    """Endpoint para que un admin asigne un rol a un usuario."""
    return asignar_rol_usuario(db, usuario_id, rol_asignacion.nuevo_rol_id)

# @router.get("/test_rol", dependencies=[Depends(verificar_rol("profesional", "universidad"))])
# def acceso_roles(db: Session = Depends(get_db)):
#     return {"mensaje": "Acceso permitido "}

@router.get("/lista_usuarios", response_model=List[ListaUsuarios])
def lista_usuarios(db: Session = Depends(get_db)):
    """Endpoint para listar todos los usuarios y sus roles."""
    return listar_usuarios(db)


