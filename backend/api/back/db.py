from .models import *
from datetime import datetime


class UsuarioData:
    @staticmethod
    def login(usuario, contrasenia):
        try:
            return Usuario.objects.get(usuario=usuario, contrasenia=contrasenia)
        except Usuario.DoesNotExist:
            return None

    @staticmethod
    def crear_usuario(usuario_data):
        usuario = Usuario(
            fecha_nacimiento=usuario_data.get('fecha_nacimiento'),
            nombre=usuario_data.get('nombre'),
            apellido=usuario_data.get('apellido'),
            email=usuario_data.get('email'),
            usuario=usuario_data.get('usuario'),
            contrasenia=usuario_data.get('contrasenia'),  # Debería estar hasheada para mayor seguridad
            sexo=usuario_data.get('sexo'),
            celular=usuario_data.get('celular'),
            telefono=usuario_data.get('telefono'),
            direccion=usuario_data.get('direccion'),
        )
        usuario.save()
        return usuario

    @staticmethod
    def valida_usuario_email(email):
        return Usuario.objects.filter(email=email).exists()
    
    @staticmethod
    def valida_usuario_user(user):
        Usuario.objects.filter(usuario=user).exists()


class EmpresaData:
    @staticmethod
    def obtener_empresa_por_id(empresa_id):
        try:
            return Empresa.objects.get(id=empresa_id)
        except Empresa.DoesNotExist:
            return None

    @staticmethod
    def get_all():
        try:
            return Empresa.objects.all().values('id', 'denominacion', 'cuit', 'telefono', 'email')
        except Exception as e:
            print(f"Error al cargar las emrpesas: {e}")
            raise


class ClienteData:
    @staticmethod
    def crear_cliente(cliente_data, usuario, empresa):
        cliente = Cliente(
            id_usuario=usuario,
            ciudad=cliente_data.get('ciudad'),
            provincia=cliente_data.get('provincia'),
            cuit=cliente_data.get('cuit'),
            fecha_alta=datetime.now().date(),
            fecha_baja=cliente_data.get('fecha_baja'),
            monto_deuda=cliente_data.get('monto_deuda'),
            moneda_deuda=cliente_data.get('moneda_deuda'),
            id_empresa=empresa
        )
        try:
            cliente.save()
            return cliente
        except Exception as e:
            print(f"Error al cargar las emrpesas: {e}")
            raise


