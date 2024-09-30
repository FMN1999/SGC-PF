from django.db import models


class Usuario(models.Model):
    id = models.AutoField(primary_key=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    nombre = models.CharField(max_length=150)
    apellido = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    usuario = models.CharField(max_length=150, unique=True)
    contrasenia = models.CharField(max_length=150)
    sexo = models.CharField(max_length=10)
    celular = models.CharField(max_length=150)
    telefono = models.CharField(max_length=150)
    direccion = models.CharField(max_length=150)

    class Meta:
        db_table = 'Usuario'  # nombre de la tabla en MySQL