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
    tipo_obra = models.CharField()
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


class Compra(models.Model):
    id = models.AutoField(primary_key=True)
    monto_total = models.FloatField()
    fecha_compra = models.DateField()
    id_proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE, db_column='id_proveedor')
    id_obra = models.ForeignKey(Obra, on_delete=models.CASCADE, db_column='id_obra')
    costo_transporte = models.FloatField()
    moneda_transporte = models.CharField()
    estado = models.CharField()
    id_solicitante = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='id_solicitante', related_name='id_solicitante')
    id_aprobador = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='id_aprobador', related_name='id_aprobador', null=True, blank=True)

    class Meta:
        db_table = 'Compra'


class Almacen(models.Model):
    id = models.AutoField(primary_key=True)
    descripcion = models.CharField()
    direccion = models.CharField()
    id_empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, db_column='id_empresa')
    contacto = models.CharField()
    ciudad = models.CharField()
    provincia = models.CharField()

    class Meta:
        db_table = 'Almacen'


class Herramienta(models.Model):
    id = models.AutoField(primary_key=True)
    id_almacen = models.ForeignKey(Almacen, on_delete=models.CASCADE, db_column='id_almacen')
    id_compra = models.ForeignKey(Compra, on_delete=models.CASCADE, db_column='id_compra')
    id_material = models.ForeignKey(Material, on_delete=models.CASCADE, db_column='id_material')
    ubicacion = models.CharField()
    marca = models.CharField()

    class Meta:
        db_table = 'Herramienta'


class Vehiculo(models.Model):
    id = models.AutoField(primary_key=True)
    patente = models.CharField()
    id_compra = models.ForeignKey(Compra, on_delete=models.CASCADE, db_column='id_compra')
    tipo = models.CharField()
    marca = models.CharField()
    modelo = models.CharField()
    precio_x_hora = models.FloatField()
    id_almacen = models.ForeignKey(Almacen, on_delete=models.CASCADE, db_column='id_almacen')
    id_material = models.ForeignKey(Material, on_delete=models.CASCADE, db_column='id_material')

    class Meta:
        db_table = 'Vehiculo'


class LineaCompra(models.Model):
    id = models.AutoField(primary_key=True)
    nr_posicion = models.CharField()
    cantidad = models.FloatField()
    lote = models.CharField()
    nro_serie = models.IntegerField()
    precio_total = models.FloatField()
    id_material = models.ForeignKey(Material, on_delete=models.CASCADE, db_column='id_material')
    unidad_medida = models.CharField()
    id_presupuesto_material = models.ForeignKey(Presupuesto_Material, on_delete=models.CASCADE, db_column='id_presupuesto_material')
    id_compra = models.ForeignKey(Compra, on_delete=models.CASCADE, db_column='id_compra')

    class Meta:
        db_table = 'LineaCompra'


class Subcontratacion(models.Model):
    id = models.AutoField(primary_key=True)
    id_servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE, db_column='id_servicio')
    fecha_contrato = models.DateField()
    nro_contrato = models.IntegerField()
    fecha_contrato_hasta = models.DateField()
    monto_contratacion = models.FloatField()
    moneda_contratacion = models.CharField()
    estado = models.CharField()
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='id_usuario')
    id_obra = models.ForeignKey(Obra, on_delete=models.CASCADE, db_column='id_obra')
    id_presupuesto_servicio = models.ForeignKey(Presupuesto_Servicio, on_delete=models.CASCADE, db_column='id_presupuesto_servicio')

    class Meta:
        db_table = 'Subcontratacion'


class Tarea(models.Model):
    id = models.AutoField(primary_key=True)
    id_area = models.ForeignKey(Area, on_delete=models.CASCADE, db_column='id_area')
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    precio_total = models.FloatField()
    id_presupuesto_servicio = models.ForeignKey(Presupuesto_Servicio, on_delete=models.CASCADE, db_column='id_presupuesto_servicio')
    id_vehiculo = models.ForeignKey(Vehiculo, on_delete=models.CASCADE, db_column='id_vehiculo')
    descripcion = models.CharField()
    titulo = models.CharField()
    porcentaje_avance = models.FloatField()

    class Meta:
        db_table = 'Tarea'


class Ingreso(models.Model):
    id = models.AutoField(primary_key=True)
    cantidad = models.FloatField()
    fecha = models.DateField()
    id_material = models.ForeignKey(Material, on_delete=models.CASCADE, db_column='id_material')
    unidad_medida = models.CharField()
    id_almacen = models.ForeignKey(Almacen, on_delete=models.CASCADE, db_column='id_almacen')
    id_compra = models.ForeignKey(Compra, on_delete=models.CASCADE, db_column='id_compra')
    fecha_real = models.DateField()
    realizado = models.BooleanField()
    en_obra = models.BooleanField()

    class Meta:
        db_table = 'Ingreso'


class Pago(models.Model):
    id = models.AutoField(primary_key=True)
    monto = models.FloatField()
    moneda = models.CharField()
    cuota = models.IntegerField()
    id_proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE, db_column='id_proveedor')
    id_compra = models.ForeignKey(Compra, on_delete=models.CASCADE, db_column='id_compra')
    id_subcontratacion = models.ForeignKey(Subcontratacion, on_delete=models.CASCADE, db_column='id_subcontratacion')
    fecha_pago = models.DateField()

    class Meta:
        db_table = 'Pago'


class Tarea_Colaborador(models.Model):
    id = models.AutoField(primary_key=True)
    id_tarea = models.ForeignKey(Tarea, on_delete=models.CASCADE, db_column='id_tarea')
    estado = models.CharField()
    id_colaborador = models.ForeignKey(Colaborador, on_delete=models.CASCADE, db_column='id_colaborador')
    cant_dias = models.FloatField()

    class Meta:
        db_table = 'Tarea_Colaborador'


class Tarea_Herramienta(models.Model):
    id = models.AutoField(primary_key=True)
    id_tarea = models.ForeignKey(Tarea, on_delete=models.CASCADE, db_column='id_tarea')
    id_herramienta = models.ForeignKey(Herramienta, on_delete=models.CASCADE, db_column='id_herramienta')
    uso_desde = models.DateField()
    uso_hasta = models.DateField()

    class Meta:
        db_table = 'Tarea_Herramienta'


class Tarea_Material(models.Model):
    id = models.AutoField(primary_key=True)
    id_tarea = models.ForeignKey(Tarea, on_delete=models.CASCADE, db_column='id_tarea')
    id_material = models.ForeignKey(Material, on_delete=models.CASCADE, db_column='id_material')
    cant_utilizada = models.FloatField()
    cant_no_utilizada = models.FloatField()

    class Meta:
        db_table = 'Tarea_Material'


class Cobros(models.Model):
    id = models.AutoField(primary_key=True)
    id_cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, db_column='id_cliente')
    id_obra = models.ForeignKey(Obra, on_delete=models.CASCADE, db_column='id_obra')
    monto = models.FloatField()
    moneda = models.CharField()
    fecha_pago = models.DateField()
    realizado = models.BooleanField()
    fecha_limite = models.DateField()
    cantidad_recargo = models.FloatField()
    unidad_recargo = models.CharField()

    class Meta:
        db_table = 'Cobros'
