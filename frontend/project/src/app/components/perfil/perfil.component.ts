import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../../services/perfil/perfil.service';
import {NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';  // Importar ActivatedRoute

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
  editMode: boolean = false;
  perfilForm: FormGroup;
  perfilIdUrl: string | null = '';  // Guardar el ID de la URL

  constructor(
    private perfilService: PerfilService,
    private fb: FormBuilder,
    private route: ActivatedRoute  // Inyectar ActivatedRoute
  ) {
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
      cuit: ['', [Validators.pattern('[0-9]{11}')]],
      deuda: ['']
    });
  }

  ngOnInit(): void {
    this.perfilIdUrl = this.route.snapshot.paramMap.get('id');  // Obtener el ID de la URL
    if (this.perfilIdUrl) {
      this.perfilService.obtenerPerfil(parseInt(this.perfilIdUrl)).subscribe((data: any) => {
        this.perfil = data;
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
    return this.perfilIdUrl === this.usuarioActualId;  // Comparar el ID de la URL con el de sessionStorage
  }

  activarEdicion(): void {
    this.editMode = true;
  }

  cancelarEdicion(): void {
    this.editMode = false;
  }

  guardarCambios(): void {
    if (this.perfilForm.valid) {
      const perfilActualizado = this.perfilForm.value;
      const userId = this.perfilIdUrl;

      if (userId) {
        this.perfilService.actualizarPerfil(parseInt(userId), perfilActualizado).subscribe((response: any) => {
          this.perfil = response;
          this.editMode = false;
        });
      }
    }
  }
}

