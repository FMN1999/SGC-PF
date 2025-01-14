import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import { PagoService } from '../../services/pago/pago.service';
import { UsuarioService } from '../../services/usuarios/usuario.service';
import { AuthService } from '../../services/auth/auth.service';
import { DataShareService } from '../../services/data-share/data-share.service';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {HeaderComponent} from '../header/header.component';
import {Router} from '@angular/router';


@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  imports: [
    ReactiveFormsModule,
    NgIf,
    HeaderComponent,
    NgForOf,
    DatePipe
  ],
  standalone: true,
  styleUrls: ['./pago.component.scss']
})
export class PagoComponent implements OnInit {
  pagoForm: FormGroup;
  tipoPagoSeleccionado: string = '';
  comprasPendientes: any[] = [];
  proveedores: any;
  subcontrataciones: any[] = []; // Lista de subcontrataciones válidas
  mensajeError: string = '';
  mensajeSuccess: string = '';
  isLoggedIn: boolean = false;


  constructor(
    private fb: FormBuilder,
    private pagoService: PagoService,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private dataShare: DataShareService,
    private router: Router
  ) {
    this.pagoForm = this.fb.group({
      tipo_pago: ['', Validators.required],
      monto: [null, [Validators.required, Validators.min(0)]],
      moneda: ['ARS', Validators.required],
      cuota: [null, Validators.required],
      fecha_pago: [null, Validators.required],
      id_proveedor: [null, Validators.required],
      id_compra: [0],
      id_subcontratacion: [0]
    });
  }

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    if (!this.isLoggedIn) {
      this.router.navigate(['/no-permissions']);
    }

    // @ts-ignore
    const id_user = +sessionStorage.getItem('id_usuario');
    this.authService.cargarPermisos(id_user);

    if (!this.dataShare.permiso13) {
      this.router.navigate(['/no-permissions']);
    }

      // @ts-ignore
    const idEmpresa = +sessionStorage.getItem('id_empresa');
        // Cargar proveedores
    this.usuarioService.obtenerUsuariosPorEmpresa(idEmpresa).subscribe({
      next: (data: { proveedores: any; }) => {
        this.proveedores = data.proveedores;
      },
      error: (err: any) => console.error('Error al cargar proveedores:', err)
    });

    this.pagoService.getComprasPendientes(idEmpresa).subscribe({
      next: (data) => {
        this.comprasPendientes = data.compras;
      },
      error: (err) => console.error('Error al cargar compras pendientes:', err)
    });

    this.pagoService.getSubcontrataciones(idEmpresa).subscribe({
      next: (data) => {
        this.subcontrataciones = data.subcontrataciones;
      },
      error: (err) => console.error('Error al cargar subcontrataciones:', err)
    });

    // Obtener los datos almacenados en el servicio
    const datosPago = this.pagoService.getDatosPago();
    if (datosPago) {
      this.pagoForm.patchValue(datosPago);
      this.tipoPagoSeleccionado = datosPago.tipo_pago;
      if (datosPago.id_proveedor) {
        this.pagoForm.get('id_proveedor')?.setValue(datosPago.id_proveedor);
      }
      this.actualizarValidaciones();
    }

    this.pagoForm.get('id_compra')?.valueChanges.subscribe((idCompra) => {
      this.actualizarMonto(idCompra);
    });

    this.pagoForm.get('id_subcontratacion')?.valueChanges.subscribe((idSubcontratacion) => {
      this.actualizarMontoSubcontratacion(idSubcontratacion);
    });

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
    const monto = Number(this.pagoForm.get('monto')?.value); // Aseguramos que sea un número

    if (monto === 0) {
      this.mensajeError = 'No se puede registrar un pago con monto igual a 0';
      this.mensajeSuccess = ''; // Limpia mensajes de éxito previos
      return; // Detiene la ejecución
    }

    const pagoData = this.pagoForm.value;
    this.pagoService.registrarPago(pagoData).subscribe({
      next: (response) => {
        this.pagoForm.reset();
        this.tipoPagoSeleccionado = '';
        this.mensajeSuccess = 'El pago se registró correctamente.';
        this.mensajeError = ''; // Limpia errores previos
      },
      error: (error) => {
        this.mensajeError = 'Ocurrió un error al registrar el pago. Intenta nuevamente.';
        this.mensajeSuccess = ''; // Limpia mensajes de éxito previos
      }
    });
    //window.location.reload();
  }


  actualizarMonto(idCompra: number): void {

    if (idCompra) {
      const compraSeleccionada = this.comprasPendientes.find(compra => compra.id === +idCompra); // Asegúrate de la conversión de tipo

      if (compraSeleccionada) {
        this.pagoForm.get('monto')?.setValue(compraSeleccionada.monto_pendiente || 0);
        this.pagoForm.get('id_proveedor')?.setValue(compraSeleccionada.id_proveedor || 0);
      } else {
        console.warn(`No se encontró una compra con id ${idCompra}`);
      }
    } else {
      this.pagoForm.get('monto')?.setValue(0);
    }
  }

  actualizarMontoSubcontratacion(idSubcontratacion: number): void {
    const subcontratacionSeleccionada = this.subcontrataciones.find(sub => sub.id === +idSubcontratacion);
    if (subcontratacionSeleccionada) {
      this.pagoForm.get('monto')?.setValue(subcontratacionSeleccionada.monto_contratacion);
      this.pagoForm.get('id_proveedor')?.setValue(subcontratacionSeleccionada.id_proveedor);
    } else {
      this.pagoForm.get('monto')?.setValue(0);
    }
  }

}

