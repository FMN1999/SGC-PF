import { Component, OnInit } from '@angular/core';
import { CompraService } from '../../services/compra/compra.service';
import { NgForOf, NgIf } from "@angular/common";
import { HeaderComponent } from '../header/header.component';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  imports: [
    NgIf,
    NgForOf,
    HeaderComponent,
    RouterLink
  ],
  standalone: true,
  styleUrls: ['./solicitudes.component.scss']
})
export class SolicitudesComponent implements OnInit {
  solicitudesPorEstado: { [key: string]: any[] } = {}; // Inicializamos como un objeto vacío
  estadosCompras: string[] = []; // Inicializamos como un array vacío
  noSolicitudes: boolean = true;

  constructor(private solicitudService: CompraService) {}

  ngOnInit(): void {
    this.cargarSolicitudesPendientes();
  }

  cargarSolicitudesPendientes(): void {
    this.solicitudService.obtenerSolicitudesPendientes().subscribe((data: { [key: string]: any[] }) => {
      this.solicitudesPorEstado = data;
      this.estadosCompras = Object.keys(data); // Obtenemos los estados disponibles
      this.noSolicitudes = this.estadosCompras.length === 0; // Verificamos si hay estados
    });
  }
}


