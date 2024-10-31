import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PresupuestoService } from '../../services/presupuesto/presupuesto.service';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-presupuesto-detalles',
  standalone: true,
  templateUrl: './presupuesto.component.html',
  imports: [
    NgIf,
    NgForOf
  ],
  styleUrls: ['./presupuesto.component.scss']
})
export class PresupuestoComponent implements OnInit {
  presupuesto: any;  // Aquí se almacenarán los detalles del presupuesto
  materiales: any[] = [];
  servicios: any[] = [];
  trabajadores: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private presupuestosService: PresupuestoService
  ) {}

  ngOnInit(): void {
    const idPresupuesto = +this.route.snapshot.paramMap.get('id')!;
    this.presupuestosService.getPresupuestoDetalles(idPresupuesto).subscribe(
      (data) => {
        this.presupuesto = data;
        this.materiales = data.materiales;
        this.servicios = data.servicios;
        this.trabajadores = data.trabajadores;
      },
      (error) => {
        console.error('Error al obtener los detalles del presupuesto:', error);
      }
    );
  }
}

