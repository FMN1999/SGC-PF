import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';  // Para hacer la petición HTTP
import { NgIf, NgFor } from '@angular/common';  // Para *ngIf y *ngFor

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

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group({
      nombre_usuario: ['', Validators.required],
      password: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fecha_nacimiento: ['', Validators.required],
      celular: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      empresa: ['', Validators.required]  // Campo para la empresa seleccionada
    });
  }

  ngOnInit() {
    // Hacer la petición al backend para obtener la lista de empresas
    this.http.get('http://localhost:8000/api/empresas').subscribe({
      next: (response: any) => {
        this.empresas = response;
      },
      error: (error) => {
        console.error('Error al obtener las empresas:', error);
      }
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      console.log(formData); 
    }
  }
}

