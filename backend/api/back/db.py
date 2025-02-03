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
        return Usuario.objects.filter(usuario=user).exists()

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

    @staticmethod
    def get_vehiculos(id_empresa):
        try:
            vehiculos = Vehiculo.objects.filter(id_material__id_proveedor__id_empresa=id_empresa)
            vehiculos_return = [
                {
                    'id':v.id,
                    'descripcion': v.id_material.nombre,
                    'tipo':v.tipo,
                    'marca':v.id_material.marca,
                    'modelo': v.modelo,
                    'precio_x_hora': v.precio_x_hora,
                    'id_material': v.id_material.id,
                } for v in vehiculos
            ]
            return vehiculos_return
        except Exception as e:
            print(f"Error al cargar las emrpesas: {e}")
            raise

    @staticmethod
    def get_almacenes(id_empresa):
        try:
            almacenes = Almacen.objects.filter(id_empresa=id_empresa)
            almacenes_return = [
                {
                    'id': a.id,
                    'descripcion': a.descripcion,
                    'direccion': a.direccion,
                    'contacto': a.contacto,
                    'ciudad': a.ciudad,
                    'provincia': a.provincia,
                } for a in almacenes
            ]
            return almacenes_return
        except Exception as e:
            print(f"Error al cargar las emrpesas: {e}")
            raise

    @staticmethod
    def get_herramientas(id_empresa):
        try:
            herramientas = Herramienta.objects.filter(id_material__id_proveedor__id_empresa=id_empresa)
            herramientas_return = [
                {
                    'id': h.id,
                    'descripcion': h.id_material.descripcion,
                    'marca': h.id_material.marca,
                    'id_almacen': h.id_almacen.id if h.id_almacen else None,
                    'almacen': h.id_almacen.descripcion if h.id_almacen else None,
                    'ubicacion': h.ubicacion,
                    'id_compra': h.id_compra.id if h.id_compra else None,
                    'id_material': h.id_material.id,
                } for h in herramientas
            ]
            print(herramientas_return)
            return herramientas_return
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
        try:
            return Proveedor.objects.get(id=prov_id)
        except Exception as e:
            print(f"Error al cargar proveedor: {e}")
            raise

    @staticmethod
    def get_material_by_prov(prov: Proveedor):
        try:
            return Material.objects.filter(id_proveedor=prov)
        except Exception as e:
            print(f"Error al cargar materiales: {e}")
            raise

    @staticmethod
    def get_servicio_by_prov(prov: Proveedor):
        try:
            return Servicio.objects.filter(id_proveedor=prov)
        except Exception as e:
            print(f"Error al cargar servicios: {e}")
            raise

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
                tipo_material=material_data.get('tipo_material'),
                unidad_medida=material_data.get('unidad_medida'),
                nombre = material_data.get('nombre', material_data.get('tipo_material')),
                descripcion=material_data.get('descripcion'),
                marca=material_data.get('marca'),
                precio=material_data.get('precio'),
                moneda=material_data.get('moneda'),
                fecha_desde_precio=material_data.get('fecha_desde_precio'),
                id_proveedor=proveedor,
                impuestos_total = material_data.get('impuestos_total'),
                moneda_impuestos = material_data.get('moneda_impuestos'),
                descripcion_impuestos = material_data.get('descripcion_impuestos'),
                otros_gastos = material_data.get('otros_gastos'),
                moneda_otros_gastos = material_data.get('moneda_otros_gastos'),
                descripcion_otros_gastos = material_data.get('descripcion_otros_gastos')
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
        almacen = None

        # Actualizar los campos comunes del material
        material.nombre = data.get('nombre', data.get('tipo_material', material.nombre))
        material.descripcion = data.get('descripcion', material.descripcion)
        material.marca = data.get('marca', material.marca)
        material.precio = data.get('precio', material.precio)
        material.moneda = data.get('moneda', material.moneda)
        material.unidad_medida = data.get('unidad_medida', material.unidad_medida)
        material.impuestos_total = data.get('impuestos_total', material.impuestos_total)
        material.moneda_impuestos = data.get('moneda_impuestos', material.moneda_impuestos)
        material.descripcion_impuestos = data.get('descripcion_impuestos', material.descripcion_impuestos)
        material.otros_gastos = data.get('otros_gastos', material.otros_gastos)
        material.moneda_otros_gastos = data.get('moneda_otros_gastos', material.moneda_otros_gastos)
        material.descripcion_otros_gastos = data.get('descripcion_otros_gastos', material.descripcion_otros_gastos)
        material.fecha_desde_precio = data.get('fecha_desde_precio', material.fecha_desde_precio)
        material.tipo_material = data.get('tipo_material', material.tipo_material)
        material.save()

        # Actualizar detalles adicionales para herramienta o vehículo
        if data.get('tipo_material') == 'herramienta':
            herramienta = Herramienta.objects.get(id_material=material)
            if herramienta.almacen:
                almacen = Almacen.objects.get(id=herramienta.almacen)
            herramienta.almacen = data.get('almacen', almacen)
            herramienta.ubicacion = data.get('ubicacion', herramienta.ubicacion)
            herramienta.save()
        elif data.get('tipo_material') == 'vehiculo':
            vehiculo = Vehiculo.objects.get(id_material=material)
            vehiculo.patente = data.get('patente', vehiculo.patente)
            vehiculo.tipo = data.get('tipo', vehiculo.tipo)
            vehiculo.modelo = data.get('modelo', vehiculo.modelo)
            if vehiculo.almacen:
                almacen = Almacen.objects.get(id=vehiculo.almacen)
            vehiculo.almacen = data.get('almacen', almacen)
            vehiculo.precio_x_hora = data.get('precio_x_hora', vehiculo.precio_x_hora)
            vehiculo.save()

        return material

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
                monto_x_frecuencia=servicio_data.get('monto_x_frecuencia') if servicio_data.get('monto_x_frecuencia') else 0,
                frecuencia_pago=servicio_data.get('frecuencia_pago'),
                id_proveedor=proveedor,
                moneda=servicio_data.get('moneda'),
                impuestos_total = servicio_data.get('impuestos_total') if servicio_data.get('impuestos_total') else 0,
                moneda_impuestos = servicio_data.get('moneda_impuestos'),
                descripcion_impuestos = servicio_data.get('descripcion_impuestos'),
                otros_gastos = servicio_data.get('otros_gastos') if servicio_data.get('otros_gastos') else 0,
                moneda_otros_gastos = servicio_data.get('moneda_otros_gastos'),
                descripcion_otros_gastos = servicio_data.get('descripcion_otros_gastos')

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
        servicio.moneda = data.get('moneda')
        servicio.impuestos_total = data.get('impuestos_total')
        servicio.moneda_impuestos = data.get('moneda_impuestos')
        servicio.descripcion_impuestos = data.get('descripcion_impuestos')
        servicio.otros_gastos = data.get('otros_gastos')
        servicio.moneda_otros_gastos = data.get('moneda_otros_gastos')
        servicio.descripcion_otros_gastos = data.get('descripcion_otros_gastos')

        # Guardar los cambios en la base de datos
        try:
            servicio.save()
        except Exception as e:
            print(f"Error al buscar servicio: {e}")
            raise
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


class ObraData:
    @staticmethod
    def guardar(obra: Obra):
        try:
            obra.save()
            return obra
        except Exception as e:
            print(f"Error al crear obra: {str(e)}")
            raise

    @staticmethod
    def get_by_id(id_obra):
        try:
            return Obra.objects.get(id=id_obra)
        except Exception as e:
            print(f"Error al obtener obra: {str(e)}")
            raise

    @staticmethod
    def obtener_notas(id_obra):
        try:
            return Nota.objects.filter(id_obra=id_obra)
        except Exception as e:
            print(f"Error al obtener notas: {str(e)}")
            raise

    @staticmethod
    def delete_nota(nota_id):
        try:
            nota = Nota.objects.get(id=nota_id)
            nota.delete()
        except Exception as e:
            print(f"Error al eliminar nota: {str(e)}")
            raise


class AreaData:
    @staticmethod
    def guardar(area: Area):
        try:
            area.save()
            return area
        except Exception as e:
            print(f"Error al guardar área: {str(e)}")
            raise

    @staticmethod
    def get_by_obra(obra_id):
        try:
            return Area.objects.filter(id_obra=obra_id)
        except Exception as e:
            print(f"Error al guardar área: {str(e)}")
            raise

    @staticmethod
    def get_by_id(area_id):
        try:
            return Area.objects.get(id=area_id)
        except Exception as e:
            print(f"Error al obtener área: {str(e)}")
            raise

    @staticmethod
    def delete(area: Area):
        area.delete()


class PresupuestoData:
    @staticmethod
    def get_by_obra(id_obra):
        try:
            print('entre')
            return Presupuesto.objects.filter(id_obra=id_obra)
        except Exception as e:
            print(f"Error al obtener presupuestos: {str(e)}")
            raise

    @staticmethod
    def get_presupuesto_detalles(id_presupuesto):
        try:
            # Obtener el presupuesto
            presupuesto = Presupuesto.objects.get(id=id_presupuesto)

            # Obtener los materiales asociados al presupuesto
            materiales = Presupuesto_Material.objects.filter(id_presupuesto=id_presupuesto).values(
                'id', 'cantidad', 'precio_x_unidad_medida', 'unidad_medida',
                'monto_linea', 'desc_material', 'id_area'
            )

            # Obtener los servicios asociados al presupuesto
            servicios = Presupuesto_Servicio.objects.filter(id_presupuesto=id_presupuesto).values(
                'id', 'precio_x_hora', 'horas', 'moneda',
                'monto_linea', 'desc_servicio', 'id_area'
            )

            # Obtener los trabajadores asociados al presupuesto
            trabajadores = Presupuesto_Trabajador.objects.filter(id_presupuesto=id_presupuesto).values(
                'id', 'puesto', 'horas', 'precio_x_hora', 'moneda',
                'monto_linea', 'id_area'
            )

            tareas = Tarea.objects.filter(id_presupuesto_servicio__id_presupuesto=id_presupuesto).values(
                'id', 'titulo', 'porcentaje_avance', 'fecha_inicio', 'fecha_fin', 'precio_total', 'descripcion'
            )

            # Estructurar los datos en un diccionario para facilitar la conversión a JSON
            presupuesto_data = {
                "id": presupuesto.id,
                "id_obra": presupuesto.id_obra.id,
                "id_empresa": presupuesto.id_obra.id_empresa.id,
                "id_cliente": presupuesto.id_obra.id_cliente.id,
                "total": presupuesto.total,
                "moneda": presupuesto.moneda,
                "fecha_creacion": presupuesto.fecha_creacion,
                "observaciones": presupuesto.observaciones,
                "estado": presupuesto.estado,
                "aprobado": presupuesto.aprobado,
                "porc_inflacion": presupuesto.porc_inflacion,
                "materiales": list(materiales),
                "servicios": list(servicios),
                "trabajadores": list(trabajadores),
                "tareas": list(tareas)
            }
            return presupuesto_data

        except Presupuesto.DoesNotExist:
            raise ValueError("El presupuesto solicitado no existe.")
        except Exception as e:
            print(f"Error al obtener los detalles del presupuesto: {str(e)}")
            raise

    @staticmethod
    def update(id_presupuesto, data):
        presupuesto = Presupuesto.objects.get(id=id_presupuesto)
        presupuesto.total = data.get('total', presupuesto.total)
        presupuesto.moneda = data.get('moneda', presupuesto.moneda)
        presupuesto.observaciones = data.get('observaciones', presupuesto.observaciones)
        presupuesto.porc_inflacion = data.get('porc_inflacion', presupuesto.porc_inflacion)
        presupuesto.save()
        return presupuesto

    @staticmethod
    def update_materiales(id_presupuesto, materiales_data):
        try:
            # Eliminar materiales que ya no están en el presupuesto
            existing_material_ids = [m['id'] for m in materiales_data if 'id' in m]
            Presupuesto_Material.objects.filter(id_presupuesto=id_presupuesto).exclude(
                id__in=existing_material_ids).delete()

            # Actualizar o crear materiales
            for material in materiales_data:
                if 'id' in material:
                    # Actualizar material existente
                    material_instance = Presupuesto_Material.objects.get(id=material['id'], id_presupuesto=id_presupuesto)
                    material_instance.cantidad = material.get('cantidad', material_instance.cantidad)
                    material_instance.precio_x_unidad_medida = material.get('precio_x_unidad_medida',
                                                                            material_instance.precio_x_unidad_medida)
                    material_instance.unidad_medida = material.get('unidad_medida', material_instance.unidad_medida)
                    material_instance.monto_linea = material.get('monto_linea', material_instance.monto_linea)
                    material_instance.desc_material = material.get('desc_material', material_instance.desc_material)
                    material_instance.save()
                else:
                    monto_linea = material['precio_x_unidad_medida'] * material['cantidad']
                    Presupuesto_Material.objects.create(
                        id_presupuesto_id=id_presupuesto,
                        cantidad=material['cantidad'],
                        precio_x_unidad_medida=material['precio_x_unidad_medida'],
                        unidad_medida=material['unidad_medida'],
                        monto_linea=monto_linea,
                        desc_material=material['desc_material']
                    )
        except Exception as e:
            print(f"Error al actualizar los detalles del presupuesto_material: {str(e)}")
            raise

    @staticmethod
    def update_servicios(id_presupuesto, servicios_data):
        existing_service_ids = [s['id'] for s in servicios_data if 'id' in s]
        Presupuesto_Servicio.objects.filter(id_presupuesto=id_presupuesto).exclude(id__in=existing_service_ids).delete()

        for servicio in servicios_data:
            if 'id' in servicio:
                servicio_instance = Presupuesto_Servicio.objects.get(id=servicio['id'], id_presupuesto=id_presupuesto)
                servicio_instance.precio_x_hora = servicio.get('precio_x_hora', servicio_instance.precio_x_hora)
                servicio_instance.horas = servicio.get('horas', servicio_instance.horas)
                servicio_instance.moneda = servicio.get('moneda', servicio_instance.moneda)
                servicio_instance.monto_linea = servicio.get('monto_linea', servicio_instance.monto_linea)
                servicio_instance.desc_servicio = servicio.get('desc_servicio', servicio_instance.desc_servicio)
                servicio_instance.save()
            else:
                monto_linea = servicio['precio_x_hora'] * servicio['horas']
                Presupuesto_Servicio.objects.create(
                    id_presupuesto_id=id_presupuesto,
                    precio_x_hora=servicio['precio_x_hora'],
                    horas=servicio['horas'],
                    moneda=servicio['moneda'],
                    monto_linea=monto_linea,
                    desc_servicio=servicio['desc_servicio']
                )

    @staticmethod
    def update_trabajadores(id_presupuesto, trabajadores_data):
        existing_worker_ids = [t['id'] for t in trabajadores_data if 'id' in t]
        Presupuesto_Trabajador.objects.filter(id_presupuesto=id_presupuesto).exclude(
            id__in=existing_worker_ids).delete()

        for trabajador in trabajadores_data:
            if 'id' in trabajador:
                trabajador_instance = Presupuesto_Trabajador.objects.get(id=trabajador['id'],
                                                                         id_presupuesto=id_presupuesto)
                trabajador_instance.puesto = trabajador.get('puesto', trabajador_instance.puesto)
                trabajador_instance.horas = trabajador.get('horas', trabajador_instance.horas)
                trabajador_instance.precio_x_hora = trabajador.get('precio_x_hora', trabajador_instance.precio_x_hora)
                trabajador_instance.moneda = trabajador.get('moneda', trabajador_instance.moneda)
                trabajador_instance.monto_linea = trabajador.get('monto_linea', trabajador_instance.monto_linea)
                trabajador_instance.save()
            else:
                monto_linea = trabajador['horas'] * trabajador['precio_x_hora']
                Presupuesto_Trabajador.objects.create(
                    id_presupuesto_id=id_presupuesto,
                    puesto=trabajador['puesto'],
                    horas=trabajador['horas'],
                    precio_x_hora=trabajador['precio_x_hora'],
                    moneda=trabajador['moneda'],
                    monto_linea=monto_linea
                )


class CompraData:
    @staticmethod
    def obtener_compra_y_lineas(compra_id):
        try:
            compra = Compra.objects.get(id=compra_id)
            lineas = LineaCompra.objects.filter(id_compra=compra)
            return compra, list(lineas)
        except Compra.DoesNotExist:
            return None, []

    @staticmethod
    def actualizar_estado_compra(compra_id, nuevo_estado):
        try:
            compra = Compra.objects.get(id=compra_id)
            compra.estado = nuevo_estado
            compra.save()
            return compra
        except Compra.DoesNotExist:
            return None


class PagoData:
    @staticmethod
    def guardar_pago(monto, moneda, cuota, id_proveedor, id_compra, id_subcontratacion, fecha_pago):
        try:
            # Crear una instancia de Pago
            pago = Pago(
                monto=monto,
                moneda=moneda,
                cuota=cuota,
                fecha_pago=fecha_pago,
                id_proveedor_id=id_proveedor,
                id_compra_id=id_compra if id_compra else None,
                id_subcontratacion_id=id_subcontratacion if id_subcontratacion else None
            )
            pago.save()
            return pago.id
        except Exception as e:
            print(f"Error al guardar el pago: {e}")
            return None
