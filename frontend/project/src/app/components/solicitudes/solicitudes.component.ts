import { Component, OnInit } from '@angular/core';
import { CompraService } from '../../services/compra/compra.service';
import { NgForOf, NgIf } from "@angular/common";
import { HeaderComponent } from '../header/header.component';
import { RouterLink } from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    HeaderComponent,
    RouterLink,
    FormsModule
  ],
  styleUrls: ['./solicitudes.component.scss']
})
export class SolicitudesComponent implements OnInit {
  solicitudesPorEstado: { [key: string]: any[] } = {};
  estadosCompras: string[] = [];
  filtroBusqueda: string = '';
  filtroEstado: string = '';
  solicitudesFiltradas: { [key: string]: any[] } = {};
  estadosFiltrados: string[] = [];

  constructor(private solicitudService: CompraService) {}

  ngOnInit(): void {
    this.cargarSolicitudesPendientes();
  }

  cargarSolicitudesPendientes(): void {
    this.solicitudService.obtenerSolicitudesPendientes().subscribe((data: { [key: string]: any[] }) => {
      this.solicitudesPorEstado = data;
      this.estadosCompras = Object.keys(data);
      this.aplicarFiltros();
    });
  }

  aplicarFiltros(): void {
    const busqueda = this.filtroBusqueda.toLowerCase();
    this.solicitudesFiltradas = {};

    this.estadosFiltrados = this.estadosCompras.filter((estado) =>
      !this.filtroEstado || estado === this.filtroEstado
    );

    this.estadosFiltrados.forEach((estado) => {
      this.solicitudesFiltradas[estado] = this.solicitudesPorEstado[estado].filter((solicitud) =>
        solicitud.id.toString().includes(busqueda) ||
        solicitud.fecha.toLowerCase().includes(busqueda) ||
        solicitud.proveedor.toLowerCase().includes(busqueda)
      );
    });
  }

  tieneSolicitudesFiltradas(): boolean {
    // Verifica si hay al menos un array con elementos en `solicitudesFiltradas`.
    return Object.values(this.solicitudesFiltradas).some(
      (solicitudes) => Array.isArray(solicitudes) && solicitudes.length > 0
    );
  }
}


