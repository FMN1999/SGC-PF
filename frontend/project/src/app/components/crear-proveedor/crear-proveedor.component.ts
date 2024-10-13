import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { EmpresaService } from '../../services/empresa/empresa.service';
import { ProveedorService } from '../../services/proveedor/proveedor.service';

@Component({
  selector: 'app-crear-proveedor',
  templateUrl: './crear-proveedor.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgForOf, NgIf],
  styleUrls: ['./crear-proveedor.component.scss']
})
export class CrearProveedorComponent implements OnInit {
  proveedorForm: FormGroup;
  mensajeError: string = '';
  protected empresas: any;

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    private empresaService: EmpresaService,
    private router: Router
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

