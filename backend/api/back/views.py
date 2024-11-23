from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import json
from .controller import *
from django.core.exceptions import ValidationError
from django.utils.dateparse import parse_date
from django.shortcuts import get_object_or_404


@method_decorator(csrf_exempt, name='dispatch')
class LoginView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            usuario = data.get('usuario')
            contrasenia = data.get('contrasenia')

            usuario_obj = UsuarioController.login(usuario, contrasenia)
            colaborador = ColaboradorController.get_by_user(usuario_obj)
            cliente = ClienteController.get_by_user(usuario_obj)
            if usuario_obj:
                response_data = {
                    'user_id': usuario_obj.id,  # Devolver el ID del usuario
                    'rol': colaborador.rol if colaborador else None,
                    'id_emp': colaborador.id_empresa.id if colaborador else cliente.id_empresa.id
                }
                return JsonResponse(response_data)
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


class EmpresasView(View):
    def get(self, request, *args, **kwargs):
        try:
            # Obtener todas las empresas desde la base de datos
            empresas = EmpresaController.get_all()
            # Convertir las empresas a una lista
            empresas_list = list(empresas)
            # Devolver la lista de empresas como JSON
            return JsonResponse(empresas_list, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class RegistroClienteView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)

            # Datos del usuario
            datos_usuario = {
                'fecha_nacimiento': data.get('fecha_nacimiento'),
                'nombre': data.get('nombre'),
                'apellido': data.get('apellido'),
                'email': data.get('email'),
                'usuario': data.get('nombre_usuario'),
                'contrasenia': data.get('password'),
                'sexo': data.get('sexo'),
                'celular': data.get('celular'),
                'telefono': data.get('telefono'),
                'direccion': data.get('direccion')
            }

            # Datos del cliente
            datos_cliente = {
                'ciudad': data.get('ciudad'),
                'provincia': data.get('provincia'),
                'cuit': data.get('cuit'),
                'monto_deuda': data.get('monto_deuda'),
                'moneda_deuda': data.get('moneda_deuda'),
                'fecha_alta': data.get('fecha_alta'),
                'fecha_baja': data.get('fecha_baja')
            }

            empresa_id = data.get('id_empresa')
            print(datos_cliente)

            # Llamar a la lógica de negocio para registrar al cliente
            cliente = ClienteController.registrar_cliente(datos_usuario, datos_cliente, empresa_id)

            return JsonResponse({'message': 'Cliente registrado exitosamente', 'cliente_id': cliente.id}, status=201)

        except ValidationError as e:
            return JsonResponse({'error': str(e)}, status=400)

        except Exception as e:
            return JsonResponse({'error': 'Error inesperado: ' + str(e)}, status=500)

    def patch(self, request, id):
        try:
            cliente = ClienteController.get_by_id(id)
            data = json.loads(request.body)
            fecha_baja = parse_date(data.get('fecha_baja'))
            cliente.fecha_baja = fecha_baja
            ClienteController.guardar_cambios(cliente)
            return JsonResponse({'status': 'Cliente dado de baja'})
        except Cliente.DoesNotExist:
            return JsonResponse({'error': 'Cliente no encontrado'}, status=404)


@method_decorator(csrf_exempt, name='dispatch')
class PerfilView(View):
    def get(self, request, userId):
        try:
            usuario = UsuarioController.get_by_id(userId)
            # Verificar si es colaborador
            colaborador = ColaboradorController.get_by_user(usuario)
            # Verificar si es cliente
            cliente = ClienteController.get_by_user(usuario)

            # Datos generales del usuario
            datos_usuario = {
                'id': usuario.id,
                'nombre': usuario.nombre,
                'apellido': usuario.apellido,
                'email': usuario.email,
                'sexo': usuario.sexo,
                'celular': usuario.celular,
                'telefono': usuario.telefono,
                'direccion': usuario.direccion,
                'fecha_alta': colaborador.fecha_alta if colaborador else cliente.fecha_alta,
                'puesto': colaborador.puesto if colaborador else None,
                'rol': colaborador.rol if colaborador else None,
                'id_empresa': colaborador.id_empresa.id if colaborador else cliente.id_empresa.id,
                'empresa_col': colaborador.id_empresa.denominacion if colaborador else cliente.id_empresa.denominacion,
                'ciudad': cliente.ciudad if cliente else None,
                'provincia': cliente.provincia if cliente else None,
                'cuit': cliente.cuit if cliente else None,
                'monto_deuda': cliente.monto_deuda if cliente else None,
                'moneda_deuda': cliente.moneda_deuda if cliente else None,
            }

            return JsonResponse(datos_usuario, safe=False)
        except Usuario.DoesNotExist:
            return JsonResponse({'error': 'Usuario no encontrado'}, status=404)

    def put(self, request, userId):
        data = json.loads(request.body)
        usuario = UsuarioController.actualizar_datos_perfil(userId, data)
        if usuario:
            return JsonResponse({'message': 'Perfil actualizado correctamente'})
        return JsonResponse({'error': 'No se pudo actualizar el perfil'}, status=400)


@method_decorator(csrf_exempt, name='dispatch')
class ColaboradorView(View):
    def post(self, request):
        try:
            # Parsear los datos del request
            data = json.loads(request.body)
            print(data)
            usuario_data = data.get('usuario')
            colaborador_data = data.get('colaborador')
            print('Ingreso a crear')

            # Llamar al controlador para crear usuario y colaborador
            resultado = ColaboradorController.crear_colaborador(usuario_data, colaborador_data)
            print('hecho')
            return JsonResponse({'message': 'Colaborador Creado'}, status=201)

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    def patch(self, request, id):
        try:
            colaborador = ColaboradorController.get_by_id(id)
            data = json.loads(request.body)
            fecha_baja = parse_date(data.get('fecha_baja'))
            colaborador.fecha_baja = fecha_baja
            ColaboradorController.guardar_cambios(colaborador)
            return JsonResponse({'status': 'Cliente dado de baja'})
        except Cliente.DoesNotExist:
            return JsonResponse({'error': 'Cliente no encontrado'}, status=404)


@method_decorator(csrf_exempt, name='dispatch')
class ProveedorView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            proveedor_data = data.get('proveedor')

            # Llamar al controlador para crear el proveedor
            proveedor = ProveedorController.crear_proveedor(proveedor_data)

            return JsonResponse({
                'status': 'success',
                'proveedor': {
                    'id': proveedor.id,
                    'denominacion': proveedor.denominacion,
                    'email': proveedor.email
                }
            }, status=201)

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    def get(self, request, proveedor_id):
        try:
            # Llamar al controlador para obtener el proveedor y sus datos
            datos_proveedor = ProveedorController.get_by_id(proveedor_id)

            return JsonResponse(datos_proveedor, status=200, safe=False)

        except ValidationError as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': 'Error interno del servidor'}, status=500)

    def put(self, request, id):
        data = json.loads(request.body)
        proveedor = ProveedorController.actualizar_proveedor(id, data)

        return JsonResponse({'message': 'Proveedor actualizado correctamente'}, status=200)


@method_decorator(csrf_exempt, name='dispatch')
class OfertaView(View):
    def get(self, request, proveedor_id):
        try:
            # Llamar al controlador para obtener los detalles del proveedor
            proveedor_detalle = ProveedorController.get_by_id(proveedor_id)
            return JsonResponse(proveedor_detalle, status=200)
        except ValidationError as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    def post(self, request):
        try:
            data = json.loads(request.body)
            proveedor_id = data.get('id_proveedor')

            # Crear oferta y asociar materiales y servicios
            oferta = OfertaController.crear_oferta_con_materiales_y_servicios(data, proveedor_id)

            return JsonResponse({'message': 'Oferta creada con éxito', 'oferta_id': oferta.id}, status=201)
        except ValidationError as ve:
            return JsonResponse({'error': str(ve)}, status=400)
        except Exception as e:
            return JsonResponse({'error': f"Error al crear la oferta: {str(e)}"}, status=500)

    def delete(self, request, oferta_id):
        try:
            OfertaController.eliminar_oferta(oferta_id)
            return JsonResponse({'message': 'Oferta eliminada con éxito'}, status=200)
        except Exception as e:
            return JsonResponse({'error': f"Error al eliminar la oferta: {str(e)}"}, status=500)


class OfertaDetalleView(View):
    def get(self, request, oferta_id):
        try:
            # Llama al método del controlador que obtiene la oferta con los materiales y servicios
            oferta_con_datos = OfertaController.obtener_oferta_con_datos(oferta_id)

            # Serializa la oferta en el view
            oferta = oferta_con_datos['oferta']
            oferta_serializada = {
                'id': oferta.id,
                'descripcion': oferta.descripcion,
                'monto_total': oferta.monto_total,
                'moneda': oferta.moneda,
                'fecha_desde': oferta.fecha_desde,
                'fecha_hasta': oferta.fecha_hasta,
                'id_proveedor': oferta.id_proveedor_id,
            }

            # Serializa los materiales
            materiales = oferta_con_datos['materiales']
            materiales_serializados = [
                {
                    'id': material.id,
                    'descripcion': material.id_material.descripcion,
                    'marca': material.id_material.marca,
                    'cantidad_of': material.cantidad_of,
                    'unidad_of': material.unidad_of,
                    'monto': material.monto,
                    'moneda': material.moneda,
                    'porc_desc': material.porc_desc,
                } for material in materiales
            ]

            # Serializa los servicios
            servicios = oferta_con_datos['servicios']
            servicios_serializados = [
                {
                    'id': servicio.id,
                    'descripcion': servicio.id_servicio.descripcion,
                    'cantidad_of': servicio.cantidad_of,
                    'unidad_tiempo': servicio.unidad_tiempo,
                    'monto': servicio.monto,
                    'moneda': servicio.moneda,
                    'porc_desc': servicio.porc_desc,
                } for servicio in servicios
            ]

            # Devuelve la respuesta con los datos serializados
            return JsonResponse({
                'oferta': oferta_serializada,
                'materiales': materiales_serializados,
                'servicios': servicios_serializados,
            }, status=200)

        except ValidationError as ve:
            return JsonResponse({'error': str(ve)}, status=400)
        except Exception as e:
            return JsonResponse({'error': f"Error al obtener la oferta: {str(e)}"}, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class MaterialView(View):

    def post(self, request):
        data = json.loads(request.body)

        # Crear el material
        proveedor = get_object_or_404(Proveedor, id=data.get('id_proveedor'))
        material = Material.objects.create(
            id_proveedor=proveedor,
            tipo_material=data.get('tipo_material'),
            unidad_medida=data.get('unidad_medida'),
            descripcion=data.get('descripcion'),
            marca=data.get('marca'),
            precio=data.get('precio'),
            moneda=data.get('moneda'),
            impuestos_total=data.get('impuestos_total'),
            moneda_impuestos=data.get('moneda_impuestos'),
            descripcion_impuestos=data.get('descripcion_impuestos'),
            otros_gastos=data.get('otros_gastos'),
            moneda_otros_gastos=data.get('moneda_otros_gastos'),
            descripcion_otros_gastos=data.get('descripcion_otros_gastos'),
            fecha_desde_precio=data.get('fecha_desde_precio')
        )

        # Asociación opcional con Vehículo o Herramienta
        if data.get('tipo_asociacion') == 'vehiculo':
            Vehiculo.objects.create(
                id_material=material,
                patente=data.get('patente'),
                tipo=data.get('tipo'),
                marca=data.get('marca_vehiculo'),
                modelo=data.get('modelo'),
                precio_x_hora=data.get('precio_x_hora'),
                id_almacen_id=data.get('id_almacen')
            )
        elif data.get('tipo_asociacion') == 'herramienta':
            Herramienta.objects.create(
                id_material=material,
                id_almacen_id=data.get('id_almacen'),
                ubicacion=data.get('ubicacion'),
                marca=data.get('marca_herramienta')
            )

        return JsonResponse({'message': 'Material creado con éxito', 'material_id': material.id})

    def get(self, request, material_id):
        try:
            material = MaterialController.get_by_id(material_id)
            material_data = {
                'id': material.id,
                'descripcion': material.descripcion,
                'marca': material.marca,
                'precio': material.precio,
                'moneda': material.moneda,
                'unidad_medida': material.unidad_medida
            }
            return JsonResponse(material_data, status=200)
        except Material.DoesNotExist:
            return JsonResponse({'error': 'Material no encontrado'}, status=404)

    def delete(self, request, material_id):
        try:
            MaterialController.eliminar_material(material_id)
            return JsonResponse({'message': 'Material eliminado con éxito'}, status=200)
        except Exception as e:
            return JsonResponse({'error': f"Error al eliminar el material: {str(e)}"}, status=500)
        
    def put(self,request, material_id):
        try:
            # Obtener los datos enviados en el request
            data = json.loads(request.body)
            print(data)

            # Llamar al método estático de MaterialData para actualizar el material
            updated_material = MaterialController.actualizar_material(material_id, data)

            # Retornar una respuesta con los datos actualizados
            return JsonResponse({
                'message': 'Material actualizado con éxito',
                'material': updated_material
            }, status=200)

        except ValidationError as e:
            return JsonResponse({'error': str(e)}, status=400)

        except Exception as e:
            return JsonResponse({'error': 'Error al actualizar el material'}, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class ServicioView(View):

    def post(self, request):
        try:
            # Parsear el cuerpo de la petición a JSON
            data = json.loads(request.body)

            proveedor_id = data.get('id_proveedor')
            print(f"Proveedor ID: {proveedor_id}")  # Debería imprimir el id del proveedor

            # Validar y crear servicio
            servicio = ServicioController.crear_servicio(data, proveedor_id)

            return JsonResponse({'message': 'Servicio creado con éxito', 'servicio': servicio.id}, status=201)
        except ValidationError as ve:
            return JsonResponse({'error': str(ve)}, status=400)
        except Exception as e:
            return JsonResponse({'error': f"Error al crear servicio: {str(e)}"}, status=500)

    def get(self, request, servicio_id):
        try:
            servicio = ServicioController.get_by_id(servicio_id)
            servicio_data = {
                'id': servicio.id,
                'descripcion': servicio.descripcion,
                'precio_x_unidad': servicio.precio_x_unidad,
                'unidad_medida': servicio.unidad_medida,
                'monto_x_frecuencia': servicio.monto_x_frecuencia,
                'frecuencia_pago': servicio.frecuencia_pago
            }
            return JsonResponse(servicio_data, status=200)
        except Servicio.DoesNotExist:
            return JsonResponse({'error': 'Servicio no encontrado'}, status=404)

    def delete(self, request, servicio_id):
        try:
            ServicioController.eliminar_servicio(servicio_id)
            return JsonResponse({'message': 'Servicio eliminado con éxito'}, status=200)
        except Exception as e:
            return JsonResponse({'error': f"Error al eliminar el servicio: {str(e)}"}, status=500)

    def put(self, request, servicio_id):
        try:
            # Obtener los datos enviados en el request
            data = json.loads(request.body)

            # Llamar al método estático de ServicioData para actualizar el servicio
            updated_servicio = ServicioController.actualizar_servicio(servicio_id, data)

            # Retornar una respuesta con los datos actualizados
            return JsonResponse({
                'message': 'Servicio actualizado con éxito',
                'servicio': updated_servicio
            }, status=200)

        except Exception as e:
            return JsonResponse({'error': 'Error al actualizar el servicio'}, status=500)


class MaterialesPorProveedorView(View):
    def get(self, request, proveedor_id):
        try:
            materiales = ProveedorController.get_materiales_by_proveedor(proveedor_id)
            materiales_list = list(materiales.values())
            return JsonResponse({'materiales': materiales_list}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


class ServiciosPorProveedorView(View):
    def get(self, request, proveedor_id):
        try:
            servicios = ProveedorController.get_servicios_by_proveedor(proveedor_id)
            servicios_list = list(servicios.values())
            return JsonResponse({'servicios': servicios_list}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


class UsuariosView(View):
    def get(self, request, id_empresa):
        clientes = ClienteController.get_by_empresa(id_empresa)
        colaboradores = ColaboradorController.get_by_empresa(id_empresa)
        proveedores = ProveedorController.get_by_empresa(id_empresa)
        clientes_data = []

        for cliente in clientes:
            clientes_data.append({
                'id': cliente.id,
                'nombre': cliente.id_usuario.nombre,  # Accediendo al nombre del usuario
                'apellido': cliente.id_usuario.apellido,  # Accediendo al apellido del usuario
                'cuit': cliente.cuit,
                'ciudad': cliente.ciudad,
                'provincia': cliente.provincia,
                'id_usuario': cliente.id_usuario.id,
                'fecha_baja': cliente.fecha_baja
            })

        colaboradores_data = []
        for colaborador in colaboradores:
            colaboradores_data.append({
                'id': colaborador.id,
                'nombre': colaborador.id_usuario.nombre,  # Accediendo al nombre del usuario
                'apellido': colaborador.id_usuario.apellido,  # Accediendo al apellido del usuario
                'puesto': colaborador.puesto,
                'rol': colaborador.rol,
                'id_usuario': colaborador.id_usuario.id,
                'fecha_baja': colaborador.fecha_baja
            })

        proveedores_data = []
        for proveedor in proveedores:
            proveedores_data.append({
                'id': proveedor.id,
                'denominacion': proveedor.denominacion,
                'cuil': proveedor.cuil,
                'ciudad': proveedor.ciudad,
                'provincia': proveedor.provincia,
            })
        return JsonResponse({
            'clientes': clientes_data,
            'colaboradores': colaboradores_data,
            'proveedores': proveedores_data
        })


class MaterialesPorEmpresa(View):
    def get(self, request, id_empresa):
        materiales = MaterialController.get_by_empresa(id_empresa)
        data = []

        for material in materiales:
            data.append({
                'id': material.id,
                'descripcion': material.descripcion,
                'marca': material.marca,
                'precio': material.precio,
                'moneda': material.moneda,
                'id_proveedor': material.id_proveedor.id
            })

        return JsonResponse(data, safe=False)


class ServiciosPorEmpresa(View):
    def get(self, request, id_empresa):
        servicios = ServicioController.get_by_empresa(id_empresa)
        data = []

        for servicio in servicios:
            data.append({
                'id': servicio.id,
                'descripcion': servicio.descripcion,
                'precio': servicio.precio_x_unidad,
                'unidad_medida': servicio.unidad_medida
            })

        return JsonResponse(data, safe=False)


@method_decorator(csrf_exempt, name='dispatch')
class ObraView(View):
    def post(self,request):
        data = json.loads(request.body)
        nueva_obra = ObraController.create(data)
        return JsonResponse({'message': 'Obra creada exitosamente.'}, status=201)

    def get(self, request, id_obra):
        try:
            obra = ObraController.get_by_id(id_obra)
            return JsonResponse(obra, status=200)
        except Servicio.DoesNotExist:
            return JsonResponse({'error': 'Servicio no encontrado'}, status=404)

    def put(self, request, id_obra):
        try:
            obra = Obra.objects.get(id=id_obra)
            data = json.loads(request.body)

            obra_final = ObraController.actualizar(obra, data)

            return JsonResponse({'message': 'Obra actualizada correctamente'}, status=200)

        except Obra.DoesNotExist:
            return JsonResponse({'error': 'Obra no encontrada'}, status=404)


class ClientesView(View):
    def get(self, request, id_empresa):
        clientes = ClienteController.get_by_empresa(id_empresa)
        clientes_data = []

        for cliente in clientes:
            if cliente.fecha_baja is None:
                clientes_data.append({
                    'id': cliente.id,
                    'nombre': cliente.id_usuario.nombre,  # Accediendo al nombre del usuario
                    'apellido': cliente.id_usuario.apellido,  # Accediendo al apellido del usuario
                    'cuit': cliente.cuit,
                    'ciudad': cliente.ciudad,
                    'provincia': cliente.provincia,
                    'id_usuario': cliente.id_usuario.id,
                    'fecha_baja': cliente.fecha_baja
                })

        return JsonResponse(clientes_data, safe=False)


@method_decorator(csrf_exempt, name='dispatch')
class AreaView(View):
    def post(self, request):
        data = json.loads(request.body)
        nueva_area = AreaController.crear_area(data)
        return JsonResponse({"area_id": nueva_area.id, "message": "Área creada exitosamente"})

    def get(self, request, obra_id):
        areas = AreaController.get_by_obra(obra_id)
        return JsonResponse(list(areas), safe=False)

    def delete(self, request, area_id):
        try:
            area = AreaController.get_by_id(area_id)
            AreaController.delete(area)
            return JsonResponse({"message": "Área eliminada correctamente"}, status=200)
        except Area.DoesNotExist:
            return JsonResponse({"error": "Área no encontrada"}, status=404)
        

@method_decorator(csrf_exempt, name='dispatch')
class NotaView(View):
    def post(self,request):
        data = json.loads(request.body)
        nota = ObraController.agregar_nota(data)
        return JsonResponse({'id': nota.id, 'descripcion': nota.descripcion, 'fecha': nota.fecha}, status=201)

    def get(self, request, id_obra):
        notas = ObraController.obtener_notas(int(id_obra))
        print(notas)

        # Crear una lista con las notas y sus fotos
        notas_data = []
        for nota in notas:
            fotos = FotoAvances.objects.filter(id_avance=nota.id)
            fotos_data = [{'url': foto.url} for foto in fotos]

            notas_data.append({
                'id': nota.id,
                'descripcion': nota.descripcion,
                'fecha': nota.fecha,
                'fotos': fotos_data
            })

        return JsonResponse(notas_data, safe=False)

    def delete(self,request, nota_id):
        try:
            # Intentar obtener la nota por ID y eliminarla
            ObraController.delete_nota(nota_id)
            return JsonResponse({'message': 'Nota eliminada correctamente'}, status=200)
        except Nota.DoesNotExist:
            return JsonResponse({'error': 'Nota no encontrada'}, status=404)


@method_decorator(csrf_exempt, name='dispatch')
class FotoAvancesView(View):
    def post(self, request, nota_id):
        data = json.loads(request.body)
        foto = ObraController.agregar_foto(nota_id, data.get('url'))
        return JsonResponse({'id': foto.id, 'url': foto.url}, status=201)


@method_decorator(csrf_exempt, name='dispatch')
class DocumentoView(View):
    def post(self, request):
        data = json.loads(request.body)
        try:
            usuario = UsuarioController.get_by_id(data['id_usuario'])
            obra = ObraController.get_by_id(data.get('id_obra'))

            documento = Documento(
                descripcion=data.get('descripcion'),
                nombre=data['nombre'],
                tipo_archivo=data.get('tipo_archivo'),
                link=data['link'],
                id_usuario=usuario,
                id_obra=obra
            )
            documento.save()
            return JsonResponse({'message': 'Documento creado correctamente', 'documento_id': documento.id}, status=201)

        except Usuario.DoesNotExist:
            return JsonResponse({'error': 'Usuario no encontrado'}, status=404)
        except Area.DoesNotExist:
            return JsonResponse({'error': 'Área no encontrada'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    def get(self, request, id_obra):
        try:
            documentos = Documento.objects.filter(id_obra=id_obra)
            documentos_data = [
                {
                    "id": doc.id,
                    "nombre": doc.nombre,
                    "link": doc.link,
                    "descripcion": doc.descripcion,
                    "tipo_archivo": doc.tipo_archivo,
                    "id_usuario": doc.id_usuario.id
                } for doc in documentos
            ]
            return JsonResponse(documentos_data, safe=False)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def delete(self, request, id_documento):
        try:
            documento = Documento.objects.get(id=id_documento)
            documento.delete()
            return JsonResponse({"message": "Documento eliminado correctamente"}, status=200)
        except Documento.DoesNotExist:
            return JsonResponse({"error": "Documento no encontrado"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class PresupuestoView(View):
    def post(self, request):
        data = json.loads(request.body)
        presupuesto = PresupuestoController.crear_presupuesto(data)
        return JsonResponse({'message': 'Presupuesto creado exitosamente', 'presupuesto_id': presupuesto.id})

    def get(self, request, id_presupuesto):
        try:
            presupuesto = PresupuestoController.get_by_id(id_presupuesto)
            if presupuesto:
                return JsonResponse(presupuesto, safe=False, status=200)
            else:
                return JsonResponse({'error': 'Presupuesto no encontrado'}, status=404)
        except Exception as e:
            print(f"Error al obtener detalles del presupuesto: {e}")
            return JsonResponse({'error': 'Error al obtener detalles'}, status=500)

    def put(self, request, id_presupuesto):
        try:
            data = json.loads(request.body)
            # Llamar al controlador para actualizar el presupuesto
            resultado = PresupuestoController.update_presupuesto(id_presupuesto, data)
            return JsonResponse({"mensaje": "Presupuesto actualizado correctamente"}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)


class PresupuestosView(View):
    def get(self, request, id_obra):
        try:
            print('entre')
            print(id_obra)
            presupuestos = PresupuestoController.get_by_obra(id_obra)
            presupuestos_data = [
                {
                    "id": pres.id,
                    "observaciones": pres.observaciones,
                    "fecha_creacion": pres.fecha_creacion,
                    "total": pres.total,
                    "moneda": pres.moneda,
                    "estado": pres.estado
                } for pres in presupuestos
            ]
            # Convertir a lista y retornar como JSON
            return JsonResponse(presupuestos_data, safe=False, status=200)

        except Exception as e:
            print(f"Error al obtener presupuestos: {e}")
            return JsonResponse({'error': 'Error al obtener presupuestos'}, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class PresupuestoMaterialView(View):
    def delete(self, request, id):
        try:
            material = Presupuesto_Material.objects.get(id=id)
            material.delete()
            return JsonResponse({"status": "success"}, status=200)
        except Presupuesto_Material.DoesNotExist:
            return JsonResponse({"error": "Material not found"}, status=404)

    def get(self, request, id_presupuesto):
        materiales = PresupuestoController.get_materiales_por_presupuesto(id_presupuesto)
        return JsonResponse(materiales, safe=False)


@method_decorator(csrf_exempt, name='dispatch')
class PresupuestoServicioView(View):
    def get(self, request, id_presupuesto):
        servicios = PresupuestoController.get_servicios_por_presupuesto(id_presupuesto)
        return JsonResponse(servicios, safe=False)

    def delete(self, request, id):
        try:
            servicio = Presupuesto_Servicio.objects.get(id=id)
            servicio.delete()
            return JsonResponse({"status": "success"}, status=200)
        except Presupuesto_Servicio.DoesNotExist:
            return JsonResponse({"error": "Servicio not found"}, status=404)


@method_decorator(csrf_exempt, name='dispatch')
class PresupuestoTrabajadorView(View):
    def delete(self, request, id):
        try:
            trabajador = Presupuesto_Trabajador.objects.get(id=id)
            trabajador.delete()
            return JsonResponse({"status": "success"}, status=200)
        except Presupuesto_Trabajador.DoesNotExist:
            return JsonResponse({"error": "Trabajador not found"}, status=404)
        

@method_decorator(csrf_exempt, name='dispatch')
class CompraView(View):
    @staticmethod
    def post(request):
        data = json.loads(request.body)
        compra = CompraController.crear_solicitud_compra(data)
        return JsonResponse({"Respuesta":"Compra creada"}, status=201)

    def put(self, request, compra_id):
        compra = get_object_or_404(Compra, id=compra_id)
        data = json.loads(request.body)
        print(data)
        compra.estado = data.get('nuevo_estado')
        compra.id_aprobador = Usuario.objects.get(id=data.get('id_usuario'))
        compra.save()
        return JsonResponse({'message': 'Estado actualizado correctamente'})

    def get(self, request, compra_id):
        compra_data = CompraController.obtener_compra_con_lineas(compra_id)
        if compra_data is None:
            return JsonResponse({'error': 'Compra no encontrada'}, status=404)
        return JsonResponse(compra_data, safe=False)


@method_decorator(csrf_exempt, name='dispatch')
class SolicitudesView(View):
    def get(self, request):
        id_empresa = request.GET.get('id_empresa')

        compras_pendientes = Compra.objects.filter(estado="Pendiente", id_proveedor__id_empresa=id_empresa)
        data = list(compras_pendientes.values())  # Convertir a formato JSON-friendly
        return JsonResponse(data, safe=False)


@method_decorator(csrf_exempt, name='dispatch')
class SubcontratacionView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            id_obra = data.get('id_obra')
            id_usuario = data.get('id_usuario')
            estado = data.get('estado', 'Pendiente')

            # Crear cada línea de subcontratación
            for linea in data.get('lineas_subcontratacion', []):
                id_servicio = linea.get('id_servicio')
                id_presupuesto_servicio = linea.get('id_presupuesto_servicio')
                servicio = Servicio.objects.get(id=id_servicio)
                usuario = Usuario.objects.get(id=id_usuario)
                obra = Obra.objects.get(id=id_obra)
                presupuesto_servicio = Presupuesto_Servicio.objects.get(id=id_presupuesto_servicio) if id_presupuesto_servicio is not None else None  # Ajusta si el ID es diferente

                Subcontratacion.objects.create(
                    id_servicio=servicio,
                    fecha_contrato=linea.get('fecha_contrato'),
                    nro_contrato=linea.get('nro_contrato'),
                    fecha_contrato_hasta=linea.get('fecha_contrato_hasta'),
                    monto_contratacion=linea.get('monto_contratacion'),
                    moneda_contratacion=linea.get('moneda'),
                    estado=estado,
                    id_usuario=usuario,
                    id_obra=obra,
                    id_presupuesto_servicio=presupuesto_servicio if presupuesto_servicio is not None else None,
                )

            return JsonResponse({"status": "success", "message": "Subcontratación creada con éxito."}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)


class VehiculosView(View):
    def get(self, request, id_empresa):
        try:
            vehiculos = EmpresaController.get_vehiculos(id_empresa)
            # Devolver la lista de empresas como JSON
            return JsonResponse(vehiculos, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


class HerramientasView(View):
    def get(self, request, id_empresa):
        try:
            herramientas = EmpresaController.get_herramientas(id_empresa)
            return JsonResponse(herramientas, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class TareaView(View):
    def post(self, request):
        data = json.loads(request.body)
        presupuesto_servicio = None
        if data.get('id_presupuesto_servicio'):
            presupuesto_servicio = get_object_or_404(Presupuesto_Servicio, id=data["id_presupuesto_servicio"])

        area = get_object_or_404(Area, id=data["id_area"])
        vehiculo = get_object_or_404(Vehiculo, id=data["id_vehiculo"])

        try:
            tarea = Tarea.objects.create(
                titulo=data["titulo"],
                descripcion=data["descripcion"],
                id_area=area,
                fecha_inicio=data["fecha_inicio"],
                fecha_fin=data["fecha_fin"],
                precio_total=data["precio_total"],
                id_presupuesto_servicio=presupuesto_servicio,
                id_vehiculo=vehiculo
            )
            return JsonResponse({"message": "Tarea creada"}, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    def get(self, request, id_tarea):
        try:
            tarea = Tarea.objects.get(id=id_tarea)
            tarea_data = {
                'fecha_inicio': tarea.fecha_inicio,
                'fecha_fin': tarea.fecha_fin,
                'precio_total': tarea.precio_total,
                'descripcion': tarea.descripcion,
                'titulo': tarea.titulo,
                'id_area': tarea.id_area.id,
                'area': tarea.id_area.descripcion,
                'id_vehiculo':tarea.id_vehiculo.id,
                'vehiculo':tarea.id_vehiculo.tipo,
            }
            return JsonResponse(tarea_data, safe=False)
        except Tarea.DoesNotExist:
            return JsonResponse({'detail': 'Tarea no encontrada'}, status=500)

    def put(self, request, id_tarea):
        tarea = get_object_or_404(Tarea, id=id_tarea)
        data = json.loads(request.body)

        tarea.fecha_inicio = data.get('fecha_inicio', tarea.fecha_inicio)
        tarea.fecha_fin = data.get('fecha_fin', tarea.fecha_fin)
        tarea.precio_total = data.get('precio_total', tarea.precio_total)
        tarea.id_vehiculo_id = data.get('id_vehiculo', tarea.id_vehiculo_id)
        tarea.descripcion = data.get('descripcion', tarea.descripcion)
        tarea.titulo = data.get('titulo', tarea.titulo)

        # Guardar cambios
        tarea.save()

        # Preparar y enviar la respuesta
        response_data = {
            'id': tarea.id,
            'id_area': tarea.id_area_id,
            'fecha_inicio': tarea.fecha_inicio,
            'fecha_fin': tarea.fecha_fin,
            'precio_total': tarea.precio_total,
            'id_presupuesto_servicio': tarea.id_presupuesto_servicio_id,
            'id_vehiculo': tarea.id_vehiculo_id,
            'descripcion': tarea.descripcion,
            'titulo': tarea.titulo,
        }

        return JsonResponse(response_data, status=201)


@method_decorator(csrf_exempt, name='dispatch')
class IngresoView(View):
    def post(self, request):
        try:
            # Parseo del cuerpo de la solicitud para obtener una lista de ingresos
            data = json.loads(request.body)

            ingresos_creados = []
            for ingreso_data in data:
                # Llama al controlador para crear cada ingreso
                ingreso = IngresoController.crear_ingreso(ingreso_data)
                ingresos_creados.append({
                    'ingreso_id': ingreso.id,
                    'message': 'Ingreso creado correctamente'
                })

            return JsonResponse({
                'message': 'Ingresos creados correctamente',
                'ingresos': ingresos_creados
            }, status=201)
        except Exception as e:
            # Manejo de errores para fallos en el procesamiento
            return JsonResponse({'error': str(e)}, status=500)


class AlmacenesView(View):
    def get(self, request, id_empresa):
        try:
            almacenes = EmpresaController.get_almacenes(id_empresa)
            # Devolver la lista de empresas como JSON
            return JsonResponse(almacenes, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class PagoView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            monto = data.get('monto')
            moneda = data.get('moneda')
            cuota = data.get('cuota')
            id_proveedor = data.get('id_proveedor')
            id_compra = data.get('id_compra')
            id_subcontratacion = data.get('id_subcontratacion')
            fecha_pago = data.get('fecha_pago')

            # Validar que solo uno de id_compra o id_subcontratacion esté presente
            if (id_compra and id_subcontratacion) or (not id_compra and not id_subcontratacion):
                return JsonResponse({'error': 'Debe especificar solo una compra o una subcontratación, no ambas o ninguna.'}, status=400)

            # Llamada al controlador para crear el pago
            resultado = PagoController.crear_pago(monto, moneda, cuota, id_proveedor, id_compra, id_subcontratacion, fecha_pago)

            if resultado['status'] == 'success':
                return JsonResponse({'message': 'Pago registrado exitosamente', 'pago_id': resultado['pago_id']}, status=201)
            else:
                return JsonResponse({'error': resultado['error']}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'JSON inválido'}, status=400)


@method_decorator(csrf_exempt, name='dispatch')
class TareaColaboradorView(View):
    def post(self, request):
        data = json.loads(request.body)
        id_tarea = data.get('id_tarea')
        id_colaborador = data.get('id_colaborador')
        estado = data.get('estado', 'Activo')
        cant_dias = data.get('cant_dias')

        # Validación de existencia de Tarea y Colaborador
        tarea = get_object_or_404(Tarea, id=id_tarea)
        colaborador = get_object_or_404(Colaborador, id=id_colaborador)

        # Crear Tarea_Colaborador
        tarea_colaborador = Tarea_Colaborador.objects.create(
            id_tarea=tarea,
            id_colaborador=colaborador,
            estado=estado,
            cant_dias=cant_dias,
        )

        # Preparar la respuesta
        response_data = {
            'id': tarea_colaborador.id,
            'id_tarea': tarea.id,
            'id_colaborador': colaborador.id,
            'estado': tarea_colaborador.estado,
            'cant_dias': tarea_colaborador.cant_dias,
        }

        return JsonResponse(response_data, status=201)

    def get(self, request, tarea_id):
        print(tarea_id)
        colaboradores = Tarea_Colaborador.objects.filter(id_tarea=tarea_id)
        data = [
            {
                'id': c.id,
                'id_colaborador':c.id_colaborador.id,
                'nombre':c.id_colaborador.id_usuario.nombre,
                'apellido':c.id_colaborador.id_usuario.apellido,
                'estado': c.estado,
                'cant_dias':c.cant_dias,
            } for c in colaboradores
        ]

        return JsonResponse(data, safe=False)

    def delete(self,request, colaborador_id):
        Tarea_Colaborador.objects.get(id=colaborador_id).delete()
        return JsonResponse({'message': 'Colaborador eliminado'}, status=204)

    def patch(self, request, colaborador_id):
        data = json.loads(request.body)
        cant_dias = data.get('cant_dias')
        tarea = data.get('id_tarea')
        print(colaborador_id)
        print(tarea)
        if cant_dias is not None:
            colaborador = Colaborador.objects.get(id_usuario=colaborador_id)
            tarea = Tarea_Colaborador.objects.get(id_colaborador=colaborador.id, id_tarea=tarea)
            tarea.cant_dias = cant_dias
            return JsonResponse({'message': 'Cantidad de días actualizada', 'cant_dias': cant_dias}, status=200)
        else:
            return JsonResponse({'error': 'Cantidad de días no proporcionada'}, status=400)


@method_decorator(csrf_exempt, name='dispatch')
class TareaHerramientaView(View):
    def post(self, request):
        data = json.loads(request.body)
        id_tarea = data.get('id_tarea')
        id_h = data.get('id_herramienta')
        # Validación de existencia de Tarea y Herramienta
        tarea = get_object_or_404(Tarea, id=id_tarea)
        herramienta = Herramienta.objects.get(id=id_h) if id_h is not None else None

        # Crear Tarea_Herramienta
        tarea_herramienta = Tarea_Herramienta.objects.create(
            id_tarea=tarea,
            id_herramienta=herramienta,
            uso_desde=data.get('uso_desde'),
            uso_hasta=data.get('uso_hasta')
        )

        # Preparar la respuesta
        response_data = {
            'id': tarea_herramienta.id,
            'id_tarea': tarea.id,
            'uso_desde': tarea_herramienta.uso_desde,
            'uso_hasta': tarea_herramienta.uso_hasta
        }

        return JsonResponse(response_data, status=201)

    def get(self,request, tarea_id):
        herramientas = Tarea_Herramienta.objects.filter(id_tarea=tarea_id)
        data = [
            {
                'id': h.id,
                'id_herramienta': h.id_herramienta.id,
                'herramienta':h.id_herramienta.id_material.descripcion,
                'uso_desde': h.uso_desde,
                'uso_hasta': h.uso_hasta,
            } for h in herramientas
        ]
        return JsonResponse(data, safe=False)

    def delete(self, request, herramienta_id):
        Tarea_Herramienta.objects.get(id=herramienta_id).delete()
        return JsonResponse({'message': 'Herramienta eliminada'}, status=204)


@method_decorator(csrf_exempt, name='dispatch')
class TareaMaterialView(View):
    def post(self, request):
        data = json.loads(request.body)
        id_tarea = data.get('id_tarea')
        id_material = data.get('id_material')

        # Validación de existencia de Tarea y Material
        tarea = get_object_or_404(Tarea, id=id_tarea)
        material = get_object_or_404(Material, id=id_material)

        # Crear Tarea_Material
        tarea_material = Tarea_Material.objects.create(
            id_tarea=tarea,
            id_material=material,
            cant_utilizada=data.get('cant_utilizada'),
            cant_no_utilizada=data.get('cant_no_utilizada', 0)
        )

        # Preparar la respuesta
        response_data = {
            'id': tarea_material.id,
            'id_tarea': tarea.id,
            'id_material': material.id,
            'cant_utilizada': tarea_material.cant_utilizada,
            'cant_no_utilizada': tarea_material.cant_no_utilizada
        }

        return JsonResponse(response_data, status=201)

    def get(self, request, tarea_id):
        materiales = Tarea_Material.objects.filter(id_tarea=tarea_id)
        data= [
            {
                'id': m.id,
                'id_material': m.id_material.id,
                'material': m.id_material.descripcion,
                'cant_utilizada': m.cant_utilizada,
                'cant_no_utilizada': m.cant_no_utilizada,
            } for m in materiales
        ]
        return JsonResponse(data, safe=False)

    def delete(self, request, material_id):
        Tarea_Material.objects.get(id=material_id).delete()
        return JsonResponse({'message': 'Material eliminado'}, status=204)


@method_decorator(csrf_exempt, name='dispatch')
class Assistant(View):
    def post(self, request):
        data = json.loads(request.body)
        adicional = data.get('adicional')
        id_obra = adicional.get('id_obra')
        id_cliente = adicional.get('id_cliente')
        user_message = data.get('message', '').lower()
        data_return = None
        response_message = ''

        if int(user_message) == 1:
            data_return = ChatController.generador_presupuesto(id_obra)
            response_message = self.format_generador_presupuesto(data_return)

        elif int(user_message) == 2:
            data_return = ChatController.recomendaciones_materiales(id_cliente)
            response_message = self.format_recomendaciones_materiales(data_return)

        elif int(user_message) == 3:
            data_return = ChatController.ofertas_especiales()
            response_message = self.format_ofertas_especiales(data_return)

        elif int(user_message) == 4:
            data_return = ChatController.calcular_transporte_almacenaje(id_obra)
            response_message = f"El costo estimado de transporte y almacenamiento es: {data_return}"

        elif int(user_message) == 5:
            data_return = ChatController.seguimiento_avance_obra(id_obra)
            response_message = self.format_seguimiento_avance_obra(data_return)

        elif int(user_message) == 6:
            data_return = ChatController.optimizacion_costos(id_obra)
            # Construir el mensaje de respuesta
            response_message = f"Aquí tienes sugerencias para optimizar costos en la obra '{data_return['nombre_obra']}':\n"
            response_message += f"- Presupuesto total actual: {data_return['total_presupuesto']}.\n"
            if data_return['sugerencias']['materiales']:
                response_message += "\nSugerencias para materiales:\n"
                for sugerencia in data_return['sugerencias']['materiales']:
                    response_message += f"  * {sugerencia}\n"
            else:
                response_message += "\nNo se encontraron sugerencias para materiales.\n"
            if data_return['sugerencias']['servicios']:
                response_message += "\nSugerencias para servicios:\n"
                for sugerencia in data_return['sugerencias']['servicios']:
                    response_message += f"  * {sugerencia}\n"
            else:
                response_message += "\nNo se encontraron sugerencias para servicios.\n"

        elif int(user_message) == 7:
            data_return = ChatController.gestion_proveedores(id_obra)
            response_message = self.format_gestion_proveedores(data_return)

        elif int(user_message) == 8:
            data_return = ChatController.analiza_costos(id_obra)
            # Construir una respuesta más detallada
            response_message = f"""
                El análisis de costos para la obra *{data_return['nombre_obra']}* (ID: {data_return['obra_id']}) es el siguiente:
            
                - **Comparativa de materiales**:
                """
            for comp in data_return['comparativa_materiales']:
                response_message += f"      • En la obra '{comp['obra']}': Costo promedio de materiales {comp['costo_material']:.2f}. Diferencia: {comp['diferencia']:.2f}.\n"
            response_message += f"""           
                - **Comparativa de subcontrataciones**:           
                """
            for comp in data_return['comparativa_subcontratacion']:
                response_message += f"      • En la obra '{comp['obra']}': Costo promedio de subcontrataciones {comp['costo_subcontratacion']:.2f}. Diferencia: {comp['diferencia']:.2f}.\n"
            response_message += f"""           
                - **Recomendaciones**:          
                  • Materiales: {data_return['recomendaciones']['materiales']}         
                  • Subcontrataciones: {data_return['recomendaciones']['subcontrataciones']}         
                """

        elif user_message.lower() == 'si':
            response_message = "Ok, ingrese otra opción"

        elif user_message.lower() == 'no':
            response_message = "Entendido, ¡Hasta luego!"

        return JsonResponse({'message': response_message, 'data_return': data_return})

    def format_gestion_proveedores(self, data):
        if not data:
            return "No se encontraron proveedores o subcontratistas recomendados."

        response = f"Para la obra *{data['nombre_obra']}* (ID: {data['obra_id']}):\n\n"
        if data.get('proveedores_recomendados'):
            response += "### Proveedores recomendados:\n"
            for proveedor in data['proveedores_recomendados']:
                response += f"- **{proveedor['proveedor']}** (Calificación: {proveedor['calificacion']})\n"
                response += f"  - Materiales: {', '.join(proveedor['materiales'])}\n"
                response += f"  - Comentarios: {', '.join(proveedor['comentarios'])}\n"

        if data.get('subcontratistas_recomendados'):
            response += "\n### Subcontratistas recomendados:\n"
            for sub in data['subcontratistas_recomendados']:
                response += f"- **{sub['subcontratista']}** (Calificación: {sub['calificacion']})\n"
                response += f"  - Servicios: {', '.join(sub['servicios'])}\n"
                response += f"  - Comentarios: {', '.join(sub['comentarios'])}\n"

        return response

    def format_recomendaciones_materiales(self, data):
        if not data:
            return "No se encontraron recomendaciones de materiales."

        response = "Recomendaciones de materiales frecuentes:\n"
        for material in data:
            response += f"- {material['descripcion']}: {material['marca']}; Precio {material['precio']} {material['moneda']} / {material['unidad_medida']}\n"
        return response

    def format_generador_presupuesto(self, data):
        if not data:
            return "No se pudo generar un presupuesto para esta obra."

        response = f"Presupuesto generado para la obra *{data['direccion']}:* \n\n"
        response += f"- **Total estimado:** {data['total']} {data['moneda']}\n"
        response += f"- **Materiales incluidos:**\n"
        for material in data['materiales']:
            response += f"  - {material['descripcion']} ( con precio de {material['precio']} {material['moneda']}/{material['unidad_medida']})\n"
        response += f"- **Servicios estimados:**\n"
        for servicio in data['servicios']:
            response += f"  - {servicio['descripcion']} (con precio de {servicio['precio_x_unidad']} {servicio['moneda']}/{servicio['unidad_medida']})\n"
        return response

    @staticmethod
    def format_ofertas_especiales(ofertas):
        response = "Estas son las ofertas especiales vigentes:\n\n"

        # Procesar materiales
        if ofertas["materiales"]:
            response += "🏗️ **Ofertas de Materiales:**\n"
            for material in ofertas["materiales"]:
                response += (
                    f"- **{material['descripcion_material']}** (Marca: {material['marca']})\n"
                    f"  Oferta: {material['descripcion_oferta']}\n"
                    f"  Descuento: {material['descuento']}% hasta {material['fecha_hasta']}\n\n"
                )
        else:
            response += "No hay ofertas disponibles para materiales.\n\n"

        # Procesar servicios
        if ofertas["servicios"]:
            response += "🛠️ **Ofertas de Servicios:**\n"
            for servicio in ofertas["servicios"]:
                response += (
                    f"- **{servicio['descripcion_servicio']}**\n"
                    f"  Oferta: {servicio['descripcion_oferta']}\n"
                    f"  Descuento: {servicio['descuento']}% hasta {servicio['fecha_hasta']}\n\n"
                )
        else:
            response += "No hay ofertas disponibles para servicios.\n"

        return response

    def format_seguimiento_avance_obra(self, data):
        mensaje = f"Seguimiento del avance de obra:\n\n"
        mensaje += f"📍 *Nombre de la obra*: {data['nombre_obra']} (ID: {data['obra_id']})\n"
        mensaje += f"📊 *Avance general*: {data['avance_general']:.2f}%\n\n"

        if data["tareas"]:
            mensaje += "🔨 *Tareas en progreso*:\n"
            for tarea in data["tareas"]:
                mensaje += f"  - *Tarea ID*: {tarea['tarea_id']}\n"
                mensaje += f"    *Descripción*: {tarea['descripcion']}\n"
                mensaje += f"    *Avance*: {tarea['porcentaje_avance']:.2f}%\n"

                # Colaboradores
                if tarea["colaboradores"]:
                    mensaje += "    👷‍♂️ *Colaboradores asignados*:\n"
                    for col in tarea["colaboradores"]:
                        mensaje += f"      - {col['nombre']} {col['apellido']} (ID: {col['id']})\n"

                # Materiales
                if tarea["materiales"]:
                    mensaje += "    🧱 *Materiales utilizados*:\n"
                    for mat in tarea["materiales"]:
                        mensaje += f"      - {mat['nombre']} (ID: {mat['id']})\n"

                # Herramientas
                if tarea["herramientas"]:
                    mensaje += "    🔧 *Herramientas utilizadas*:\n"
                    for her in tarea["herramientas"]:
                        mensaje += f"      - {her['nombre']} (ID: {her['id']})\n"
                mensaje += "\n"
        else:
            mensaje += "No hay tareas asociadas a esta obra.\n"

        return mensaje


class ReporteObraView(View):
    def get(self, request, id_obra):
        resultado = ReporteObra.reporte_gastos_avance(id_obra)
        return JsonResponse(resultado, safe=False)


@method_decorator(csrf_exempt, name='dispatch')
class CobroView(View):
    def post(self, request):
        data = json.loads(request.body)
        cliente = ClienteController.get_by_id(data["id_cliente"])
        obra = Obra.objects.get(id=data["id_obra"])

        try:
            pago = Cobros.objects.create(
                id_cliente=cliente,
                id_obra=obra,
                monto=data["monto"],
                moneda=data["moneda"],
                fecha_pago=data["fecha_pago"],
                realizado=data["realizado"],
                fecha_limite=data["fecha_limite"],
                cantidad_recargo=data["cantidad_recargo"],
                unidad_recargo=data["unidad_recargo"]
            )
            return JsonResponse({"message": "Tarea creada"}, safe=False)
        except Exception as e:
            print(e)
            return JsonResponse({'error': str(e)}, status=500)


class ObraEmpresaView(View):
    def get(self, request, id_empresa):
        obras = Obra.objects.filter(id_empresa=id_empresa)
        obras_return = [
            {
                'id': o.id,
                'direccion': o.direccion,
                'id_cliente': o.id_cliente.id,
                'cliente_nombre': o.id_cliente.id_usuario.nombre,
                'cliente_apellido': o.id_cliente.id_usuario.apellido,
                'telefono_contacto': o.telefono_contacto,
                'fecha_inicio_est': o.fecha_inicio_est,
                'monto_total_est': o.monto_total_est,
                'tipo_obra': o.tipo_obra,
                'estado': o.estado
            } for o in obras
        ]
        return JsonResponse({'obras':obras_return}, safe=False)


class ObrasPerfilView(View):
    def get(self, request, userId):
        try:
            user = Cliente.objects.get(id_usuario=userId)
        except Cliente.DoesNotExist:
            return JsonResponse(None, safe=False)

        obras = Obra.objects.filter(id_cliente=user.id)
        obras_return = [
            {
                'id': o.id,
                'direccion': o.direccion,
                'estado': o.estado
            } for o in obras
        ]
        return JsonResponse(obras_return, safe=False)


class TareasPerfilView(View):
    def get(self, request, userId):
        try:
            # Buscar el colaborador
            user = Colaborador.objects.get(id_usuario=userId)

            # Obtener las tareas asociadas al colaborador
            tareas = Tarea_Colaborador.objects.filter(id_colaborador=user.id)
            tareas_return = [
                {
                    'id': t.id,
                    'tarea': t.id_tarea.titulo,
                    'descripcion': t.id_tarea.descripcion,
                    'cant_dias': t.cant_dias,
                    'estado': t.estado,
                    'id_tarea': t.id_tarea.id,
                } for t in tareas
            ]
            return JsonResponse(tareas_return, safe=False)

        except Colaborador.DoesNotExist:
            # Si no se encuentra el colaborador, devolver null
            return JsonResponse(None, safe=False)


class AlmacenesPorEmpresaView(View):
    def get(self, request, id_empresa):
        try:
            almacenes = Almacen.objects.filter(id_empresa=id_empresa)
            almacenes_return = []

            for almacen in almacenes:
                # Obtener ingresos del almacén
                ingresos = Ingreso.objects.filter(id_almacen=almacen.id)
                ingresos_data = [
                    {
                        'id': ingreso.id,
                        'cantidad': ingreso.cantidad,
                        'fecha': ingreso.fecha,
                        'material': {
                            'id': ingreso.id_material.id,
                            'nombre': ingreso.id_material.descripcion
                        },
                        'unidad_medida': ingreso.unidad_medida,
                        'id_compra': ingreso.id_compra.id,
                        'fecha_real': ingreso.fecha_real,
                        'realizado': ingreso.realizado,
                        'en_obra': ingreso.en_obra,
                    }
                    for ingreso in ingresos
                ]

                # Obtener herramientas del almacén
                herramientas = Herramienta.objects.filter(id_almacen=almacen.id)
                herramientas_data = [
                    {
                        'id': herramienta.id,
                        'material': {
                            'id': herramienta.id_material.id,
                            'nombre': herramienta.id_material.descripcion
                        },
                        'ubicacion': herramienta.ubicacion,
                        'marca': herramienta.marca,
                        'id_compra': herramienta.id_compra.id,
                    }
                    for herramienta in herramientas
                ]

                almacenes_return.append({
                    'id': almacen.id,
                    'descripcion': almacen.descripcion,
                    'direccion': almacen.direccion,
                    'contacto': almacen.contacto,
                    'ciudad': almacen.ciudad,
                    'provincia': almacen.provincia,
                    'ingresos': ingresos_data,
                    'herramientas': herramientas_data,
                })

            return JsonResponse({'almacenes': almacenes_return}, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)