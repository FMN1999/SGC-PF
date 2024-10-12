import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { NgForOf, NgIf } from "@angular/common";
import { EmpresaService } from '../../services/empresa/empresa.service';

@Component({
  selector: 'app-crear-colaborador',
  templateUrl: './crear-colaborador.component.html',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    NgIf
  ],
  styleUrls: ['./crear-colaborador.component.scss']
})
export class CrearColaboradorComponent implements OnInit {
  colaboradorForm: FormGroup;
  mensajeError: string = '';
  protected empresas: any;

  constructor(
    private fb: FormBuilder,
    private colaboradorService: AuthService,
    private empresaService: EmpresaService,
    private router: Router
  ) {
    this.colaboradorForm = this.fb.group({
      // Datos del Usuario
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      usuario: ['', Validators.required],
      contrasenia: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      sexo: [''],
      celular: [''],
      telefono: [''],
      direccion: [''],

      // Datos del Colaborador
      puesto: ['', Validators.required],
      rol: ['', Validators.required],
      id_empresa: ['', Validators.required],
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

  onSubmit() {
    if (this.colaboradorForm.valid) {
      // Aquí organizamos los datos en las claves `usuario` y `colaborador`
      const datosColaborador = {
        usuario: {
          nombre: this.colaboradorForm.get('nombre')?.value,
          apellido: this.colaboradorForm.get('apellido')?.value,
          email: this.colaboradorForm.get('email')?.value,
          usuario: this.colaboradorForm.get('usuario')?.value,
          contrasenia: this.colaboradorForm.get('contrasenia')?.value,
          fecha_nacimiento: this.colaboradorForm.get('fecha_nacimiento')?.value,
          sexo: this.colaboradorForm.get('sexo')?.value,
          celular: this.colaboradorForm.get('celular')?.value,
          telefono: this.colaboradorForm.get('telefono')?.value,
          direccion: this.colaboradorForm.get('direccion')?.value,
        },
        colaborador: {
          puesto: this.colaboradorForm.get('puesto')?.value,
          rol: this.colaboradorForm.get('rol')?.value,
          id_empresa: this.colaboradorForm.get('id_empresa')?.value
        }
      };

      // Enviamos los datos organizados al servicio
      this.colaboradorService.crearColaborador(datosColaborador).subscribe({
        next: (response: any) => {
          // Si se crea exitosamente, redirigir o mostrar un mensaje
          this.router.navigate(['/']).then(r => {});  // Cambia la ruta si es necesario
        },
        error: (error: any) => {
          this.mensajeError = 'Ocurrió un error al registrar el colaborador';
        }
      });
    }
  }
}

