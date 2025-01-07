from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.back.urls')),  # Asegúrate de no incluir aquí un `include('api.urls')` que cause recursión
]

