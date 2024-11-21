import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {NgForOf, NgIf} from "@angular/common";
import{ PagoService } from '../../services/pago/pago.service';
import{ EmpresaService } from '../../services/empresa/empresa.service';

@Component({
  selector: 'app-registrar-pago',
  standalone: true,
  templateUrl: './registrar-pago.component.html',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./registrar-pago.component.scss']
})
export class RegistrarPagoComponent implements OnInit {
  pagoForm!: FormGroup;
  clientes: any;
  obras: any;
  // @ts-ignore
  id_empresa: number;

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private pagoService: PagoService,
              private empresaService: EmpresaService
  ) {}

  ngOnInit(): void {
    // @ts-ignore
    this.id_empresa = +sessionStorage.getItem('id_empresa')
    this.pagoForm = this.fb.group({
      id_cliente: [null, Validators.required],
      id_obra: [null],
      monto: [0, [Validators.required, Validators.min(1)]],
      moneda: ['ARS', Validators.required],
      fecha_pago: [null],
      realizado: [false],
      fecha_limite: [null],
      cantidad_recargo: [0],
      unidad_recargo: ['porcentaje']
    });

    this.cargarClientesYObras();
  }

  cargarClientesYObras(): void {
    this.empresaService.obtenerClientes(this.id_empresa).subscribe({
      next: (data) => (this.clientes = data),
      error: (err) => console.error('Error al cargar clientes', err)
    });

    this.empresaService.obtenerObrasPorEmpresa(this.id_empresa).subscribe({
      next: (data) => (this.obras = data.obras),
      error: (err) => console.error('Error al cargar obras', err)
    });

    console.log(this.obras);
  }

  /**
   * Registrar el pago
   */
  submitPago(): void {
    if (this.pagoForm.valid) {
      const pagoData = this.pagoForm.value;

      this.pagoService.registrarCobro(pagoData).subscribe({
        next: (response) => {
          console.log('Pago registrado:', response);
          alert('Pago registrado exitosamente');
          this.pagoForm.reset();
        },
        error: (err) => {
          console.error('Error al registrar pago', err);
          alert('Ocurrió un error al registrar el pago');
        }
      });
    } else {
      alert('Por favor, complete todos los campos obligatorios');
    }
  }

}
