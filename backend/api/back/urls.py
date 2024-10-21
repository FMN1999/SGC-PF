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
    path('oferta/<int:oferta_id>/', views.OfertaView.as_view(), name='oferta-detalle'),
    path('material/crear/', views.MaterialView.as_view(), name='crear-material'),
    path('servicio/crear/', views.ServicioView.as_view(), name='crear-servicio'),
    path('oferta/crear/', views.OfertaView.as_view(), name='crear-oferta'),
    path('materiales/<int:proveedor_id>/', views.MaterialesPorProveedorView.as_view(), name='materiales-por-proveedor'),
    path('servicios/<int:proveedor_id>/', views.ServiciosPorProveedorView.as_view(), name='servicios-por-proveedor'),
    path('material/<int:material_id>/', views.MaterialView.as_view(), name='material-detail'),
    path('servicio/<int:servicio_id>/', views.ServicioView.as_view(), name='servicio-detail'),
    path('oferta-detalle/<int:oferta_id>/', views.OfertaDetalleView.as_view(), name='oferta-detail'),
    path('material/eliminar/<int:material_id>/', views.MaterialView.as_view(), name='eliminar-material'),
    path('servicio/eliminar/<int:servicio_id>/', views.ServicioView.as_view(), name='eliminar-servicio'),
    path('oferta/eliminar/<int:oferta_id>/', views.OfertaView.as_view(), name='eliminar-oferta'),
    path('material/actualizar/<int:material_id>/', views.MaterialView.as_view(), name='actualizar_material'),
    path('servicio/actualizar/<int:servicio_id>/', views.ServicioView.as_view(), name='actualizar_servicio'),
    path('proveedores/<int:id>/', views.ProveedorView.as_view(), name='obtener_actualizar_proveedor'),
]