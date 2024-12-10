import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { NgForOf, NgIf } from "@angular/common";
import { HeaderComponent } from '../header/header.component'

@Component({
  selector: 'app-crear-colaborador',
  standalone:true,
  templateUrl: './crear-colaborador.component.html',
  imports: [
    NgForOf,
    ReactiveFormsModule,
    NgIf,
    HeaderComponent
  ],
  styleUrls: ['./crear-colaborador.component.scss']
})
export class CrearColaboradorComponent implements OnInit {
  colaboradorForm: FormGroup;
  mensajeError: string = '';
  mensajeSuccess: string = '';

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
      fecha_nacimiento: [''],
      sexo: [''],
      celular: [''],
      telefono: [''],
      direccion: [''],

      // Datos del Colaborador
      puesto: ['', Validators.required],
      rol: ['', Validators.required],
      id_empresa: [''],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.colaboradorForm.valid) {
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
          id_empresa: sessionStorage.getItem('id_empresa')
        }
      };

      this.colaboradorService.crearColaborador(datosColaborador).subscribe({
        next: (response: any) => {
          this.mensajeSuccess = 'Colaborador creado exitosamente.';
        },
        error: (error: any) => {
          this.mensajeError = error.error.message || 'Ocurrió un error al registrar el colaborador';
        }
      });
    }
  }
}

