from typing import List
from src.nodos.constants import ErrorCode
from src.exceptions import NotFound, BadRequest, PermissionDenied

# Excepciones para Usuario
class NodoNoEncontrado(NotFound):
    DETAIL = ErrorCode.NODO_NO_ENCONTRADO