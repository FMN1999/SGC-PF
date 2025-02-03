import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { DataShareService } from '../../services/data-share/data-share.service';
import { Router } from '@angular/router';
import { NgForOf, NgIf } from "@angular/common";
import { HeaderComponent } from '../header/header.component'
import { Title } from '@angular/platform-browser';

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
  isLoggedIn: boolean = false;

  constructor(
    private fb: FormBuilder,
    private colaboradorService: AuthService,
    private router: Router,
    private dataShare: DataShareService,
    private titleService: Title
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

  ngOnInit(): void {
    this.titleService.setTitle('Crear Colaborador'); // Ajusta el nombre dinámicamente
    this.colaboradorService.isLoggedIn().subscribe(isLoggedIn => {
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
    this.colaboradorService.cargarPermisos(id_user).subscribe(() => {
      if (!this.dataShare.permiso8) {
        this.router.navigate(['/no-permissions']);
      }
    });
  }

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

