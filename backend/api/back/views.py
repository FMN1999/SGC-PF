from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import json
from .controller import *
from datetime import datetime


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
            # Buscar el proveedor por ID
            proveedor = ProveedorController.get_by_id(proveedor_id)
            # Formatear la respuesta
            proveedor_data = {
                'id': proveedor.id,
                'denominacion': proveedor.denominacion,
                'telefono': proveedor.telefono,
                'direccion': proveedor.direccion,
                'email': proveedor.email,
                'cuil': proveedor.cuil,
                'ciudad': proveedor.ciudad,
                'provincia': proveedor.provincia,
                'id_empresa': proveedor.id_empresa.id
            }
            return JsonResponse({'status': 'success', 'proveedor': proveedor_data}, status=200)
        except Proveedor.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Proveedor no encontrado'}, status=404)
