import os
from pathlib import Path
import dj_database_url  # Solo si estás usando dj-database-url para Heroku

# BASE_DIR debería apuntar a la carpeta 'backend' 
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'reemplaza-esto-por-tu-secret-key')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['*']  # Ajusta según tus necesidades, por ejemplo: ['tu-dominio.com', 'localhost']

# Application definition
INSTALLED_APPS = [
    'api.back',
    'corsheaders',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

ROOT_URLCONF = 'api.urls'

WSGI_APPLICATION = 'api.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'sgc_construccion_ale',
        'USER': 'sgc_construccion_ale_user',
        'PASSWORD': 'lxzWBZP0Wo1BfQq4HHUham57rt3Bl0BD',
        'HOST': 'dpg-cu7bo2bv2p9s73bf9lkg-a.virginia-postgres.render.com',
        'PORT': '5432',
    }
}

CORS_ALLOWED_ORIGINS = [
    'http://localhost:4200',
    'https://sgc-contruccion.vercel.app',  # Agrega el origen de tu frontend
]

# Permitir ciertos métodos HTTP
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# Permitir ciertos encabezados
CORS_ALLOW_HEADERS = [
    'accept',
    'authorization',
    'content-type',
    'x-csrftoken',
    'x-requested-with',
]

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Configuración para los archivos de medios (si aplica)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Añadir configuración para permitir CORS si es necesario
CORS_ALLOW_ALL_ORIGINS = True  # Solo si estás usando CORS
