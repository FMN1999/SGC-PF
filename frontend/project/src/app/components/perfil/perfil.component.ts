import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../../services/perfil/perfil.service';
import {NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TareaService} from "../../services/tarea/tarea.service";  // Importar ActivatedRoute
import {DataShareService} from "../../services/data-share/data-share.service";  // Importar ActivatedRoute
import {AuthService} from "../../services/auth/auth.service";  // Importar ActivatedRoute
import {HeaderComponent} from '../header/header.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    RouterLink,
    FormsModule,
    HeaderComponent
  ],
  standalone: true,
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  perfil: any;
  usuarioActualId: string | null = sessionStorage.getItem('id_usuario');
  editMode: boolean = false;
  perfilForm: FormGroup;
  perfilIdUrl: string = '';  // Guardar el ID de la URL
  obras: any = null;
  tareas: any[] = [];
  editTareas: boolean[] = [];

  constructor(
    private perfilService: PerfilService,
    private authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute,  // Inyectar ActivatedRoute
    private tareaService: TareaService,
    private router: Router,
    protected dataShare: DataShareService
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
    // @ts-ignore
    this.perfilIdUrl = this.route.snapshot.paramMap.get('id');
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
      // @ts-ignore
      const id_user = +sessionStorage.getItem('id_usuario');
      this.authService.cargarPermisos(id_user);

      this.perfilService.tareasPorUsuario(parseInt(this.perfilIdUrl)).subscribe((data: any)=>{
        this.tareas = data;
      });
      this.perfilService.obrasPorUsuario(parseInt(this.perfilIdUrl)).subscribe((data: any)=>{
        this.obras = data;
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

  activarEdicionTarea(index: number): void {
    this.editTareas[index] = true;
  }

  cancelarEdicionTarea(index: number): void {
    this.editTareas[index] = false;
  }

  guardarCambiosTarea(index: number, tarea: any): void {

    this.tareaService
      // @ts-ignore
      .actualizarCantDias(this.perfilIdUrl, tarea.cant_dias, tarea.id)
      .subscribe({
        next: () => {
          this.editTareas[index] = false;
          console.log('Cantidad de días actualizada correctamente');
        },
        error: (err) => console.error('Error al actualizar cantidad de días', err)
      });
  }

  gestionarPermisos(idUsuario: number): void {
    this.router.navigate([`/usuario/${idUsuario}/permisos`]);
  }
}

