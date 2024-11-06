import { Component, OnInit } from '@angular/core';
import { CompraService } from '../../services/compra/compra.service';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  standalone: true,
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  imports: [
    NgIf,
    NgForOf
  ],
  styleUrls: ['./solicitudes.component.scss']
})
export class SolicitudesComponent implements OnInit {
  solicitudesPendientes: any[] = [];

  constructor(private solicitudService: CompraService) {}

  ngOnInit(): void {
    this.cargarSolicitudesPendientes();
  }

  cargarSolicitudesPendientes(): void {
    this.solicitudService.obtenerSolicitudesPendientes().subscribe(
      (data: any[]) => {
        this.solicitudesPendientes = data;
      },
      (error: any) => {
        console.error('Error al obtener solicitudes pendientes:', error);
      }
    );
  }
}

