import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../../services/perfil/perfil.service';
import {NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';  // Importar FormBuilder y FormGroup


@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.component.html',
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  perfil: any;
  usuarioActualId: string | null = sessionStorage.getItem('id_user');
  editMode: boolean = false;  // Variable para manejar el modo edición
  perfilForm: FormGroup;  // Formulario Reactivo

  constructor(private perfilService: PerfilService, private fb: FormBuilder ) {
    this.perfilForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fecha_nacimiento: ['', Validators.required],
      sexo: [''],
      puesto: [''],
      rol: [''],
      ciudad: [''],
      provincia: [''],
      cuit: ['', [Validators.pattern('[0-9]{11}')]], // Ejemplo de CUIT de 11 dígitos
      deuda: ['']
    });
  }

  ngOnInit(): void {
    const userId = this.usuarioActualId;
    if (userId) {
      this.perfilService.obtenerPerfil(parseInt(userId)).subscribe((data: any) => {
        this.perfil = data;
        // Poner los datos del perfil en el formulario
        this.perfilForm.patchValue({
          nombre: this.perfil.nombre,
          apellido: this.perfil.apellido,
          email: this.perfil.email,
          fecha_nacimiento: this.perfil.fecha_nacimiento,
          sexo: this.perfil.sexo,
          puesto: this.perfil.puesto,
          rol: this.perfil.rol,
          ciudad: this.perfil.ciudad,
          provincia: this.perfil.provincia,
          cuit: this.perfil.cuit,
          deuda: this.perfil.deuda,
        });
      });
    }
  }

  esUsuarioActual(): boolean {
    let b = 0
    if (typeof this.usuarioActualId === "string") {
      b = parseInt(this.usuarioActualId)
    }
    return b === this.perfil.id;
  }

  // Cambiar al modo de edición
  activarEdicion(): void {
    this.editMode = true;
  }

  // Cancelar edición
  cancelarEdicion(): void {
    this.editMode = false;
  }

  // Guardar los cambios
  guardarCambios(): void {
    if (this.perfilForm.valid) {
      const perfilActualizado = this.perfilForm.value;
      const userId = this.usuarioActualId;

      if (typeof userId === "string") {
        this.perfilService.actualizarPerfil(parseInt(userId), perfilActualizado).subscribe((response: any) => {
          // Actualiza el perfil con los nuevos datos
          this.perfil = response;
          this.editMode = false;  // Salir del modo de edición
        });
      }
    }
  }
}

