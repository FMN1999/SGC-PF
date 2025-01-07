import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../services/empresa/empresa.service';
import { Router } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    HeaderComponent
  ],
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent implements OnInit {
  servicios: any[] = [];
  serviciosFiltrados: any[] = [];
  filtroBusqueda: string = '';

  constructor(private empresaService: EmpresaService, private router: Router) {}

  ngOnInit(): void {
    const idEmpresa = sessionStorage.getItem('id_empresa');
    if (idEmpresa) {
      this.empresaService.obtenerServiciosPorEmpresa(parseInt(idEmpresa)).subscribe({
        next: (data) => {
          this.servicios = data;
          this.serviciosFiltrados = [...this.servicios];
        },
        error: () => {
          console.error('Error al obtener los servicios.');
        }
      });
    }
  }

  aplicarFiltros(): void {
    const busqueda = this.filtroBusqueda.toLowerCase();
    this.serviciosFiltrados = this.servicios.filter((servicio) =>
      servicio.descripcion.toLowerCase().includes(busqueda)
    );
  }

  verDetalleServicio(idServicio: number): void {
    this.router.navigate(['/servicio', idServicio]);
  }
}


