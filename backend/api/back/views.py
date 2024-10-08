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
            if usuario_obj:
                response_data = {
                    'user_id': usuario_obj.id  # Devolver el ID del usuario
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
