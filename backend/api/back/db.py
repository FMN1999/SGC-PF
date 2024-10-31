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

        # Actualizar los campos del material con los datos proporcionados
        material.descripcion = data.get('descripcion', material.descripcion)
        material.marca = data.get('marca', material.marca)
        material.precio = data.get('precio', material.precio)
        material.moneda = data.get('moneda', material.moneda)
        material.unidad_medida = data.get('unidad_medida', material.unidad_medida)
        material.impuestos_total = data.get('impuestos_total', material.impuestos_total)  # Quitando la coma
        material.moneda_impuestos = data.get('moneda_impuestos', material.moneda_impuestos)  # Quitando la coma
        material.descripcion_impuestos = data.get('descripcion_impuestos',
                                                  material.descripcion_impuestos)  # Quitando la coma
        material.otros_gastos = data.get('otros_gastos', material.otros_gastos)  # Quitando la coma
        material.moneda_otros_gastos = data.get('moneda_otros_gastos', material.moneda_otros_gastos)  # Quitando la coma
        material.descripcion_otros_gastos = data.get('descripcion_otros_gastos',
                                                     material.descripcion_otros_gastos)  # Quitando la coma

        # Guardar los cambios en la base de datos
        try:
            material.save()
        except Exception as e:
            print(f"Error al buscar material: {e}")
            raise
        # Retornar el material actualizado (puedes convertirlo a dict si es necesario)
        return {
            'id': material.id,
            'descripcion': material.descripcion,
            'marca': material.marca,
            'precio': material.precio,
            'moneda': material.moneda,
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
                id_proveedor=proveedor,
                moneda=servicio_data.get('moneda'),
                impuestos_total = servicio_data.get('impuestos_total'),
                moneda_impuestos = servicio_data.get('moneda_impuestos'),
                descripcion_impuestos = servicio_data.get('descripcion_impuestos'),
                otros_gastos = servicio_data.get('otros_gastos'),
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

            # Estructurar los datos en un diccionario para facilitar la conversión a JSON
            presupuesto_data = {
                "id": presupuesto.id,
                "total": presupuesto.total,
                "moneda": presupuesto.moneda,
                "fecha_creacion": presupuesto.fecha_creacion,
                "observaciones": presupuesto.observaciones,
                "estado": presupuesto.estado,
                "aprobado": presupuesto.aprobado,
                "porc_inflacion": presupuesto.porc_inflacion,
                "materiales": list(materiales),
                "servicios": list(servicios),
                "trabajadores": list(trabajadores)
            }
            return presupuesto_data

        except Presupuesto.DoesNotExist:
            raise ValueError("El presupuesto solicitado no existe.")
        except Exception as e:
            print(f"Error al obtener los detalles del presupuesto: {str(e)}")
            raise