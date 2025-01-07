import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';  // Para *ngIf y *ngFor
import { AuthService } from '../../services/auth/auth.service'; // Ajusta la ruta si es necesario
import { EmpresaService } from '../../services/empresa/empresa.service';
import {Router} from "@angular/router"; // Ajusta la ruta si es necesario


@Component({
  selector: 'app-register', // Standalone component
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf, NgFor] // Importamos los módulos que necesitamos
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  empresas: any[] = [];  // Para almacenar la lista de empresas
  mensajeSuccess: string = '';
  mensajeError: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService,
              private empresaService: EmpresaService, private router: Router) {
    this.registerForm = this.fb.group({
      // Campos del usuario
      nombre_usuario: ['', Validators.required],
      password: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fecha_nacimiento: [''],
      celular: [''],
      telefono: [''],
      direccion: [''],
      empresa: ['', Validators.required],  // Campo para la empresa seleccionada

      // Campos del cliente
      ciudad: [''],
      provincia: [''],
      cuit: [''],
    });
  }

  ngOnInit() {
    // Utilizar el servicio para obtener la lista de empresas
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
    if (!this.registerForm.valid) {
      this.mensajeError = 'Por favor, completa todos los campos requeridos correctamente.';
      this.mensajeSuccess = ''; // Limpia el mensaje de éxito
      return;
    }

    const formData = this.registerForm.value;

    const userData = {
      nombre_usuario: formData.nombre_usuario,
      password: formData.password,
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      fecha_nacimiento: formData.fecha_nacimiento,
      celular: formData.celular,
      telefono: formData.telefono,
      direccion: formData.direccion,
      id_empresa: formData.empresa, // Usar el ID de la empresa seleccionada

      ciudad: formData.ciudad,
      provincia: formData.provincia,
      cuit: formData.cuit,
      monto_deuda: 0, // Iniciamos con monto deuda 0
      moneda_deuda: null, // Moneda deuda nula
      fecha_alta: new Date(), // Fecha de hoy
      fecha_baja: null // Fecha de baja nula
    };

    this.authService.register(userData).subscribe({
      next: (response: any) => {
        this.mensajeSuccess = '¡Cliente registrado exitosamente en la empresa!';
        this.mensajeError = ''; // Limpia el mensaje de error
        this.registerForm.reset(); // Reinicia el formulario tras el registro exitoso
        this.router.navigate(['/login']);
      },
      error: (error: any) => {
        this.mensajeError = error.error?.error || 'Ocurrió un error durante el registro. Intenta nuevamente.';
        this.mensajeSuccess = ''; // Limpia el mensaje de éxito
      }
    });
  }

}

