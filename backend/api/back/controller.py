from .db import *

class UsuarioController:
    @staticmethod
    def login(usuario, contrasenia):
        return UsuarioData.login(usuario, contrasenia)