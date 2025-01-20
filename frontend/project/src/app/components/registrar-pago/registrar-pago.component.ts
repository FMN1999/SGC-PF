import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router} from '@angular/router';
import {NgForOf, NgIf} from "@angular/common";
import{ PagoService } from '../../services/pago/pago.service';
import{ AuthService } from '../../services/auth/auth.service';
import{ DataShareService } from '../../services/data-share/data-share.service';
import{ EmpresaService } from '../../services/empresa/empresa.service';
import { HeaderComponent } from '../header/header.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-registrar-pago',
  templateUrl: './registrar-pago.component.html',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    HeaderComponent
  ],
  standalone: true,
  styleUrls: ['./registrar-pago.component.scss']
})
export class RegistrarPagoComponent implements OnInit {
  pagoForm!: FormGroup;
  clientes: any;
  obras: any;
  obras2: any;
  // @ts-ignore
  id_empresa: number;
  mensajeSuccess: string = '';
  mensajeError: string = '';
  isLoggedIn: boolean = false;

  constructor(private fb: FormBuilder,
              private pagoService: PagoService,
              private empresaService: EmpresaService,
              private authService: AuthService,
              private dataShare: DataShareService,
              private router: Router,
              private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Registrar pago de Cliente');
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    if (!this.isLoggedIn) {
      this.router.navigate(['/no-permissions']);
    }

    // @ts-ignore
    const id_user = +sessionStorage.getItem('id_usuario');
    this.authService.cargarPermisos(id_user);

    if (!this.dataShare.permiso14) {
      this.router.navigate(['/no-permissions']);
    }

    // @ts-ignore
    this.id_empresa = +sessionStorage.getItem('id_empresa');

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

    // Filtrar obras cuando cambia el cliente
    this.pagoForm.get('id_cliente')?.valueChanges.subscribe((clienteId) => {
      if (clienteId) {
        this.filtrarObrasPorCliente(clienteId);
      } else {
        this.obras = []; // Limpia las obras si no hay cliente seleccionado
      }
    });
  }

  cargarClientesYObras(): void {
    this.empresaService.obtenerClientes(this.id_empresa).subscribe({
      next: (data) => (this.clientes = data),
      error: (err) => console.error('Error al cargar clientes', err)
    });

    this.empresaService.obtenerObrasPorEmpresa(this.id_empresa).subscribe({
      next: (data) => {this.obras = data.obras; this.obras2=data.obras;}, // Carga todas las obras inicialmente
      error: (err) => console.error('Error al cargar obras', err)
    });
  }


  /**
   * Registrar el pago
   */
  submitPago(): void {
    const clienteId = this.pagoForm.get('id_cliente')?.value;
    const obraId = this.pagoForm.get('id_obra')?.value;

    // Validar si la obra pertenece al cliente seleccionado
    const obraSeleccionada = this.obras.find((obra: any) => obra.id === Number(obraId));

    if (obraSeleccionada.id_cliente !== Number(clienteId)) {
      this.mensajeError = 'La obra seleccionada no pertenece al cliente seleccionado.';
      this.mensajeSuccess = '';
      return;
    }

    if (this.pagoForm.valid) {
      const pagoData = this.pagoForm.value;

      this.pagoService.registrarCobro(pagoData).subscribe({
        next: (response) => {
          this.mensajeSuccess = 'Pago registrado correctamente.';
          this.mensajeError = ''; // Limpia el mensaje de error
          this.pagoForm.reset();
        },
        error: (err) => {
          this.mensajeError = 'Ocurrió un error durante el registro. Intenta nuevamente.';
          this.mensajeSuccess = ''; // Limpia el mensaje de éxito
        }
      });
    } else {
      this.mensajeError = 'Por favor complete todos los datos obligatorios.';
      this.mensajeSuccess = ''; // Limpia el mensaje de éxito
    }
  }


  filtrarObrasPorCliente(clienteId: number): void {
    this.empresaService.obtenerObrasPorEmpresa(this.id_empresa).subscribe({
      next: (data) => {
        console.log('Cliente seleccionado:', clienteId);
        console.log('Obras devueltas por el backend:', data.obras);

        // Filtro para obtener solo las obras del cliente seleccionado
        this.obras = data.obras.filter((obra: any) => {
          console.log(`Obra: ${obra.id}, Cliente ID en obra: ${obra.id_cliente}, Coincide: ${obra.id_cliente === clienteId}`);
          return obra.id_cliente === Number(clienteId);
        });

        console.log('Obras filtradas:', this.obras);
      },
      error: (err) => {
        console.error('Error al cargar obras', err);
        this.obras = []; // Limpia las obras si hay un error
      }
    });
  }


}
