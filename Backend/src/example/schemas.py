from pydantic import BaseModel, EmailStr, field_validator
from typing import List
from datetime import datetime
from src.example.constants import ErrorCode
from src.example import exceptions

# Los siguientes schemas contienen atributos sin muchas restricciones de tipo.
# Podemos crear atributos con ciertas reglas mediante el uso de un "Field" adecuado.
# https://docs.pydantic.dev/latest/concepts/fields/

class CrearUsuario (BaseModel): 
    usuario:str
    email:str
    edad: int
    password: str

class RespuestaUsuario(BaseModel): 
    id:int
    usuario:str
    email:str
    edad: int

class LoginRequest(BaseModel):
    usuario: str
    password: str

class Config: 
    orm_mode= True


#Propósito: Define las estructuras de los datos que se usan para la entrada y salida de datos en las API.

#Función: Los esquemas son clases de Pydantic que definen cómo los datos deben ser validados y transformados en la entrada y salida de las API. 
#Aseguran que los datos cumplan con el formato y las restricciones esperadas.

#--> CrearUsuario: Esquema para la entrada de datos cuando se crea un nuevo usuario.
#--> RespuestaUsuario: Esquema para la salida de datos, como la respuesta que se envía al cliente después de crear o recuperar un usuario. 
#--> orm_mode = True permite que el esquema convierta datos de los modelos ORM en un formato que Pydantic puede procesar.