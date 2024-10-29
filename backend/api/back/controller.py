from datetime import date

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

    @staticmethod
    def get_by_empresa(id_emp):
        return ColaboradorData.get_by_empresa(id_emp)

    @staticmethod
    def get_by_id(id_col):
        return ColaboradorData.get_by_id(id_col)

    @staticmethod
    def guardar_cambios(colaborador):
        return ColaboradorData.guardar_cambios(colaborador)


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

    @staticmethod
    def get_by_empresa(id_emp):
        return ClienteData.get_by_empresa(id_emp)

    @staticmethod
    def guardar_cambios(cliente):
        return ClienteData.guardar_cambios(cliente)

    @staticmethod
    def get_by_id(id_cli):
        return ClienteData.get_by_id(id_cli)


class EmpresaController:
    @staticmethod
    def get_all():
        return EmpresaData.get_all()


class ProveedorController:
    @staticmethod
    def crear_proveedor(proveedor_data):
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

    @staticmethod
    def get_materiales_by_proveedor(proveedor_id):
        prov = ProveedorData.get_by_id(proveedor_id)
        return ProveedorData.get_material_by_prov(prov)

    @staticmethod
    def get_servicios_by_proveedor(proveedor_id):
        prov = ProveedorData.get_by_id(proveedor_id)
        return ProveedorData.get_servicio_by_prov(prov)

    @staticmethod
    def actualizar_proveedor(id_prov, data):
        try:
            proveedor = ProveedorData.get_by_id(int(id_prov))

            proveedor.denominacion = data.get('denominacion')
            proveedor.telefono = data.get('telefono')
            proveedor.direccion = data.get('direccion')
            proveedor.email = data.get('email')
            proveedor.cuil = data.get('cuil')
            proveedor.ciudad = data.get('ciudad')
            proveedor.provincia = data.get('provincia')
            ProveedorData.actualizar_proveedor(proveedor)
            return True
        except Proveedor.DoesNotExist:
            return False

    @staticmethod
    def get_by_empresa(id_emp):
        return ProveedorData.get_by_empresa(id_emp)


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

    @staticmethod
    def crear_oferta_con_materiales_y_servicios(oferta_data, proveedor_id):
        try:
            proveedor = ProveedorData.get_by_id(proveedor_id)
            oferta = OfertaData.crear_oferta(oferta_data, proveedor)

            # Agregar materiales con datos adicionales
            materiales = oferta_data.get('materiales', [])
            for material_data in materiales:
                OfertaData.agregar_material_a_oferta(oferta, material_data)

            # Agregar servicios con datos adicionales
            servicios = oferta_data.get('servicios', [])
            for servicio_data in servicios:
                OfertaData.agregar_servicio_a_oferta(oferta, servicio_data)

            return oferta
        except Exception as e:
            raise ValidationError(f"Error al crear la oferta: {str(e)}")

    @staticmethod
    def eliminar_oferta(id_of):
        OfertaData.eliminar_oferta(id_of)


class MaterialController:
    @staticmethod
    def crear_material(material_data, proveedor_id):
        try:
            proveedor = ProveedorData.get_by_id(proveedor_id)
            material = MaterialData.crear_material(material_data, proveedor)

            return material
        except Proveedor.DoesNotExist:
            raise ValidationError("El proveedor no existe")
        except Exception as e:
            raise ValidationError(f"Error al crear el material: {str(e)}")

    @staticmethod
    def get_by_id(mat_id):
        return MaterialData.get_by_id(mat_id)

    @staticmethod
    def eliminar_material(material_id):
        MaterialData.eliminar_material(material_id)

    @staticmethod
    def actualizar_material(id_mat, data):
        return MaterialData.actualizar_material(id_mat, data)

    @staticmethod
    def get_by_empresa(id_empresa):
        return MaterialData.get_by_empresa(id_empresa)


class ServicioController:
    @staticmethod
    def crear_servicio(servicio_data, proveedor_id):
        try:
            proveedor = ProveedorData.get_by_id(proveedor_id)
            servicio = ServicioData.crear_servicio(servicio_data, proveedor)
            return servicio
        except Proveedor.DoesNotExist:
            raise ValidationError("El proveedor no existe")
        except Exception as e:
            raise ValidationError(f"Error al crear el servicio: {str(e)}")

    @staticmethod
    def get_by_id(serv_id):
        return ServicioData.get_by_id(serv_id)

    @staticmethod
    def eliminar_servicio(id_serv):
        ServicioData.eliminar_servicio(id_serv)
        
    @staticmethod
    def actualizar_servicio(id_serv, data):
        return ServicioData.actualizar_servicio(id_serv, data)

    @staticmethod
    def get_by_empresa(id_empresa):
        return ServicioData.get_by_empresa(id_empresa)


class ObraController:
    @staticmethod
    def create(data):
        direccion = data.get('direccion')
        id_cliente = data.get('id_cliente')
        telefono_contacto = data.get('telefono_contacto')
        fecha_inicio_est = data.get('fecha_inicio_est')
        fecha_fin_est = data.get('fecha_fin_est')
        monto_total_est = data.get('monto_total_est')
        moneda = data.get('moneda')
        pisos = data.get('pisos')
        dimensiones = data.get('dimensiones')
        estado = 'Nuevo'
        id_empresa = data.get('id_empresa')  # Viene del sessionStorage

        cliente = ClienteData.get_by_id(id_cliente)
        empresa = EmpresaData.obtener_empresa_por_id(id_empresa)

        nueva_obra = Obra.objects.create(
            direccion=direccion,
            id_cliente=cliente,
            telefono_contacto=telefono_contacto,
            fecha_inicio_est=datetime.strptime(fecha_inicio_est, '%Y-%m-%d'),
            fecha_fin_est=datetime.strptime(fecha_fin_est, '%Y-%m-%d'),
            monto_total_est= 0 if monto_total_est == '' else monto_total_est,
            moneda=moneda,
            pisos=pisos,
            dimensiones=dimensiones,
            estado=estado,
            id_empresa=empresa
        )
        return ObraData.guardar(nueva_obra)

    @staticmethod
    def get_by_id(id_obra):
        obra = ObraData.get_by_id(id_obra)
        data = {
            'id': obra.id,
            'direccion': obra.direccion,
            'cliente': {
                'id': obra.id_cliente.id,
                'nombre': f'{obra.id_cliente.id_usuario.nombre} {obra.id_cliente.id_usuario.apellido}'
            },
            'telefono_contacto': obra.telefono_contacto,
            'fecha_inicio_est': obra.fecha_inicio_est,
            'fecha_fin_est': obra.fecha_fin_est,
            'fecha_inicio_real': obra.fecha_inicio_real,
            'fecha_fin_real': obra.fecha_fin_real,
            'monto_total_est': obra.monto_total_est,
            'monto_total_real': obra.monto_total_real,
            'moneda': obra.moneda,
            'pisos': obra.pisos,
            'dimensiones': obra.dimensiones,
            'estado': obra.estado,
            'ganancias': obra.ganancias,
            'perdidas': obra.perdidas,
            'empresa': {
                'id': obra.id_empresa.id,
                'denominacion': obra.id_empresa.denominacion
            }
        }
        return data

    @staticmethod
    def actualizar(obra: Obra, data):
        obra.direccion = data.get('direccion')
        obra.telefono_contacto = data.get('telefono_contacto')
        obra.fecha_inicio_real = data.get('fecha_inicio_real')
        obra.fecha_fin_real = data.get('fecha_fin_real')
        obra.monto_total_est = data.get('monto_total_est')
        obra.monto_total_real = data.get('monto_total_real')
        obra.moneda = data.get('moneda')
        obra.pisos = data.get('pisos')
        obra.dimensiones = data.get('dimensiones')
        obra.estado = data.get('estado')
        obra.ganancias = data.get('ganancias')
        obra.perdidas = data.get('perdidas')
        return ObraData.guardar(obra)

    @staticmethod
    def agregar_nota(data):
        user = UsuarioData.get_by_id(data.get('id_usuario'))
        obra = ObraData.get_by_id(data.get('id_obra'))
        nota = Nota(
            id=random.randint(0000, 9999),
            descripcion=data.get('descripcion'),
            id_usuario= user,  # id_usuario desde el frontend
            fecha=datetime.now().date(),
            id_obra=obra
        )
        nota.save()
        return nota

    @staticmethod
    def agregar_foto(nota_id, url):
        foto = FotoAvances(
            id= random.randint(0000, 9999),
            id_avance_id=nota_id,
            url=url
        )
        foto.save()
        return foto

    @staticmethod
    def obtener_notas(id_obra):
        return ObraData.obtener_notas(id_obra)

    @staticmethod
    def delete_nota(nota_id):
        ObraData.delete_nota(nota_id)


class AreaController:
    @staticmethod
    def crear_area(data):
        obra = ObraData.get_by_id(data.get('id_obra'))
        nueva_area = Area(
            id_obra=obra,
            descripcion=data.get('descripcion'),
            dimensiones=data.get('dimensiones'),
            estado=data.get('estado'),
            porcentaje=data.get('porcentaje')
        )
        area = AreaData.guardar(nueva_area)
        return area

    @staticmethod
    def get_by_obra(id_obra):
        areas = AreaData.get_by_obra(id_obra)
        areas_list = [
            {
                'id': area.id,
                'descripcion': area.descripcion,
                'dimensiones': area.dimensiones,
                'estado': area.estado,
                'porcentaje': area.porcentaje,
                'id_obra': area.id_obra.id,
            } for area in areas
        ]
        return areas_list

    @staticmethod
    def get_by_id(area_id):
        return AreaData.get_by_id(area_id)

    @staticmethod
    def delete(area):
        AreaData.delete(area)


class PresupuestoController:
    @staticmethod
    def crear_presupuesto(data):
        # Extraer datos del presupuesto
        id_obra = data.get('id_obra')
        id_usuario = data.get('id_usuario')
        total = data.get('total')
        moneda = data.get('moneda')
        observaciones = data.get('observaciones', '')

        # Crear el presupuesto principal
        presupuesto = Presupuesto.objects.create(
            id_obra_id=id_obra,
            id_usuario_id=id_usuario,
            total=total,
            moneda=moneda,
            fecha_creacion=date.today(),
            observaciones=observaciones,
            estado='Nuevo',
            aprobado=False
        )

        # Procesar materiales
        for material in data.get('materiales', []):
            mat = MaterialData.get_by_id(material['id_material'])
            area = AreaData.get_by_id(material.get('id_area')) if material.get('id_area') is not '' else None
            Presupuesto_Material.objects.create(
                id_presupuesto=presupuesto,
                id_material=mat,
                cantidad=material['cantidad'],
                precio_x_unidad_medida=material['precio_x_unidad_medida'],
                unidad_medida=material['unidad_medida'],
                id_area=area,
                monto_linea=material['monto_linea']
            )

        # Procesar servicios
        for serv in data.get('servicios', []):
            servicio = ServicioData.get_by_id(serv.get('id_servicio'))
            area = AreaData.get_by_id(serv.get('id_area')) if serv.get('id_area') is not '' else None
            try:
                Presupuesto_Servicio.objects.create(
                    id=random.randint(0000000, 9999999),
                    id_presupuesto=presupuesto,
                    servicio=servicio,
                    precio_x_hora=serv['precio_x_hora'],
                    horas=serv['horas'],
                    moneda=serv['moneda'],
                    id_area=area,
                    monto_linea=serv['monto_linea']
                )
            except Exception as e:
                print(f"Error al obtener área: {str(e)}")
                raise
        # Procesar trabajadores
        for trabajador in data.get('trabajadores', []):
            usuario = UsuarioData.get_by_id(trabajador.get('id_usuario'))
            area = AreaData.get_by_id(trabajador.get('id_area')) if trabajador.get('id_area') is not '' else None
            try:
                Presupuesto_Trabajador.objects.create(
                    id=random.randint(0000000, 9999999),
                    id_presupuesto=presupuesto,
                    puesto=trabajador['puesto'],
                    horas=trabajador['horas'],
                    precio_x_hora=trabajador['precio_x_hora'],
                    moneda=trabajador['moneda'],
                    id_usuario=usuario,
                    id_area=area,
                    monto_linea=trabajador['monto_linea']
                )
            except Exception as e:
                print(f"Error al obtener área: {str(e)}")
                raise

        return presupuesto