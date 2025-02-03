import { Component, OnInit } from '@angular/core';
import { TareaService } from '../../services/tarea/tarea.service';
import { AuthService } from '../../services/auth/auth.service';
import { DataShareService } from '../../services/data-share/data-share.service';
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';
import { NgForOf, NgIf, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { transliterate } from 'transliteration'; // Para eliminar los acentos

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
  id_usuario:number;
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
    private dataShare: DataShareService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Tareas');
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    if (!this.isLoggedIn) {
      this.router.navigate(['/no-permissions']);
      return;
    }

    // Recuperar datos del usuario
    // @ts-ignore
    const id_user = +sessionStorage.getItem('id_usuario');
    this.authService.cargarPermisos(id_user);
    // @ts-ignore
    const tipo_usuario = sessionStorage.getItem('tipo');

    this.cargarTareas(tipo_usuario, id_user); // Pasamos tipo_usuario e id_user
  }

  cargarTareas(tipo_usuario: string | null, id_user: number): void {
    this.cargando = true;

    // @ts-ignore
    const idEmpresa = +sessionStorage.getItem('id_empresa'); // Recuperar el id_empresa del sessionStorage

    if (!idEmpresa) {
      this.error = true;
      this.cargando = false;
      return;
    }

    this.tareaService.obtenerTareasPorEmpresa(idEmpresa).subscribe({
      next: (response: Tarea[]) => {
        this.tareas = response;

        // Filtrar tareas si el usuario es de tipo cliente
        if (tipo_usuario === 'CL') {
          this.tareas = this.tareas.filter(tarea => tarea.id_usuario === id_user);
        }

        this.tareasFiltradas = this.tareas; // Inicializamos con todas las tareas
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
    const busqueda = transliterate(this.filtroBusqueda).toLowerCase().trim();
    this.tareasFiltradas = this.tareas.filter(tarea => {
      const nombreTarea = transliterate(tarea.tarea ? tarea.tarea : '').toLowerCase();
      const descripcion = transliterate(tarea.descripcion ? tarea.descripcion : '').toLowerCase();
      const coincideBusqueda = nombreTarea.includes(busqueda) || descripcion.includes(busqueda);

      const coincideEstado =
        this.filtroEstado === '' || tarea.estado === this.filtroEstado;

      return coincideBusqueda && coincideEstado;
    });
  }
}
