import { Component, OnInit } from '@angular/core';
import { TareaService } from '../../services/tarea/tarea.service';
import { Router } from '@angular/router';
import { NgForOf, NgIf, CurrencyPipe } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  imports: [NgForOf, NgIf, CurrencyPipe, HeaderComponent],
  standalone: true,
  styleUrls: ['./tareas.component.scss']
})
export class TareasComponent implements OnInit {
  tareas: any[] = [];
  cargando = true;
  error = false;

  constructor(
    private tareaService: TareaService,
    private router: Router
  ) {}

  ngOnInit(): void {
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
      next: (response) => {
        this.tareas = response;
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
}
