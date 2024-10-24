from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import json
from .controller import *
from django.core.exceptions import ValidationError
from django.utils.dateparse import parse_date


@method_decorator(csrf_exempt, name='dispatch')
class LoginView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            usuario = data.get('usuario')
            contrasenia = data.get('contrasenia')

            usuario_obj = UsuarioController.login(usuario, contrasenia)
            print('Recuperé usuario')
            colaborador = ColaboradorController.get_by_user(usuario_obj)
            cliente = ClienteController.get_by_user(usuario_obj)
            print('Recuperé hijos')
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
        try:
            data = json.loads(request.body)
            proveedor_id = data.get('id_proveedor')
            print(proveedor_id)

            # Validar y crear material
            material = MaterialController.crear_material(data, proveedor_id)

            return JsonResponse({'message': 'Material creado con éxito', 'material': material.id}, status=201)
        except ValidationError as ve:
            return JsonResponse({'error': str(ve)}, status=400)
        except Exception as e:
            return JsonResponse({'error': f"Error al crear material: {str(e)}"}, status=500)

    def get(self, request, material_id):
        try:
            material = MaterialController.get_by_id(material_id)
            material_data = {
                'id': material.id,
                'descripcion': material.descripcion,
                'marca': material.marca,
                'precio': material.precio,
                'moneda': material.moneda,
                'fecha_caducidad': material.fecha_caducidad,
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
                'moneda': material.moneda
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