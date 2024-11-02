import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule} from '@angular/forms';
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {PresupuestoService} from "../../services/presupuesto/presupuesto.service";

@Component({
  selector: 'app-solicitud-compra',
  standalone: true,
  templateUrl: './solicitud-compra.component.html',
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgForOf
  ],
  styleUrls: ['./solicitud-compra.component.scss']
})
export class SolicitudCompraComponent implements OnInit {
  compraForm: FormGroup;
  protected idPresupuesto: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private presupuestoService: PresupuestoService
  ) {}

  ngOnInit() {
    this.idPresupuesto = +this.route.snapshot.paramMap.get('idPresupuesto')!;
    this.compraForm = this.fb.group({
      monto_total: ['', Validators.required],
      fecha_compra: ['', Validators.required],
      costo_transporte: ['', Validators.required],
      moneda_transporte: ['', Validators.required],
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
        });
    }
  }

  agregarLineaCompra(material: any = { cantidad: '', precio_total: '', unidad_medida: '' }): void {
    const lineaForm = this.fb.group({
      cantidad: [material.cantidad, Validators.required],
      precio_total: [material.precio_total, Validators.required],
      unidad_medida: [material.unidad_medida, Validators.required],
    });
    this.lineasCompra.push(lineaForm);
  }

  eliminarLineaCompra(index: number) {
    this.lineasCompra.removeAt(index);
  }

  onSubmit() {
    if (this.compraForm.valid) {
      const compraData = this.compraForm.getRawValue();
      // Enviar a través del servicio a backend para guardar la compra
      console.log('Solicitud de compra enviada:', compraData);
    }
  }
}

