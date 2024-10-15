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

    @staticmethod
    def crear_colaborador(usuario_data, colaborador_data):
        empresa = EmpresaData.obtener_empresa_por_id(int(colaborador_data.get('id_empresa')))
        if not empresa:
            raise ValidationError("La empresa seleccionada no existe")

        # Validar datos de usuario (por ejemplo, si el email ya está registrado)
        if UsuarioData.valida_usuario_email(usuario_data.get('email')):
            raise ValidationError("El email ya está en uso")

        if UsuarioData.valida_usuario_user(usuario_data.get('usuario')):
            raise ValidationError("El nombre de usuario ya está en uso")

        # Crear el usuario y el cliente dentro de una transacción
        try:
            usuario = UsuarioData.crear_usuario(usuario_data)
            colaborador = ColaboradorData.crear_colaborador(colaborador_data, usuario, empresa)
            return colaborador
        except Exception as e:
            raise ValidationError(f"Error al registrar el cliente: {str(e)}")


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


class ProveedorController:
    @staticmethod
    def crear_proveedor(proveedor_data):
        print(proveedor_data)
        empresa = EmpresaData.obtener_empresa_por_id(int(proveedor_data.get('id_empresa')))
        if not empresa:
            raise ValidationError("La empresa seleccionada no existe")
        print('encontré empresa')
        proveedor = ProveedorData.crear_proveedor(proveedor_data, empresa)

        return proveedor

    @staticmethod
    def get_by_id(prov_id):
        try:
            # Obtener el proveedor
            proveedor = ProveedorData.get_by_id(prov_id)

            # Obtener los materiales, servicios y ofertas relacionados
            materiales = ProveedorData.get_material_by_prov(proveedor)
            servicios = ProveedorData.get_servicio_by_prov(proveedor)
            ofertas = ProveedorData.get_oferta_by_prov(proveedor)

            # Convertir los objetos a diccionarios
            materiales_list = [
                {
                    'id': material.id,
                    'fecha_caducidad': material.fecha_caducidad,
                    'tipo_material': material.tipo_material,
                    'unidad_medida': material.unidad_medida,
                    'descripcion': material.descripcion,
                    'marca': material.marca,
                    'precio': material.precio,
                    'moneda': material.moneda,
                    'fecha_desde_precio': material.fecha_desde_precio,
                } for material in materiales
            ]

            servicios_list = [
                {
                    'id': servicio.id,
                    'descripcion': servicio.descripcion,
                    'precio_x_unidad': servicio.precio_x_unidad,
                    'unidad_medida': servicio.unidad_medida,
                    'monto_x_frecuencia': servicio.monto_x_frecuencia,
                    'frecuencia_pago': servicio.frecuencia_pago,
                } for servicio in servicios
            ]

            ofertas_list = [
                {
                    'id': oferta.id,
                    'descripcion': oferta.descripcion,
                    'monto_total': oferta.monto_total,
                    'moneda': oferta.moneda,
                    'fecha_desde': oferta.fecha_desde,
                    'fecha_hasta': oferta.fecha_hasta,
                } for oferta in ofertas
            ]

            # Estructurar los datos en un solo diccionario
            proveedor_detalle = {
                'proveedor': {
                    'denominacion': proveedor.denominacion,
                    'telefono': proveedor.telefono,
                    'direccion': proveedor.direccion,
                    'email': proveedor.email,
                    'cuil': proveedor.cuil,
                    'ciudad': proveedor.ciudad,
                    'provincia': proveedor.provincia,
                },
                'materiales': materiales_list,
                'servicios': servicios_list,
                'ofertas': ofertas_list,
            }
            return proveedor_detalle

        except Proveedor.DoesNotExist:
            raise ValidationError("El proveedor no existe")
        except Exception as e:
            raise ValidationError(f"Error al obtener el proveedor: {str(e)}")


class OfertaController:
    @staticmethod
    def obtener_oferta_con_datos(oferta_id):
        # Validar que la oferta exista
        oferta = OfertaData.get_by_id(oferta_id)
        if not oferta:
            raise ValidationError("Oferta no encontrada")

        # Obtener los materiales y servicios asociados a la oferta
        materiales = OfertaData.get_materiales(oferta)
        servicios = OfertaData.get_servicios(oferta)

        return {
            'oferta': oferta,
            'materiales': materiales,
            'servicios': servicios
        }