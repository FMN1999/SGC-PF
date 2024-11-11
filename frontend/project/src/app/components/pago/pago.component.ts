import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import { PagoService } from '../../services/pago/pago.service';
import {NgIf} from "@angular/common";

@Component({
  standalone: true,
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  styleUrls: ['./pago.component.scss']
})
export class PagoComponent implements OnInit {
  pagoForm: FormGroup;
  tipoPagoSeleccionado: string = '';

  constructor(
    private fb: FormBuilder,
    private pagoService: PagoService
  ) {
    this.pagoForm = this.fb.group({
      tipo_pago: ['', Validators.required],
      monto: [null, [Validators.required, Validators.min(0)]],
      moneda: ['', Validators.required],
      cuota: [null, Validators.required],
      fecha_pago: [null, Validators.required],
      id_proveedor: [null, Validators.required],
      id_compra: [null],
      id_subcontratacion: [null]
    });
  }

ngOnInit(): void {
  // Obtener los datos almacenados en el servicio
  const datosPago = this.pagoService.getDatosPago();
  if (datosPago) {
    this.pagoForm.patchValue(datosPago);
    this.tipoPagoSeleccionado = datosPago.tipo_pago;
    this.actualizarValidaciones();
  }

  // Actualizar validaciones según el cambio de tipo de pago
  this.pagoForm.get('tipo_pago')?.valueChanges.subscribe((tipoPago) => {
    this.tipoPagoSeleccionado = tipoPago;
    this.actualizarValidaciones();
  });
}

  actualizarValidaciones(): void {
    // Hacer id_compra e id_subcontratacion opcionales y actualizarlos según el tipo de pago seleccionado
    const idCompraControl = this.pagoForm.get('id_compra');
    const idSubcontratacionControl = this.pagoForm.get('id_subcontratacion');

    idCompraControl?.clearValidators();
    idSubcontratacionControl?.clearValidators();

    if (this.tipoPagoSeleccionado === 'compra') {
      idCompraControl?.setValidators(Validators.required);
    } else if (this.tipoPagoSeleccionado === 'subcontratacion') {
      idSubcontratacionControl?.setValidators(Validators.required);
    }

    idCompraControl?.updateValueAndValidity();
    idSubcontratacionControl?.updateValueAndValidity();
  }

  registrarPago(): void {
    if (this.pagoForm.invalid) {
      console.log('Formulario inválido');
      return;
    }

    const pagoData = this.pagoForm.value;
    this.pagoService.registrarPago(pagoData).subscribe({
      next: (response) => {
        console.log('Pago registrado:', response);
      },
      error: (error) => {
        console.error('Error al registrar el pago:', error);
      }
    });
  }
}

