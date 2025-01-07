import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, ReactiveFormsModule} from '@angular/forms';
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {PresupuestoService} from "../../services/presupuesto/presupuesto.service";
import {CompraService} from "../../services/compra/compra.service";
import {EmpresaService} from "../../services/empresa/empresa.service";
import {HeaderComponent} from '../header/header.component';

@Component({
  selector: 'app-solicitud-compra',
  templateUrl: './solicitud-compra.component.html',
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    HeaderComponent
  ],
  standalone: true,
  styleUrls: ['./solicitud-compra.component.scss']
})
export class SolicitudCompraComponent implements OnInit {
  // @ts-ignore
  compraForm: FormGroup;
  protected idPresupuesto: number | undefined;
  protected materiales_data: any;
  protected idObra: number | undefined;
  protected idSolicitante= sessionStorage.getItem('id_usuario');
  materiales: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private presupuestoService: PresupuestoService,
    private compraService: CompraService,
    private empresaService: EmpresaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.idPresupuesto = +this.route.snapshot.paramMap.get('idPresupuesto')!;
    this.idObra = +this.route.snapshot.paramMap.get('idObra')!;
    this.compraForm = this.fb.group({
      id_obra:[this.idObra],
      id_solicitante:[this.idSolicitante],
      monto_total: [''],
      fecha_compra: [''],
      costo_transporte: [''],
      moneda_transporte: [''],
      estado: [{ value: 'Solicitado', disabled: true }],
      lineasCompra: this.fb.array([])
    });
    this.cargarDatosIniciales();
  }

  get lineasCompra(): FormArray {
    return this.compraForm.get('lineasCompra') as FormArray;
  }

  cargarDatosIniciales() {
    if (this.idPresupuesto) {
    this.presupuestoService.getMaterialesPorPresupuesto(this.idPresupuesto)
      .subscribe((materiales) => {
        materiales.forEach((material) => {
          this.agregarLineaCompra(material);
        });
        this.materiales=materiales;
      });
    }

    const idEmpresa = sessionStorage.getItem('id_empresa');
    if (idEmpresa) {
      this.empresaService.listarMaterialesPorEmpresa(parseInt(idEmpresa)).subscribe({
        next: (data) => {
          this.materiales_data = data;
        }
      });
    }
  }

  agregarLineaCompra(material?: any) {
    const nuevaLinea = this.fb.group({
      cantidad: [material?.cantidad || ''],  // Usa el valor de 'material' o un valor por defecto
      precio_total: [material?.precio_total || ''],
      unidad_medida: [material?.unidad_medida || ''],
      id_material: [material?.id_material || ''],
      id_presupuesto_material: [material?.id_presupuesto_material || ''],
      lote: [material?.lote || ''],
      nro_serie: [material?.nro_serie || ''],
      id_proveedor:[material?.id_proveedor || '']
    });
    this.lineasCompra.push(nuevaLinea);
  }


  eliminarLineaCompra(index: number) {
    this.lineasCompra.removeAt(index);
  }

  onSubmit() {
    const formValues = this.compraForm.value;
    const lineasCompra = formValues.lineasCompra;
    this.crearCompra(lineasCompra, formValues);
    window.location.reload();
    this.router.navigate(['/solicitudes'] ).then(r =>{});

  }

  crearCompra(lineas: any[], formValues: any) {
    // Calcular el monto total sumando los precios de las líneas de compra
    const montoTotal = lineas.reduce((acc, linea) => acc + (linea.precio_total || 0), 0);

    // Estructurar el objeto de la compra y las líneas

    const nuevaCompra = {
      monto_total: montoTotal,
      id_obra: this.idObra,
      costo_transporte: formValues.costo_transporte || 0,
      moneda_transporte: formValues.moneda_transporte || 'USD',
      estado: 'Pendiente',
      // @ts-ignore
      id_solicitante: parseInt(this.idSolicitante),
      id_aprobador: formValues.id_aprobador || null,
      lineas_compra: lineas.map(linea => ({
        nr_posicion: linea.nr_posicion || '',  // Asigna el número de posición si existe
        cantidad: linea.cantidad,
        lote: linea.lote || '',
        nro_serie: linea.nro_serie || '',
        precio_total: linea.precio_total,
        id_material: linea.id_material,
        unidad_medida: linea.unidad_medida,
        id_presupuesto_material: linea.id_presupuesto_material || null
      }))
    };

    // Llamada al servicio para crear la compra junto con sus líneas
    this.compraService.crearCompra(nuevaCompra).subscribe({
      next: (response: any) => {
        console.log('Compra creada con éxito:', response);
        // Aquí puedes manejar la respuesta, como redirigir o mostrar un mensaje
      },
      error: (error) => {
        console.error('Error al crear la compra:', error);
        // Aquí puedes manejar el error
      }
    });
  }
}

