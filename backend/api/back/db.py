from .models import *
from datetime import datetime
import random


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

    @staticmethod
    def get_by_empresa(empresa: Empresa):
        try:
            return Colaborador.objects.filter(id_empresa=empresa)
        except Exception as e:
            print(f"Error al cargar colaboradores: {e}")
            raise

    @staticmethod
    def get_by_id(id_col):
        return Colaborador.objects.get(id=id_col)


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
    def get_by_empresa(id_emp: Empresa):
        try:
            return Cliente.objects.filter(id_empresa=id_emp)
        except Exception as e:
            print(f"Error al cargar los clientes: {e}")
            raise

    @staticmethod
    def guardar_cambios(cliente):
        cliente.save()

    @staticmethod
    def get_by_id(id_cli):
        try:
            return Cliente.objects.get(id=id_cli)
        except Exception as e:
            print(f"Error al cargar los clientes: {e}")
            raise


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

    @staticmethod
    def actualizar_proveedor(prov: Proveedor):
        try:
            prov.save()
        except Exception as e:
            print(f"Error al cargar las emrpesas: {e}")
            raise

    @staticmethod
    def get_by_empresa(id_empresa: Empresa):
        try:
            return Proveedor.objects.filter(id_empresa=id_empresa)
        except Exception as e:
            print(f"Error al cargar los prov: {e}")
            raise


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

    @staticmethod
    def crear_oferta(oferta_data, proveedor):
        try:
            oferta = Oferta(
                id=random.randint(1000, 9999),
                descripcion=oferta_data.get('descripcion'),
                monto_total=oferta_data.get('monto_total'),
                moneda=oferta_data.get('moneda'),
                fecha_desde=oferta_data.get('fecha_desde'),
                fecha_hasta=oferta_data.get('fecha_hasta'),
                id_proveedor=proveedor
            )
            oferta.save()
            return oferta
        except Exception as e:
            print(f"Error al cargar las emrpesas: {e}")
            raise

    @staticmethod
    def agregar_material_a_oferta(oferta, material_data):
        try:
            oferta_material = Oferta_Material(
                id=random.randint(1000, 9999),
                id_oferta=oferta,
                id_material=MaterialData.get_by_id(material_data['id_material']),
                cantidad_of=material_data.get('cantidad_of'),
                unidad_of=material_data.get('unidad_of'),
                monto=material_data.get('monto'),
                moneda=material_data.get('moneda'),
                porc_desc=material_data.get('porc_desc')
            )
            oferta_material.save()
        except Exception as e:
            print(f"Error al cargar las emrpesas: {e}")
            raise

    @staticmethod
    def agregar_servicio_a_oferta(oferta, servicio_data):
        try:
            oferta_servicio = Oferta_Servicio(
                id=random.randint(1000, 9999),
                id_oferta=oferta,
                id_servicio=ServicioData.get_by_id(servicio_data['id_servicio']),
                cantidad_of=servicio_data.get('cantidad_of'),
                unidad_tiempo=servicio_data.get('unidad_tiempo'),
                monto=servicio_data.get('monto'),
                moneda=servicio_data.get('moneda'),
                porc_desc=servicio_data.get('porc_desc')
            )
            oferta_servicio.save()
        except Exception as e:
            print(f"Error al cargar las emrpesas: {e}")
            raise

    @staticmethod
    def eliminar_oferta(oferta_id):
        oferta = Oferta.objects.get(id=oferta_id)
        oferta.delete()


class MaterialData:

    @staticmethod
    def get_by_id(id_mat):
        try:
            return Material.objects.get(id=id_mat)
        except Exception as e:
            print(f"Error al buscar material: {e}")
            raise

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

    @staticmethod
    def eliminar_material(id_mat):
        material = Material.objects.get(id=id_mat)
        material.delete()

    @staticmethod
    def actualizar_material(material_id, data):
        # Obtener el material desde la base de datos
        material = Material.objects.get(id=material_id)

        # Actualizar los campos del material con los datos proporcionados
        material.descripcion = data.get('descripcion', material.descripcion)
        material.marca = data.get('marca', material.marca)
        material.precio = data.get('precio', material.precio)
        material.moneda = data.get('moneda', material.moneda)
        material.fecha_caducidad = data.get('fecha_caducidad', material.fecha_caducidad)
        material.unidad_medida = data.get('unidad_medida', material.unidad_medida)

        # Guardar los cambios en la base de datos
        material.save()

        # Retornar el material actualizado (puedes convertirlo a dict si es necesario)
        return {
            'id': material.id,
            'descripcion': material.descripcion,
            'marca': material.marca,
            'precio': material.precio,
            'moneda': material.moneda,
            'fecha_caducidad': material.fecha_caducidad,
            'unidad_medida': material.unidad_medida
        }

    @staticmethod
    def get_by_empresa(id_emp):
        return Material.objects.filter(id_proveedor__id_empresa=id_emp)


class ServicioData:
    @staticmethod
    def get_by_id(id_serv):
        try:
            return Servicio.objects.get(id=id_serv)
        except Exception as e:
            print(f"Error al buscar material: {e}")
            raise

    @staticmethod
    def crear_servicio(servicio_data, proveedor):
        try:
            servicio = Servicio(
                id=random.randint(1000, 9999),
                descripcion=servicio_data.get('descripcion'),
                precio_x_unidad=servicio_data.get('precio_x_unidad'),
                unidad_medida=servicio_data.get('unidad_medida'),
                monto_x_frecuencia=servicio_data.get('monto_x_frecuencia'),
                frecuencia_pago=servicio_data.get('frecuencia_pago'),
                id_proveedor=proveedor
            )
            servicio.save()
            return servicio
        except Exception as e:
            print(f"Error al crear el servicio: {str(e)}")
            raise

    @staticmethod
    def eliminar_servicio(id_serv):
        servicio = Servicio.objects.get(id=id_serv)
        servicio.delete()

    @staticmethod
    def actualizar_servicio(servicio_id, data):
        # Obtener el servicio desde la base de datos
        servicio = Servicio.objects.get(id=servicio_id)

        # Actualizar los campos del servicio con los datos proporcionados
        servicio.descripcion = data.get('descripcion')
        servicio.precio_x_unidad = data.get('precio_x_unidad')
        servicio.moneda = data.get('moneda')
        servicio.unidad_medida = data.get('unidad_medida')
        servicio.frecuencia_pago = data.get('frecuencia_pago')
        servicio.monto_x_frecuencia = data.get('monto_x_frecuencia')

        # Guardar los cambios en la base de datos
        servicio.save()

        # Retornar el servicio actualizado
        return {
            'id': servicio.id,
            'descripcion': servicio.descripcion,
            'precio_x_unidad': servicio.precio_x_unidad,
            'moneda': servicio.moneda,
            'unidad_medida': servicio.unidad_medida,
            'frecuencia_pago': servicio.frecuencia_pago,
            'monto_x_frecuencia': servicio.monto_x_frecuencia
        }

    @staticmethod
    def get_by_empresa(id_emp):
        return Servicio.objects.filter(id_proveedor__id_empresa=id_emp)