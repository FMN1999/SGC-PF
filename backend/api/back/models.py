from django.db import models


class Empresa(models.Model):
    id = models.AutoField(primary_key=True)
    denominacion = models.CharField()
    cuit = models.CharField()
    telefono = models.CharField()
    email = models.CharField()

    class Meta:
        db_table = 'Empresa'


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


class Colaborador(models.Model):
    id = models.AutoField(primary_key=True)
    fecha_alta = models.DateField()
    fecha_baja = models.DateField()
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='id_usuario')
    puesto = models.CharField()
    rol = models.CharField()
    id_empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, db_column='id_empresa')

    class Meta:
        db_table = 'Colaborador'


class Cliente(models.Model):
    id = models.AutoField(primary_key=True)
    fecha_alta = models.DateField()
    fecha_baja = models.DateField()
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='id_usuario')
    ciudad = models.CharField()
    provincia = models.CharField()
    cuit = models.CharField()
    monto_deuda = models.FloatField()
    moneda_deuda = models.CharField()
    id_empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, db_column='id_empresa')

    class Meta:
        db_table = 'Cliente'

