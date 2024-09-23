import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';  // Para *ngIf
import { NgFor } from '@angular/common';  // Para *ngFor

@Component({
  selector: 'app-register',
  standalone: true,  // Standalone component
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [ReactiveFormsModule, FormsModule, NgIf, NgFor]  // Importamos los módulos que necesitamos
})
export class RegisterComponent {
  registerForm: FormGroup;
  isColaborador: boolean = false;
  showLegajo: boolean = false;

  constructor(private fb: FormBuilder) {
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
      tipo_usuario: ['', Validators.required],
      tipo_colaborador: [''],
      fecha_alta: [''],
      fecha_baja: [''],
      legajo: ['']
    });
  }

  onUserTypeChange() {
    const tipoUsuario = this.registerForm.get('tipo_usuario')?.value;
    this.isColaborador = tipoUsuario === 'Colaborador';

    if (!this.isColaborador) {
      this.registerForm.get('tipo_colaborador')?.reset();
      this.registerForm.get('fecha_alta')?.reset();
      this.registerForm.get('fecha_baja')?.reset();
      this.registerForm.get('legajo')?.reset();
      this.showLegajo = false;
    }
  }

  onColaboradorTypeChange() {
    const tipoColaborador = this.registerForm.get('tipo_colaborador')?.value;
    this.showLegajo = ['Arquitecto', 'Ingeniero', 'Obrero', 'RespCompras'].includes(tipoColaborador);
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      // Lógica de registro
    }
  }
}

