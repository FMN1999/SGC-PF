from .db import *
from django.core.exceptions import ValidationError


class UsuarioController:
    @staticmethod
    def login(usuario, contrasenia):
        return UsuarioData.login(usuario, contrasenia)


class ClienteController:
    @staticmethod
    def registrar_cliente(datos_usuario, datos_cliente, empresa_id):
        # Validar que la empresa existe
        empresa = EmpresaData.obtener_empresa_por_id(empresa_id)
        if not empresa:
            raise ValidationError("La empresa seleccionada no existe")

        # Validar datos de usuario (por ejemplo, si el email ya está registrado)
        if UsuarioData.valida_usuario_email(datos_usuario.get('email')):
            raise ValidationError("El email ya está en uso")

        if UsuarioData.valida_usuario_user(datos_usuario.get('usuario')):
            raise ValidationError("El nombre de usuario ya está en uso")

        # Crear el usuario y el cliente dentro de una transacción
        try:
            usuario = UsuarioData.crear_usuario(datos_usuario)
            cliente = ClienteData.crear_cliente(datos_cliente, usuario, empresa)
            return cliente
        except Exception as e:
            raise ValidationError(f"Error al registrar el cliente: {str(e)}")


class EmpresaController:
    @staticmethod
    def get_all():
        return EmpresaData.get_all()