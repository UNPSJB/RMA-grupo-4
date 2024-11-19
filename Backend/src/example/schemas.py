from pydantic import BaseModel, EmailStr, field_validator
from typing import List
from datetime import datetime
from src.example.constants import ErrorCode
from src.example import exceptions
from typing import Optional
from src.example.services import *

class CrearUsuario(BaseModel):
    usuario: str
    email: str
    edad: int
    password: str
    rol_id: int
    
    @classmethod
    def validar_rol(cls, v, values, **kwargs):
        db: Session = kwargs.get("db")  # Recibe la sesión de la BD
        roles_validos = obtener_roles_validos(db)
        if v not in roles_validos:
            raise ValueError(f"El rol debe ser uno de los siguientes: {', '.join(roles_validos)}")
        return v

class RespuestaUsuario(BaseModel): 
    id:int
    usuario:str
    email:str
    edad: int
    rol_id: int  

class LoginRequest(BaseModel):
    usuario: str
    password: str

class ModificarUsuario(BaseModel):
    email: Optional[EmailStr] = None
    edad: Optional[int] = None

class ModificarContrasena(BaseModel):
    password: str
    repetir_password: str

class RolAsignacion(BaseModel):
    nuevo_rol_id: int

class ListaUsuarios(BaseModel):
    id: int
    usuario: str
    email: str
    edad: int
    rol_nombre: str

class RolResponse(BaseModel):
    id: int
    nombre: str
class Config: 
    orm_mode= True


class CrearPreferencia(BaseModel):
    id_usuario: int
    id_variable: int
    alerta: str  
    estado: Optional[bool] = True  
class ModificarPreferencia(BaseModel):
    id: Optional[int] = None
    id_usuario: Optional[int] = None
    id_variable: Optional[int] = None
    alerta: Optional[str] = None
    estado: Optional[bool] = None  

class RespuestaPreferencia(BaseModel):
    id: int
    id_usuario: int
    id_variable: int
    alerta: str
    estado: bool 
    


#Propósito: Define las estructuras de los datos que se usan para la entrada y salida de datos en las API.

#Función: Los esquemas son clases de Pydantic que definen cómo los datos deben ser validados y transformados en la entrada y salida de las API. 
#Aseguran que los datos cumplan con el formato y las restricciones esperadas.

#--> CrearUsuario: Esquema para la entrada de datos cuando se crea un nuevo usuario.
#--> RespuestaUsuario: Esquema para la salida de datos, como la respuesta que se envía al cliente después de crear o recuperar un usuario. 
#--> orm_mode = True permite que el esquema convierta datos de los modelos ORM en un formato que Pydantic puede procesar.