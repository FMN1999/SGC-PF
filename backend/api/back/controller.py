from datetime import date
from django.db.models import F, Sum, Q
from django.utils import timezone
from geopy.distance import geodesic  # Para calcular distancias geográficas
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
        print(int(colaborador_data.get('id_empresa')))
        empresa = EmpresaData.obtener_empresa_por_id(int(colaborador_data.get('id_empresa')))
        print(empresa.id)
        if UsuarioData.valida_usuario_email(usuario_data.get('email')):
            raise ValidationError("El email ya está en uso")

        if UsuarioData.valida_usuario_user(usuario_data.get('usuario')):
            raise ValidationError("El nombre de usuario ya está en uso")

        usuario = UsuarioData.crear_usuario(usuario_data)
        colaborador = ColaboradorData.crear_colaborador(colaborador_data, usuario, empresa)
        return colaborador

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

    @staticmethod
    def get_vehiculos(id_empresa):
        return EmpresaData.get_vehiculos(id_empresa)

    @staticmethod
    def get_herramientas(id_empresa):
        return EmpresaData.get_herramientas(id_empresa)

    @staticmethod
    def get_almacenes(id_empresa):
        return EmpresaData.get_almacenes(id_empresa)


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
            print(materiales)
            print(servicios)
            print(ofertas)

            # Convertir los objetos a diccionarios
            materiales_list = [
                {
                    'id': material.id,
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
        tipo_obra = data.get('tipo_obra')
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
            fecha_inicio_est=datetime.strptime(fecha_inicio_est, '%Y-%m-%d') if fecha_inicio_est else None,
            fecha_fin_est=datetime.strptime(fecha_fin_est, '%Y-%m-%d') if fecha_fin_est else None,
            monto_total_est= 0 if monto_total_est == '' else monto_total_est,
            moneda=moneda,
            pisos=pisos if pisos else 0,
            dimensiones=dimensiones,
            estado=estado,
            id_empresa=empresa,
            tipo_obra=tipo_obra
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
        porc_inflacion= data.get('porc_inflacion',0)

        # Crear el presupuesto principal
        presupuesto = Presupuesto.objects.create(
            id_obra_id=id_obra,
            id_usuario_id=id_usuario,
            total=total,
            moneda=moneda,
            fecha_creacion=date.today(),
            observaciones=observaciones,
            estado='Nuevo',
            aprobado=False,
            porc_inflacion=porc_inflacion
        )

        # Procesar materiales
        for material in data.get('materiales', []):
            area = AreaData.get_by_id(material.get('id_area')) if material.get('id_area') != '' else None
            Presupuesto_Material.objects.create(
                id_presupuesto=presupuesto,
                desc_material=material['desc_material'],
                cantidad=material['cantidad'],
                precio_x_unidad_medida=material['precio_x_unidad_medida'],
                unidad_medida=material['unidad_medida'],
                id_area=area,
                monto_linea=material['monto_linea']
            )

        # Procesar servicios
        for serv in data.get('servicios', []):
            area = AreaData.get_by_id(serv.get('id_area')) if serv.get('id_area') != '' else None
            try:
                Presupuesto_Servicio.objects.create(
                    id=random.randint(0000000, 9999999),
                    id_presupuesto=presupuesto,
                    desc_servicio=serv.get('desc_servicio'),
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
            area = AreaData.get_by_id(trabajador.get('id_area')) if trabajador.get('id_area') != '' else None
            try:
                Presupuesto_Trabajador.objects.create(
                    id=random.randint(0000000, 9999999),
                    id_presupuesto=presupuesto,
                    puesto=trabajador['puesto'],
                    horas=trabajador['horas'],
                    precio_x_hora=trabajador['precio_x_hora'],
                    moneda=trabajador['moneda'],
                    id_area=area,
                    monto_linea=trabajador['monto_linea']
                )
            except Exception as e:
                print(f"Error al obtener área: {str(e)}")
                raise

        return presupuesto

    @staticmethod
    def get_by_obra(id_obra):
        return PresupuestoData.get_by_obra(id_obra)

    @staticmethod
    def get_by_id(id_presupuesto):
        return PresupuestoData.get_presupuesto_detalles(id_presupuesto)

    @staticmethod
    def update_presupuesto(id_presupuesto, data):
        try:
            # Actualizar los datos del presupuesto
            presupuesto_actualizado = PresupuestoData.update(id_presupuesto, data)

            # Actualizar Materiales
            materiales_data = data.get("materiales", [])
            PresupuestoData.update_materiales(id_presupuesto, materiales_data)

            # Actualizar Servicios
            servicios_data = data.get("servicios", [])
            PresupuestoData.update_servicios(id_presupuesto, servicios_data)

            # Actualizar Trabajadores
            trabajadores_data = data.get("trabajadores", [])
            PresupuestoData.update_trabajadores(id_presupuesto, trabajadores_data)

            return presupuesto_actualizado
        except Exception as e:
            print(f"Error al actualizar los detalles del presupuesto: {str(e)}")
            raise

    @staticmethod
    def get_materiales_por_presupuesto(id_presupuesto):
        presupuesto_materiales = Presupuesto_Material.objects.filter(id_presupuesto=id_presupuesto)
        print(presupuesto_materiales)
        return [
            {
                "cantidad": pm.cantidad,
                "precio_total": pm.precio_x_unidad_medida,
                "unidad_medida": pm.unidad_medida,
                "id_material": pm.desc_material
            }
            for pm in presupuesto_materiales
        ]

    @staticmethod
    def get_servicios_por_presupuesto(id_presupuesto):
        presupuesto_servicios = Presupuesto_Servicio.objects.filter(id_presupuesto=id_presupuesto)
        servicios = []

        for ps in presupuesto_servicios:
            try:
                id_area = ps.id_area.id if ps.id_area else None
            except Presupuesto_Servicio.id_area.RelatedObjectDoesNotExist:
                id_area = None

            servicios.append({
                "id_presupuesto_servicio": ps.id,
                "precio_x_hora": ps.precio_x_hora,
                "horas": ps.horas,
                "moneda": ps.moneda,
                "monto_linea": ps.monto_linea,
                "id_area": id_area,
                "desc_servicio": ps.desc_servicio,
            })

        return servicios


# controller.py
class CompraController:
    @staticmethod
    def crear_solicitud_compra(data):
        compras_creadas = []

        # Dividir las líneas de compra por id_proveedor
        lineas_por_proveedor = {}
        for linea in data['lineas_compra']:
            id_material = linea.get('id_material')
            material = MaterialData.get_by_id(id_material)
            id_proveedor = material.id_proveedor.id
            if id_proveedor not in lineas_por_proveedor:
                lineas_por_proveedor[id_proveedor] = []
            lineas_por_proveedor[id_proveedor].append(linea)

        print(lineas_por_proveedor)

        # Crear una compra para cada proveedor con sus líneas correspondientes
        for id_proveedor, lineas in lineas_por_proveedor.items():
            proveedor = Proveedor.objects.get(id=id_proveedor)
            obra = Obra.objects.get(id=data['id_obra'])
            solicitante = Usuario.objects.get(id=data['id_solicitante'])
            aprobador = Usuario.objects.get(id=data['id_aprobador']) if data.get('id_aprobador') else None

            compra = Compra.objects.create(
                monto_total=data['monto_total'],
                fecha_compra=datetime.now(),
                id_proveedor=proveedor,
                id_obra=obra,
                costo_transporte=data['costo_transporte'],
                moneda_transporte=data['moneda_transporte'],
                estado=data['estado'],
                id_solicitante=solicitante,
                id_aprobador=aprobador
            )
            nro = 1

            # Crear LineaCompra para cada material en la lista del proveedor
            for linea_data in lineas:
                material = Material.objects.get(id=linea_data['id_material'])
                pres_mat = Presupuesto_Material.objects.get(id=linea_data.get('id_presupuesto_material')) if linea_data.get('id_presupuesto_material') is not None else None
                try:
                    LineaCompra.objects.create(
                        nr_posicion=nro,
                        cantidad=linea_data['cantidad'],
                        lote=linea_data.get('lote', 0),
                        nro_serie=linea_data.get('nro_serie') if linea_data.get('nro_serie') != '' else 0,
                        precio_total=linea_data.get('precio_total', 0),
                        id_material=material,
                        unidad_medida=linea_data['unidad_medida'],
                        id_presupuesto_material=pres_mat,
                        id_compra=compra
                    )
                except Exception as e:
                    print(f"Error al obtener área: {str(e)}")
                    raise
                nro += 1

            # Agregar la compra creada a la lista para la respuesta
            compras_creadas.append(compra)

        return compras_creadas

    @staticmethod
    def obtener_compra_con_lineas(compra_id):
        compra, lineas = CompraData.obtener_compra_y_lineas(compra_id)
        compra_data = {
            'id': compra.id,
            'monto_total': compra.monto_total,
            'fecha_compra': compra.fecha_compra,
            'id_proveedor': compra.id_proveedor.id,
            'proveedor': compra.id_proveedor.denominacion,
            'id_obra': compra.id_obra.id,
            'costo_transporte': compra.costo_transporte,
            'moneda_transporte': compra.moneda_transporte,
            'estado': compra.estado,
            'id_solicitante': compra.id_solicitante.id,
            'id_aprobador': compra.id_aprobador.id if compra.id_aprobador else None,
            'nombre_aprobador': compra.id_aprobador.nombre if compra.id_aprobador else None,
            'apellido_aprobador': compra.id_aprobador.apellido if compra.id_aprobador else None,
            'lineas_compra': [
                {
                    'nr_posicion': linea.nr_posicion,
                    'cantidad': linea.cantidad,
                    'lote': linea.lote,
                    'nro_serie': linea.nro_serie,
                    'precio_total': linea.precio_total,
                    'id_material': linea.id_material.id,
                    'material': linea.id_material.descripcion,
                    'unidad_medida': linea.unidad_medida
                } for linea in lineas
            ]
        }
        return compra_data

    @staticmethod
    def cambiar_estado_compra(compra_id, nuevo_estado):
        compra = CompraData.actualizar_estado_compra(compra_id, nuevo_estado)
        return compra is not None


class IngresoController:
    @staticmethod
    def crear_ingreso(data):
        almacen = Almacen.objects.get(id=data.get('id_almacen')) if data.get('id_almacen') else None
        compra = Compra.objects.get(id=data.get('id_compra')) if data.get('id_compra') else None
        material = Material.objects.get(id=data.get('id_material'))

        ingreso = Ingreso(
            cantidad=data.get('cantidad'),
            fecha=data.get('fecha'),
            id_material=material,
            unidad_medida=data.get('unidad_medida'),
            id_almacen=almacen,
            id_compra=compra,
            fecha_real=data.get('fecha_real'),
            realizado=data.get('realizado', False),
            en_obra=data.get('en_obra', False)
        )
        try:
            idMaterial = data.get('id_material')
            h=Herramienta.objects.get(id=idMaterial)
            h.id_almacen = almacen
            h.save()
        except Exception as e:
            print(f"Error al asignar almacén: {str(e)}")
            raise

        ingreso.save()
        return ingreso


class PagoController:
    @staticmethod
    def crear_pago(monto, moneda, cuota, id_proveedor, id_compra, id_subcontratacion, fecha_pago):
        # Validar campos obligatorios
        if not monto or not moneda or cuota is None or not id_proveedor:
            return {'status': 'error', 'error': 'Faltan campos obligatorios'}

        # Llamada a la capa de datos para almacenar el pago
        pago_id = PagoData.guardar_pago(monto, moneda, cuota, id_proveedor, id_compra, id_subcontratacion, fecha_pago)
        if pago_id:
            return {'status': 'success', 'pago_id': pago_id}
        else:
            return {'status': 'error', 'error': 'Error al guardar el pago en la base de datos'}


class ChatController:
    @staticmethod
    def generador_presupuesto(data):
        PALABRAS_EXCLUIDAS = {'de', 'con', 'para', 'el', 'la', 'los', 'las', 'y', 'en', 'a', 'un', 'una'}
        obra = ObraData.get_by_id(data)
        dimensiones = obra.dimensiones
        tipo_obra = obra.tipo_obra

        palabras_clave = [
            palabra for palabra in tipo_obra.split()
            if palabra.lower() not in PALABRAS_EXCLUIDAS
        ]

        # Crear un Q object dinámico para materiales
        query_materiales = Q()
        for palabra in palabras_clave:
            query_materiales |= Q(tipo_material__icontains=palabra) | Q(descripcion__icontains=palabra)

        # Buscar materiales que coincidan con las palabras clave
        materiales = Material.objects.filter(query_materiales)

        # Crear un Q object dinámico para servicios
        query_servicios = Q()
        for palabra in palabras_clave:
            query_servicios |= Q(descripcion__icontains=palabra) | Q(unidad_medida__icontains=palabra)

        # Buscar servicios que coincidan con las palabras clave
        servicios = Servicio.objects.filter(query_servicios)

        # Calcula costos estimados sumando precios de materiales y servicios
        total_materiales = materiales.aggregate(total=Sum(F('precio') + F('impuestos_total') + F('otros_gastos')))
        total_servicios = servicios.aggregate(
            total=Sum(F('precio_x_unidad') + F('impuestos_total') + F('otros_gastos')))

        # Calcula un total general
        total_estimado = (total_materiales['total'] or 0) + (total_servicios['total'] or 0)

        # Organiza los datos de respuesta
        response_data = {
            "direccion": obra.direccion,
            "total": obra.monto_total_est,
            "moneda": obra.moneda,
            "materiales": list(materiales.values('id', 'descripcion','unidad_medida', 'marca', 'precio', 'moneda')),
            "servicios": list(
                servicios.values('id', 'descripcion', 'precio_x_unidad', 'moneda', 'unidad_medida')),
            "total_estimado": total_estimado,
        }

        # Responde con los datos en formato JSON
        return response_data

    @staticmethod
    def recomendaciones_materiales(cliente_id):
        # Obtener el cliente
        cliente = Cliente.objects.get(id=cliente_id)

        # Buscar las obras previas del cliente
        obras_previas = Obra.objects.filter(id_cliente=cliente)

        # Buscar materiales usados en estas obras previas
        materiales_utilizados = LineaCompra.objects.filter(id_compra__id_obra__in=obras_previas).distinct()

        # Filtrar las ofertas activas
        fecha_actual = timezone.now().date()
        ofertas_activas = Oferta.objects.filter(fecha_desde__lte=fecha_actual, fecha_hasta__gte=fecha_actual)

        # Buscar materiales en oferta
        materiales_oferta = Oferta_Material.objects.filter(id_oferta__in=ofertas_activas.values_list('id', flat=True))

        # Construir la respuesta
        recomendaciones = []
        for material in materiales_utilizados:
            ofertas = materiales_oferta.filter(id_material=material.id_material)
            ofertas_data = [{"descripcion": oferta.id_oferta.descripcion, "descuento": oferta.porc_desc} for oferta in
                            ofertas]
            recomendaciones.append({
                "material_id": material.id,
                "descripcion": material.id_material.descripcion,
                "marca": material.id_material.marca,
                "precio": material.id_material.precio,
                "moneda": material.id_material.moneda,
                "unidad_medida": material.id_material.unidad_medida,
                "ofertas": ofertas_data,
            })

        return recomendaciones

    @staticmethod
    def ofertas_especiales():
        # Obtener la fecha actual para filtrar ofertas activas
        fecha_actual = timezone.now().date()
        ofertas_activas = Oferta.objects.filter(fecha_desde__lte=fecha_actual, fecha_hasta__gte=fecha_actual)

        # Filtrar ofertas de materiales y servicios aplicables al tipo de obra o cliente
        ofertas_materiales = Oferta_Material.objects.filter(id_oferta__in=ofertas_activas)
        ofertas_servicios = Oferta_Servicio.objects.filter(id_oferta__in=ofertas_activas)

        # Construir la respuesta
        ofertas = {
            "materiales": [],
            "servicios": []
        }

        # Procesar las ofertas de materiales
        for oferta_material in ofertas_materiales:
            ofertas["materiales"].append({
                "material_id": oferta_material.id_material.id,
                "descripcion_material": oferta_material.id_material.descripcion,
                "marca": oferta_material.id_material.marca,
                "descuento": oferta_material.porc_desc,
                "descripcion_oferta": oferta_material.id_oferta.descripcion,
                "fecha_hasta": oferta_material.id_oferta.fecha_hasta
            })

        # Procesar las ofertas de servicios
        for oferta_servicio in ofertas_servicios:
            ofertas["servicios"].append({
                "servicio_id": oferta_servicio.id_servicio.id,
                "descripcion_servicio": oferta_servicio.id_servicio.descripcion,
                "descuento": oferta_servicio.porc_desc,
                "descripcion_oferta": oferta_servicio.id_oferta.descripcion,
                "fecha_hasta": oferta_servicio.id_oferta.fecha_hasta
            })

        return ofertas

    @staticmethod
    def calcular_transporte_almacenaje(obra_id):
        # Obtener la obra y el almacén relacionado
        print(obra_id)
        obra = Obra.objects.get(id=obra_id)
        almacen = Almacen.objects.get(id=obra.id_almacen.id)

        # Calcular la distancia entre la obra y el almacén
        distancia = geodesic((obra.latitud, obra.longitud), (almacen.latitud, almacen.longitud)).km

        # Obtener los materiales necesarios y sus cantidades
        compras = Compra.objects.filter(id_obra=obra_id)
        materiales = [{"material": compra.id_material, "cantidad": compra.cantidad} for compra in compras]

        # Obtener vehículos disponibles y calcular costo de transporte
        vehiculos = Vehiculo.objects.all()
        transporte_opciones = []

        for vehiculo in vehiculos:
            costo_transporte = vehiculo.costo_km * distancia
            transporte_opciones.append({
                "vehiculo_id": vehiculo.id,
                "descripcion_vehiculo": vehiculo.descripcion,
                "capacidad": vehiculo.capacidad,
                "costo_transporte": costo_transporte
            })

        # Opciones de almacenaje: se puede personalizar según la necesidad
        costo_almacenaje = almacen.costo_almacenaje  # Ejemplo simplificado

        data_return = {
            "distancia_km": distancia,
            "transporte_opciones": transporte_opciones,
            "costo_almacenaje": costo_almacenaje
        }
        return data_return

    @staticmethod
    def seguimiento_avance_obra(obra_id):
        # Obtener la obra y sus tareas asociadas
        obra = Obra.objects.get(id=obra_id)
        tareas = Tarea.objects.filter(id_area__id_obra=obra_id)
        # Variables de control de avance
        avance_total = 0
        tareas_data = []

        for tarea in tareas:
            # Calcular porcentaje de avance de cada tarea
            porcentaje_avance = tarea.porcentaje_avance  # Suponiendo que este campo almacena el progreso
            avance_total += porcentaje_avance

            # Obtener colaboradores, materiales y herramientas asignados a la tarea
            colaboradores = Tarea_Colaborador.objects.filter(id_tarea=tarea.id)
            materiales = Tarea_Material.objects.filter(id_tarea=tarea.id)
            herramientas = Tarea_Herramienta.objects.filter(id_tarea=tarea.id)

            # Formato de cada tarea para la respuesta
            tareas_data.append({
                "tarea_id": tarea.id,
                "descripcion": tarea.descripcion,
                "porcentaje_avance": porcentaje_avance,
                "colaboradores": [{"id": col.id_colaborador.id, "nombre": col.id_colaborador.id_usuario.nombre, "apellido":col.id_colaborador.id_usuario.apellido } for col in
                                  colaboradores],
                "materiales": [{"id": mat.id_material.id, "nombre": mat.id_material.descripcion} for mat in materiales],
                "herramientas": [{"id": her.id_herramienta.id, "nombre": her.id_herramienta.id_material.descripcion} for her in
                                 herramientas]
            })

        # Cálculo del avance general de la obra
        avance_general = avance_total / len(tareas) if tareas else 0

        data_return={
            "obra_id": obra_id,
            "nombre_obra": obra.direccion,
            "avance_general": avance_general,
            "tareas": tareas_data
        }
        return data_return

    @staticmethod
    def calcular_promedio_historial(material_id):
        # Calcular el costo promedio histórico de un material en proyectos anteriores
        compras_historial = LineaCompra.objects.filter(id_material=material_id)
        total_costo = sum([compra.precio_total for compra in compras_historial])
        total_cantidad = sum([compra.cantidad for compra in compras_historial])
        return total_costo / total_cantidad if total_cantidad else 0

    @staticmethod
    def optimizacion_costos(obra_id):
        # Obtener la obra actual
        obra = Obra.objects.get(id=obra_id)

        # Obtener el presupuesto de la obra actual
        presupuesto_actual = Presupuesto.objects.filter(id_obra=obra_id)

        # Obtener las compras realizadas en la obra
        compras_obra = LineaCompra.objects.filter(id_compra__id_obra=obra_id)

        # Obtener subcontrataciones de obras previas
        subcontrataciones_previas = Subcontratacion.objects.filter(id_obra__id_cliente=obra.id_cliente)

        # Calcular costos de materiales
        costos_materiales = {}
        for compra in compras_obra:
            material = compra.id_material
            costos_materiales[material.id] = costos_materiales.get(material.id, 0) + compra.precio_total

        # Calcular costos de servicios
        costos_servicios = {}
        for sub in subcontrataciones_previas:
            servicio = sub.id_servicio
            costos_servicios[servicio.id] = costos_servicios.get(servicio.id, 0) + sub.monto_contratacion

        # Calcular el presupuesto total actual
        total_presupuesto = sum([p.total for p in presupuesto_actual])

        # Sugerencias de optimización de materiales
        sugerencias_materiales = []
        for material_id, costo in costos_materiales.items():
            material = Material.objects.get(id=material_id)
            promedio_costo_material = ChatController.calcular_promedio_historial(material_id)
            if costo > promedio_costo_material:
                sugerencias_materiales.append(
                    f"El material '{material.descripcion}' tiene un costo ({costo}) mayor que el promedio histórico ({promedio_costo_material}). Considere alternativas más económicas.")

        # Sugerencias de optimización de servicios
        sugerencias_servicios = []
        for servicio_id, costo in costos_servicios.items():
            servicio = Servicio.objects.get(id=servicio_id)
            promedio_costo_servicio = ChatController.calcular_promedio_historial(servicio_id)
            if costo > promedio_costo_servicio:
                sugerencias_servicios.append(
                    f"El servicio '{servicio.descripcion}' tiene un costo ({costo}) mayor que el promedio histórico ({promedio_costo_servicio}). Considere proveedores alternativos o ajustes en el contrato.")

        # Generar respuesta con sugerencias separadas
        data_return = {
            "obra_id": obra_id,
            "nombre_obra": obra.direccion,
            "total_presupuesto": total_presupuesto,
            "sugerencias": {
                "materiales": sugerencias_materiales,
                "servicios": sugerencias_servicios
            }
        }
        return data_return

    @staticmethod
    def gestion_proveedores(obra_id):
        # Obtener la obra actual
        obra = Obra.objects.get(id=obra_id)

        # Obtener el cliente de la obra
        cliente = obra.id_cliente

        # Obtener los materiales comprados en la obra actual
        materiales_comprados = LineaCompra.objects.filter(id_compra__id_obra=obra_id).values_list(
            "id_material", flat=True
        )

        # Buscar proveedores que ofrecen los materiales comprados
        proveedores_aptos = Proveedor.objects.filter(material__id__in=materiales_comprados)

        # Buscar subcontratistas que hayan trabajado con este cliente o en proyectos similares
        subcontratistas_aptos = Subcontratacion.objects.filter(id_obra__id_cliente=cliente)

        # Analizar el desempeño de proveedores
        proveedores_recomendados = []
        for proveedor in proveedores_aptos:
            historial = proveedor.id_compra.filter(id_compra__id_obra__id_cliente=cliente)
            if historial.exists():
                proveedores_recomendados.append({
                    "proveedor": proveedor.denominacion,
                    "calificacion": proveedor.calificacion,
                    "materiales": [material.descripcion for material in proveedor.material.all()],
                    "comentarios": [comentario.texto for comentario in proveedor.comentario_set.all()],
                })

        # Analizar el desempeño de subcontratistas
        subcontratistas_recomendados = []
        for sub in subcontratistas_aptos:
            subcontratistas_recomendados.append({
                "subcontratista": sub.id_subcontratista.denominacion,
                "calificacion": sub.id_subcontratista.calificacion,
                "servicios": [servicio.descripcion for servicio in sub.id_servicio.all()],
                "comentarios": [comentario.texto for comentario in sub.id_subcontratista.comentario_set.all()],
            })

        # Generar respuesta con proveedores y subcontratistas recomendados
        data_return = {
            "obra_id": obra_id,
            "nombre_obra": obra.direccion,
            "proveedores_recomendados": proveedores_recomendados,
            "subcontratistas_recomendados": subcontratistas_recomendados,
        }
        return data_return

    @staticmethod
    def analiza_costos(obra_id):
        # Obtener la obra actual
        obra = Obra.objects.get(id=obra_id)

        # Obtener las compras asociadas a la obra
        compras = LineaCompra.objects.filter(id_compra__id_obra=obra_id)

        # Obtener las subcontrataciones asociadas
        subcontrataciones = Subcontratacion.objects.filter(id_obra=obra_id)

        # Comparar con el historial de obras previas
        obras_previas = Obra.objects.exclude(id=obra_id)  # Excluir la obra actual

        # Cálculos para encontrar el costo promedio de materiales y subcontratistas
        costo_material_promedio = compras.aggregate(Sum('precio_total'))['precio_total__sum'] / len(compras) if compras else 0
        costo_subcontratacion_promedio = subcontrataciones.aggregate(Sum('monto_contratacion'))['monto_contratacion__sum'] / len(
            subcontrataciones) if subcontrataciones else 0

        # Análisis comparativo con el historial de obras
        comparativa_materiales = []
        for obra_prev in obras_previas:
            compras_previas = Compra.objects.filter(id_obra=obra_prev.id)
            costo_material_prev = compras_previas.aggregate(Sum('precio_total'))['precio_total__sum'] / len(
                compras_previas) if compras_previas else 0
            comparativa_materiales.append({
                'obra': obra_prev.nombre,
                'costo_material': costo_material_prev,
                'diferencia': costo_material_promedio - costo_material_prev
            })

        comparativa_subcontratacion = []
        for obra_prev in obras_previas:
            subcontrataciones_previas = Subcontratacion.objects.filter(id_obra=obra_prev.id)
            costo_subcontratacion_prev = subcontrataciones_previas.aggregate(Sum('monto_contratacion'))['monto_contratacion__sum'] / len(
                subcontrataciones_previas) if subcontrataciones_previas else 0
            comparativa_subcontratacion.append({
                'obra': obra_prev.nombre,
                'costo_subcontratacion': costo_subcontratacion_prev,
                'diferencia': costo_subcontratacion_promedio - costo_subcontratacion_prev
            })

        # Generar recomendaciones basadas en los resultados comparativos
        recomendaciones = {
            "materiales": f"El costo promedio de materiales en esta obra es de {costo_material_promedio}. Se recomienda revisar las obras previas para optimizar la compra de materiales.",
            "subcontrataciones": f"El costo promedio de subcontratación en esta obra es de {costo_subcontratacion_promedio}. Verificar las subcontrataciones previas puede ayudar a reducir costos."
        }

        data_return={
            "obra_id": obra_id,
            "nombre_obra": obra.direccion,
            "comparativa_materiales": comparativa_materiales,
            "comparativa_subcontratacion": comparativa_subcontratacion,
            "recomendaciones": recomendaciones,
        }
        return data_return


class ReporteObra:
    @staticmethod
    def reporte_gastos_avance(obra_id):
        # Obtener la obra y presupuesto
        obra = Obra.objects.get(id=obra_id)
        presupuesto = Presupuesto.objects.filter(id_obra=obra_id).first()
        if not presupuesto:
            return {"error": "No hay un presupuesto asociado a esta obra."}

        # Compras realizadas
        compras = LineaCompra.objects.filter(id_compra__id_obra=obra_id)
        total_compras = sum([compra.precio_total for compra in compras])

        # Comparativa compras vs presupuesto
        diferencia_compras_presupuesto = presupuesto.total - total_compras

        # Materiales utilizados en tareas
        materiales_usados_ids = Tarea_Material.objects.filter(id_tarea__id_area__id_obra=obra_id).values_list(
            'id_material', flat=True)

        # Materiales comprados no utilizados
        materiales_comprados_ids = compras.values_list('id_material', flat=True)
        materiales_no_usados_ids = set(materiales_comprados_ids) - set(materiales_usados_ids)
        materiales_no_usados = Material.objects.filter(id__in=materiales_no_usados_ids)

        # Porcentaje de avance general
        tareas = Tarea.objects.filter(id_area__id_obra=obra_id)
        avance_total = sum([tarea.porcentaje_avance for tarea in tareas])
        avance_general = avance_total / len(tareas) if tareas else 0

        # Porcentaje de avance por área
        areas = Area.objects.filter(id_obra=obra_id)
        avance_por_area = []
        for area in areas:
            tareas_area = Tarea.objects.filter(id_area=area.id)
            avance_area = sum([t.porcentaje_avance for t in tareas_area]) / len(tareas_area) if tareas_area else 0
            avance_por_area.append({
                "area_id": area.id,
                "nombre_area": area.descripcion,
                "avance": avance_area
            })

        # Generar reporte
        data_return = {
            "obra_id": obra.id,
            "nombre_obra": obra.direccion,
            "presupuesto_total": presupuesto.total,
            "total_compras": total_compras,
            "diferencia_compras_presupuesto": diferencia_compras_presupuesto,
            "materiales_no_usados": [{"id": mat.id, "descripcion": mat.descripcion} for mat in materiales_no_usados],
            "avance_general": avance_general,
            "avance_por_area": avance_por_area
        }

        return data_return
