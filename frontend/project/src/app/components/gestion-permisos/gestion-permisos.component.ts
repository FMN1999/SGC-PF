import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuarios/usuario.service';
import { ActivatedRoute } from '@angular/router';
import {NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-gestion-permisos',
    templateUrl: './gestion-permisos.component.html',
    styleUrls: ['./gestion-permisos.component.scss'],
    imports: [
        NgForOf,
        FormsModule
    ]
})
export class GestionPermisosComponent implements OnInit {
  idUsuario: number = 0;
  permisosUsuario: any[] = [];
  permisosDisponibles: any[] = [];
  nuevoPermisoId: number | null = null;

  constructor(
    private permisosService: UsuarioService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.idUsuario = +this.route.snapshot.paramMap.get('id')!;
    this.cargarPermisos();
  }

  cargarPermisos(): void {
    // Obtener permisos del usuario
    this.permisosService.getPermisosUsuario(this.idUsuario).subscribe({
      next: (data) => {
        this.permisosUsuario = data;
      },
      error: (error) => {
        console.error('Error al cargar los permisos del usuario:', error);
      },
    });

    // Obtener permisos disponibles
    this.permisosService.getPermisosDisponibles().subscribe({
      next: (data) => {
        this.permisosDisponibles = data;
      },
      error: (error) => {
        console.error('Error al cargar los permisos disponibles:', error);
      },
    });
  }

  agregarPermiso(): void {
    if (this.nuevoPermisoId) {
      this.permisosService
        .asignarPermiso(this.idUsuario, this.nuevoPermisoId)
        .subscribe({
          next: () => {
            this.cargarPermisos(); // Recargar permisos
            this.nuevoPermisoId = null; // Resetear selección
          },
          error: (error) => {
            console.error('Error al asignar permiso:', error);
          },
        });
    }
  }

  eliminarPermiso(idPermiso: number): void {
    this.permisosService.eliminarPermiso(this.idUsuario, idPermiso).subscribe({
      next: () => {
        this.cargarPermisos(); // Recargar permisos
      },
      error: (error) => {
        console.error('Error al eliminar permiso:', error);
      },
    });
  }
}
