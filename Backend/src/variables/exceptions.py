from typing import List
from src.variables.constants import ErrorCode
from src.exceptions import NotFound, BadRequest, PermissionDenied

# Excepciones para Usuario
class VariableNoEncontrada(NotFound):
    DETAIL = ErrorCode.VARIABLE_NO_ENCONTRADA