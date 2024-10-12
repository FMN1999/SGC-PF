import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import {NgForOf} from "@angular/common";
import { EmpresaServie } from '../../services/empresa/empresa.service';

@Component({
  selector: 'app-crear-colaborador',
  templateUrl: './crear-colaborador.component.html',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule
  ],
  styleUrls: ['./crear-colaborador.component.scss']
})
export class CrearColaboradorComponent implements OnInit {
  colaboradorForm: FormGroup;
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private colaboradorService: AuthService,
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
      empresa_id: ['', Validators.required],
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
      const datosColaborador = this.colaboradorForm.value;

      this.colaboradorService.crearColaborador(datosColaborador).subscribe({
        next: (response: any) => {
          // Si se crea exitosamente, redirigir o mostrar un mensaje
          this.router.navigate(['/lista-usuario']).then(r => );  // Cambia la ruta si es necesario
        },
        error: (error:any) => {
          this.mensajeError = 'Ocurrió un error al registrar el colaborador';
        }
      });
    }
  }
}

