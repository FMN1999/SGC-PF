import { Component, OnInit } from '@angular/core';
import { TareaService } from '../../services/tarea/tarea.service';
import { AuthService } from '../../services/auth/auth.service';
import { DataShareService } from '../../services/data-share/data-share.service';
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';
import { NgForOf, NgIf, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface Tarea {
  id: number;
  tarea: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  precio_total: number;
  porcentaje_avance: number;
  estado: string;
  area: string;
}

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  imports: [NgForOf, NgIf, CurrencyPipe, FormsModule, ReactiveFormsModule, HeaderComponent],
  standalone: true,
  styleUrls: ['./tareas.component.scss']
})
export class TareasComponent implements OnInit {
  tareas: Tarea[] = [];
  tareasFiltradas: Tarea[] = [];
  cargando = true;
  error = false;
  filtroBusqueda: string = '';
  filtroEstado: string = '';
  isLoggedIn:boolean=false;

  constructor(
    private tareaService: TareaService,
    private router: Router,
    private authService: AuthService,
    private dataShare: DataShareService
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
    if (!this.isLoggedIn) {
      this.router.navigate(['/no-permissions']);
    }
    this.cargarTareas();
  }

  cargarTareas(): void {
    this.cargando = true;
    // @ts-ignore
    const idEmpresa = +sessionStorage.getItem('id_empresa'); // Recuperar el id_empresa del sessionStorage

    if (!idEmpresa) {
      console.error('El ID de la empresa no está disponible en el sessionStorage.');
      this.error = true;
      this.cargando = false;
      return;
    }

    this.tareaService.obtenerTareasPorEmpresa(idEmpresa).subscribe({
      next: (response: Tarea[]) => {
        this.tareas = response;
        this.tareasFiltradas = this.tareas;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar tareas:', err);
        this.error = true;
        this.cargando = false;
      }
    });
  }

  verDetalleTarea(id: number): void {
    this.router.navigate([`/tarea/${id}`]);
  }

  aplicarFiltros(): void {
    this.tareasFiltradas = this.tareas.filter(tarea => {
      const coincideBusqueda =
        tarea.tarea?.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        tarea.descripcion?.toLowerCase().includes(this.filtroBusqueda.toLowerCase());

      const coincideEstado =
        this.filtroEstado === '' || tarea.estado === this.filtroEstado;

      return coincideBusqueda && coincideEstado;
    });
  }
}
