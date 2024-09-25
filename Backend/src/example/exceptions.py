from typing import List
from src.example.constants import ErrorCode
from src.exceptions import NotFound, BadRequest, PermissionDenied

# Excepciones para Usuario
class UsuarioNoEncontrado(NotFound):
    DETAIL = ErrorCode.USUARIO_NO_ENCONTRADO
