from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('register/', views.RegistroClienteView.as_view(), name='registrar_cliente'),
    path('empresas/', views.EmpresasView.as_view(), name='empresas'),
    path('perfil/<int:userId>/', views.PerfilView.as_view(), name='obtener_perfil'),
    path('crear-usuario-colaborador/', views.ColaboradorView.as_view(), name='crear_usuario_y_colaborador'),
    path('crear-proveedor/', views.ProveedorView.as_view(), name='crear-proveedor'),
    path('proveedor/<int:proveedor_id>/', views.ProveedorView.as_view(), name='proveedor-detail'),
]