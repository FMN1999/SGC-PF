import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { EmpresaService } from '../../services/empresa/empresa.service';
import { AuthService } from '../../services/auth/auth.service';
import { DataShareService } from '../../services/data-share/data-share.service';
import { ProveedorService } from '../../services/proveedor/proveedor.service';
import { HeaderComponent } from '../header/header.component'

@Component({
  standalone: true,
  selector: 'app-crear-proveedor',
  templateUrl: './crear-proveedor.component.html',
  imports: [ReactiveFormsModule, NgForOf, NgIf, HeaderComponent],
  styleUrls: ['./crear-proveedor.component.scss']
})
export class CrearProveedorComponent implements OnInit {
  proveedorForm: FormGroup;
  mensajeError: string = '';
  protected empresas: any;
  isLoggedIn: boolean = false;

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    private empresaService: EmpresaService,
    private router: Router,
    private authService: AuthService,
    private dataShare: DataShareService
  ) {
    // Recuperar el id_empresa del sessionStorage
    const idEmpresa = sessionStorage.getItem('id_empresa');

    // Inicializar el formulario, asignando id_empresa desde sessionStorage
    this.proveedorForm = this.fb.group({
      denominacion: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cuil: ['', Validators.required],
      ciudad: ['', Validators.required],
      provincia: ['', Validators.required],
      id_empresa: [idEmpresa, Validators.required] // Asignar el valor de id_empresa desde sessionStorage
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

    if (!this.dataShare.permiso7) {
      this.router.navigate(['/no-permissions']);
    }

    this.empresaService.obtenerEmpresas().subscribe({
      next: (response: any) => {
        this.empresas = response;
      },
      error: (error: any) => {
        console.error('Error al obtener las empresas:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.proveedorForm.valid) {
      const datosProveedor = {
        proveedor: this.proveedorForm.value
      };

      this.proveedorService.crearProveedor(datosProveedor).subscribe({
        next: (response: any) => {
          // Redirigir o mostrar un mensaje
          this.router.navigate(['/']).then(() => {});
        },
        error: (error: any) => {
          this.mensajeError = 'Ocurrió un error al registrar el proveedor';
        }
      });
    }
  }
}

