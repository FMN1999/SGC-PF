from .db import *
from django.core.exceptions import ValidationError


class UsuarioController:
    @staticmethod
    def login(usuario, contrasenia):
        return UsuarioData.login(usuario, contrasenia)

    @staticmethod
    def get_by_id(user_id):
        return UsuarioData.get_by_id(user_id)

    @staticmethod
    def actualizar_datos_perfil(userId, data):
        try:
            usuario = UsuarioData.get_by_id(userId)
            # Actualizar campos del usuario
            usuario.nombre = data.get('nombre', usuario.nombre)
            usuario.apellido = data.get('apellido', usuario.apellido)
            usuario.email = data.get('email', usuario.email)
            usuario.fecha_nacimiento = data.get('fecha_nacimento', usuario.fecha_nacimiento)
            UsuarioData.guardar_cambios(usuario)

            # Actualizar datos del cliente (si existen)
            cliente = ClienteData.get_by_user(usuario)
            if cliente:
                cliente.cuit = data.get('cuit', cliente.cuit)
                cliente.ciudad = data.get('ciudad', cliente.ciudad)
                cliente.provincia = data.get('provincia', cliente.provincia)
                ClienteData.guardar_cambios(cliente)

            # Actualizar datos del colaborador (si existen)
            colaborador = ColaboradorData.get_by_user(usuario)
            if colaborador:
                colaborador.puesto = data.get('puesto', colaborador.puesto)
                colaborador.rol = data.get('rol', colaborador.rol)
                ColaboradorData.guardar_cambios(colaborador)

            return usuario
        except Usuario.DoesNotExist:
            return None


class ColaboradorController:
    @staticmethod
    def get_by_user(user):
        return ColaboradorData.get_by_user(user)


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

    @staticmethod
    def get_by_user(user):
        return ClienteData.get_by_user(user)


class EmpresaController:
    @staticmethod
    def get_all():
        return EmpresaData.get_all()