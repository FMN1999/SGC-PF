import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuarios/usuario.service';
import { AuthService } from '../../services/auth/auth.service';
import { DataShareService } from '../../services/data-share/data-share.service';
import { ActivatedRoute, Router } from '@angular/router';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {HeaderComponent} from '../header/header.component';

@Component({
  selector: 'app-gestion-permisos',
  templateUrl: './gestion-permisos.component.html',
  styleUrls: ['./gestion-permisos.component.scss'],
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    HeaderComponent,
    NgIf,
    NgClass
  ]
})
export class GestionPermisosComponent implements OnInit {
  idUsuario: number = 0;
  permisosUsuario: any[] = [];
  permisosDisponibles: any[] = [];
  nuevoPermisoId: number | null = null;
  // @ts-ignore
  mensaje: string;
  isLoggedIn: boolean= false;

  constructor(
    private permisosService: UsuarioService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private dataShare: DataShareService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    if (!this.isLoggedIn) {
      this.router.navigate(['/no-permissions']);
    }
        // @ts-ignore
    const id_user = +sessionStorage.getItem('id_usuario');
    this.authService.cargarPermisos(id_user);

    if (!this.dataShare.permiso10) {
      this.router.navigate(['/no-permissions']);
    }
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
            this.mensaje = 'Permiso agregado exitosamente.'; // Establecer el mensaje
            setTimeout(() => {
              this.mensaje = ''; // Limpiar el mensaje después de unos segundos
            }, 10000);
          },
          error: (error) => {
            console.error('Error al asignar permiso:', error);
            this.mensaje = 'Error al asignar el permiso.';
            setTimeout(() => {
              this.mensaje = '';
            }, 10000);
          },
        });
    }
  }


  eliminarPermiso(idPermiso: number): void {
    this.permisosService.eliminarPermiso(this.idUsuario, idPermiso).subscribe({
      next: () => {
        this.cargarPermisos(); // Recargar permisos
        this.mensaje = 'Permiso eliminado exitosamente.'; // Establecer el mensaje
        setTimeout(() => {
          this.mensaje = ''; // Limpiar el mensaje después de unos segundos
        }, 3000);
      },
      error: (error) => {
        console.error('Error al eliminar permiso:', error);
        this.mensaje = 'Error al eliminar el permiso.';
        setTimeout(() => {
          this.mensaje = '';
        }, 3000);
      },
    });
  }
}
