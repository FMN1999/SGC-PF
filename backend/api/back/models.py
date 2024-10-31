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


class Proveedor(models.Model):
    id = models.AutoField(primary_key=True)
    denominacion = models.CharField()
    telefono = models.CharField(max_length=150)
    direccion = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    cuil = models.CharField()
    ciudad = models.CharField()
    provincia = models.CharField()
    id_empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, db_column='id_empresa')

    class Meta:
        db_table = 'Proveedor'


class Material(models.Model):
    id = models.AutoField(primary_key=True)
    id_proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE, db_column='id_proveedor')
    tipo_material = models.CharField()
    unidad_medida = models.CharField()
    descripcion = models.CharField()
    marca = models.CharField()
    precio = models.FloatField()
    moneda = models.CharField()
    impuestos_total = models.FloatField()
    moneda_impuestos = models.CharField()
    descripcion_impuestos = models.CharField()
    otros_gastos = models.FloatField()
    moneda_otros_gastos = models.CharField()
    descripcion_otros_gastos = models.CharField()
    fecha_desde_precio = models.DateField()

    class Meta:
        db_table = 'Material'


class Servicio(models.Model):
    id = models.AutoField(primary_key=True)
    id_proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE, db_column='id_proveedor')
    descripcion = models.CharField()
    unidad_medida = models.CharField()
    precio_x_unidad = models.FloatField()
    moneda = models.CharField()
    monto_x_frecuencia = models.FloatField()
    frecuencia_pago = models.CharField()
    impuestos_total = models.FloatField()
    moneda_impuestos = models.CharField()
    descripcion_impuestos = models.CharField()
    otros_gastos = models.FloatField()
    moneda_otros_gastos = models.CharField()
    descripcion_otros_gastos = models.CharField()

    class Meta:
        db_table = 'Servicio'


class Oferta(models.Model):
    id = models.AutoField(primary_key=True)
    descripcion = models.CharField()
    monto_total = models.FloatField()
    moneda = models.CharField()
    fecha_desde = models.DateField()
    fecha_hasta = models.DateField()
    id_proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE, db_column='id_proveedor')

    class Meta:
        db_table = 'Oferta'


class Oferta_Material(models.Model):
    id = models.AutoField(primary_key=True)
    id_oferta = models.ForeignKey(Oferta, on_delete=models.CASCADE, db_column='id_oferta')
    id_material = models.ForeignKey(Material, on_delete=models.CASCADE, db_column='id_material')
    cantidad_of = models.FloatField()
    unidad_of = models.CharField()
    monto = models.FloatField()
    moneda = models.CharField()
    porc_desc = models.FloatField()

    class Meta:
        db_table = 'Oferta_Material'


class Oferta_Servicio(models.Model):
    id = models.AutoField(primary_key=True)
    id_oferta = models.ForeignKey(Oferta, on_delete=models.CASCADE, db_column='id_oferta')
    id_servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE, db_column='id_servicio')
    cantidad_of = models.FloatField()
    unidad_tiempo = models.CharField()
    monto = models.FloatField()
    moneda = models.CharField()
    porc_desc = models.FloatField()

    class Meta:
        db_table = 'Oferta_Servicio'


class Obra(models.Model):
    id = models.AutoField(primary_key=True)
    direccion = models.CharField()
    id_cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, db_column='id_cliente')
    telefono_contacto = models.CharField()
    fecha_inicio_est = models.DateField()
    fecha_fin_est = models.DateField()
    fecha_inicio_real = models.DateField()
    fecha_fin_real = models.DateField()
    monto_total_est = models.FloatField()
    monto_total_real = models.FloatField()
    moneda = models.CharField()
    pisos = models.IntegerField()
    dimensiones = models.CharField()
    estado = models.CharField()
    ganancias = models.FloatField()
    perdidas = models.FloatField()
    id_empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, db_column='id_empresa')

    class Meta:
        db_table = 'Obra'


class Area(models.Model):
    id = models.AutoField(primary_key=True)
    id_obra = models.ForeignKey(Obra, on_delete=models.CASCADE, db_column='id_obra')
    descripcion = models.CharField()
    dimensiones = models.CharField()
    estado = models.CharField()
    porcentaje = models.FloatField()

    class Meta:
        db_table = 'Area'


class Nota(models.Model):
    id = models.AutoField(primary_key=True)
    descripcion = models.CharField()
    id_usuario= models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='id_usuario')
    fecha = models.DateField()
    id_obra = models.ForeignKey(Obra, on_delete=models.CASCADE, db_column='id_obra')

    class Meta:
        db_table = 'Nota'


class FotoAvances(models.Model):
    id = models.AutoField(primary_key=True)
    id_avance = models.ForeignKey(Nota, on_delete=models.CASCADE, db_column='id_avance')
    url = models.CharField()

    class Meta:
        db_table = 'FotoAvances'


class Documento(models.Model):
    id = models.AutoField(primary_key=True)
    descripcion = models.CharField()
    nombre = models.CharField()
    tipo_archivo = models.CharField()
    link = models.CharField()
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='id_usuario')
    id_obra = models.ForeignKey(Obra, on_delete=models.CASCADE, db_column='id_obra')

    class Meta:
        db_table = 'Documento'


class Presupuesto(models.Model):
    id = models.AutoField(primary_key=True)
    id_obra = models.ForeignKey(Obra, on_delete=models.CASCADE, db_column='id_obra')
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='id_usuario')
    total = models.FloatField()
    moneda = models.CharField()
    fecha_creacion = models.DateField()
    observaciones = models.CharField()
    estado = models.CharField()
    aprobado = models.BooleanField()
    porc_inflacion = models.FloatField()

    class Meta:
        db_table = 'Presupuesto'


class Presupuesto_Material(models.Model):
    id = models.AutoField(primary_key=True)
    id_presupuesto = models.ForeignKey(Presupuesto, on_delete=models.CASCADE, db_column='id_presupuesto')
    cantidad = models.FloatField()
    precio_x_unidad_medida = models.FloatField()
    unidad_medida = models.CharField()
    id_area = models.ForeignKey(Area, on_delete=models.CASCADE, db_column="id_area")
    monto_linea = models.FloatField()
    desc_material = models.CharField()

    class Meta:
        db_table = 'Presupuesto_Material'


class Presupuesto_Servicio(models.Model):
    id = models.AutoField(primary_key=True)
    precio_x_hora = models.FloatField()
    horas = models.FloatField()
    moneda = models.CharField()
    id_area = models.ForeignKey(Area, on_delete=models.CASCADE, db_column="id_area")
    monto_linea = models.FloatField()
    id_presupuesto = models.ForeignKey(Presupuesto, on_delete=models.CASCADE, db_column='id_presupuesto')
    desc_servicio = models.CharField()

    class Meta:
        db_table = 'Presupuesto_Servicio'


class Presupuesto_Trabajador(models.Model):
    id = models.AutoField(primary_key=True)
    puesto = models.CharField()
    horas = models.FloatField()
    precio_x_hora = models.FloatField()
    moneda = models.CharField()
    id_area = models.ForeignKey(Area, on_delete=models.CASCADE, db_column="id_area")
    monto_linea = models.FloatField()
    id_presupuesto = models.ForeignKey(Presupuesto, on_delete=models.CASCADE, db_column='id_presupuesto')


    class Meta:
        db_table = 'Presupuesto_Trabajador'

