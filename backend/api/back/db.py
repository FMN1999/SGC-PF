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
    def get_by_id(user_id):
        return Usuario.objects.get(id=user_id)

    @staticmethod
    def valida_usuario_email(email):
        return Usuario.objects.filter(email=email).exists()

    @staticmethod
    def valida_usuario_user(user):
        Usuario.objects.filter(usuario=user).exists()

    @staticmethod
    def guardar_cambios(usuario):
        usuario.save()


class ColaboradorData:
    @staticmethod
    def get_by_user(user: Usuario):
        try:
            return Colaborador.objects.get(id_usuario=user)
        except Colaborador.DoesNotExist:
            return None

    @staticmethod
    def guardar_cambios(colaborador):
        colaborador.save()

    @staticmethod
    def crear_colaborador(colaborador_data, usuario, empresa):
        try:

            colaborador = Colaborador(
                id_usuario=usuario,
                id_empresa=empresa,
                rol=colaborador_data.get('rol'),
                puesto=colaborador_data.get('puesto'),
                fecha_alta=datetime.now().date(),
            )
            colaborador.save()
            return colaborador
        except Exception as e:
            print(f"Error al cargar el colaborador: {e}")
            raise


class EmpresaData:
    @staticmethod
    def obtener_empresa_por_id(empresa_id):
        try:
            return Empresa.objects.get(id=empresa_id)
        except Exception as e:
            print(f"Error al cargar las emrpesas: {e}")
            raise

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

    @staticmethod
    def get_by_user(user: Usuario):
        try:
            return Cliente.objects.get(id_usuario=user)
        except Cliente.DoesNotExist:
            return None

    @staticmethod
    def guardar_cambios(cliente):
        cliente.save()


class ProveedorData:
    @staticmethod
    def crear_proveedor(prov, emp):
        try:
            proveedor = Proveedor(
                denominacion=prov.get('denominacion'),
                telefono=prov.get('telefono'),
                direccion=prov.get('direccion'),
                email=prov.get('email'),
                cuil=prov.get('cuil'),
                ciudad=prov.get('ciudad'),
                provincia=prov.get('provincia'),
                id_empresa=emp
            )
            proveedor.save()
            return proveedor
        except Exception as e:
            print(f"Error al cargar las emrpesas: {e}")
            raise

    @staticmethod
    def get_by_id(prov_id):
        return Proveedor.objects.get(id=prov_id)

    @staticmethod
    def get_material_by_prov(prov: Proveedor):
        return Material.objects.filter(id_proveedor=prov)

    @staticmethod
    def get_servicio_by_prov(prov: Proveedor):
        return Servicio.objects.filter(id_proveedor=prov)

    @staticmethod
    def get_oferta_by_prov(prov: Proveedor):
        return Oferta.objects.filter(id_proveedor=prov)


class OfertaData:
    @staticmethod
    def get_materiales(oferta: Oferta):
        return Oferta_Material.objects.filter(id_oferta=oferta)

    @staticmethod
    def get_servicios(oferta: Oferta):
        return Oferta_Servicio.objects.filter(id_oferta=oferta)

    @staticmethod
    def get_by_id(oferta_id):
        return Oferta.objects.get(id=oferta_id)


class MaterialData:
    @staticmethod
    def crear_material(material_data, proveedor):
        try:
            material = Material(
                fecha_caducidad=material_data.get('fecha_caducidad'),
                tipo_material=material_data.get('tipo_material'),
                unidad_medida=material_data.get('unidad_medida'),
                descripcion=material_data.get('descripcion'),
                marca=material_data.get('marca'),
                precio=material_data.get('precio'),
                moneda=material_data.get('moneda'),
                fecha_desde_precio=material_data.get('fecha_desde_precio'),
                id_proveedor=proveedor
            )
            material.save()
            return material
        except Exception as e:
            print(f"Error al crear el material: {e}")
            raise
