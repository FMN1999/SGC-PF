import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ProveedorService } from '../../services/proveedor/proveedor.service';
import { AuthService } from '../../services/auth/auth.service';
import { DataShareService } from '../../services/data-share/data-share.service';
import { HeaderComponent } from '../header/header.component';
import {NgIf} from "@angular/common";
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-crear-servicio',
  templateUrl: './crear-servicio.component.html',
  standalone: true,
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    NgIf
  ],
  styleUrls: ['./crear-servicio.component.scss']
})
export class CrearServicioComponent implements OnInit {

  id_proveedor: number | undefined;  // Para almacenar el ID del proveedor
  mensajeExito: string = '';  // Mensaje de éxito
  mensajeError: string = '';  // Mensaje de error
  servicioForm: FormGroup;
  isLoggedIn: boolean = false;

  constructor(
    private proveedorService: ProveedorService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,  // Inyectamos FormBuilder
    private authService: AuthService,
    private dataShare: DataShareService,
    private titleService: Title
  ) {
    // Inicializamos el FormGroup
    this.servicioForm = this.fb.group({
      descripcion: ['', Validators.required],
      precio_x_unidad: [0, Validators.required],
      unidad_medida: ['', Validators.required],
      monto_x_frecuencia: [0],
      frecuencia_pago: [''],
      moneda: [''],
      impuestos_total: [0],
      moneda_impuestos: [''],
      descripcion_impuestos: [''],
      otros_gastos: [0],
      moneda_otros_gastos: [''],
      descripcion_otros_gastos: ['']
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Crear Servicio');
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (!this.isLoggedIn) {
        this.router.navigate(['/no-permissions']);
      }
      this.initLogueado();
    });
  }

  initLogueado(): void {
    // @ts-ignore
    const id_user = +sessionStorage.getItem('id_usuario');
    this.authService.cargarPermisos(id_user).subscribe(() => {
      if (!this.dataShare.permiso6) {
        this.router.navigate(['/no-permissions']);
      }
    });

    // Obtenemos el ID del proveedor desde la ruta
    this.id_proveedor = +this.route.snapshot.params['id'];
  }

  crearServicio(): void {
    if (this.servicioForm.valid) {
      // Agregamos el id_proveedor al objeto del formulario
      const data = { ...this.servicioForm.value, id_proveedor: this.id_proveedor };

      // Llamamos al servicio que interactúa con el backend
      this.proveedorService.crearServicio(data).subscribe({
        next: (response) => {
          this.mensajeExito = 'Servicio creado con éxito';
        },
        error: (error) => {
          this.mensajeError = 'Error al crear el servicio';
        }
      });
    } else {
      this.mensajeError = 'Por favor, complete todos los campos requeridos.';
    }
  }
}

