import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';  // Para hacer la petición HTTP
import { NgIf, NgFor } from '@angular/common';  // Para *ngIf y *ngFor
import { AuthService } from '../../services/auth/auth.service'; // Ajusta la ruta si es necesario
import { EmpresaService } from '../../services/empresa/empresa.service'; // Ajusta la ruta si es necesario

@Component({
  selector: 'app-register',
  standalone: true,  // Standalone component
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [ReactiveFormsModule, FormsModule, NgIf, NgFor]  // Importamos los módulos que necesitamos
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  empresas: any[] = [];  // Para almacenar la lista de empresas

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService,
              private empresaService: EmpresaService) {
    this.registerForm = this.fb.group({
      // Campos del usuario
      nombre_usuario: ['', Validators.required],
      password: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fecha_nacimiento: ['', Validators.required],
      celular: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      empresa: ['', Validators.required],  // Campo para la empresa seleccionada

      // Campos del cliente
      ciudad: ['', Validators.required],
      provincia: ['', Validators.required],
      cuit: ['', Validators.required],
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
    console.log('Formulario enviado');

    if (!this.registerForm.valid) {
      // Recorre cada control del formulario para ver cuál es inválido
      Object.keys(this.registerForm.controls).forEach(field => {
        const control = this.registerForm.get(field);
        if (control && !control.valid) {
          console.log(`Campo ${field} no es válido`);
          console.log(control.errors);  // Muestra los errores específicos del campo
        }
      });
    } else {
      const formData = this.registerForm.value;
      console.log(formData);

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
        id_empresa: formData.empresa,  // Usar el ID de la empresa seleccionada

        ciudad: formData.ciudad,
        provincia: formData.provincia,
        cuit: formData.cuit,
        monto_deuda: 0,  // Iniciamos con monto deuda 0
        moneda_deuda: null,  // Moneda deuda nula
        fecha_alta: new Date(),  // Fecha de hoy
        fecha_baja: null  // Fecha de baja nula
      };

      this.authService.register(userData).subscribe({
        next: (response: any) => {
          console.log('Registro exitoso', response);
        },
        error: (error: any) => {
          console.error('Error al registrar:', error);
        }
      });
    }
  }



}

