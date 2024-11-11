import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompraService } from '../../services/compra/compra.service';
import {DatePipe, NgForOf, NgIf} from "@angular/common";

@Component({
  standalone: true,
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  imports: [
    NgIf,
    NgForOf,
    DatePipe
  ],
  styleUrls: ['./compra.component.scss']
})
export class CompraComponent implements OnInit {
  compra: any;
  estadoActual: string = '';

  constructor(
    private route: ActivatedRoute,
    private compraService: CompraService
  ) {}

  ngOnInit(): void {
    const compraId = Number(this.route.snapshot.paramMap.get('id'));
    this.obtenerCompra(compraId);
  }

  obtenerCompra(compraId: number): void {
    this.compraService.obtenerCompra(compraId).subscribe((data) => {
      this.compra = data;
      this.estadoActual = data.estado;
    });
  }

  obtenerBotones(): string[] {
    const secuenciaEstados = {
      'Pendiente': ['Rechazado', 'Confirmado'],
      'Confirmado': ['Cancelado', 'Pedido'],
      'Pedido': ['A recibir'],
      'A recibir': ['Recibido'],
      'Recibido': ['Cerrado']
    };
    // @ts-ignore
    return secuenciaEstados[this.estadoActual] || [];
  }

  cambiarEstado(nuevoEstado: string): void {
    const compraId = this.compra.id;
    this.compraService.cambiarEstadoCompra(compraId, nuevoEstado).subscribe(
      (response) => {
        this.estadoActual = nuevoEstado;
        this.obtenerCompra(compraId); // Recarga los datos para reflejar el nuevo estado
      },
      (error) => {
        console.error('Error al cambiar el estado:', error);
      }
    );
  }
}
