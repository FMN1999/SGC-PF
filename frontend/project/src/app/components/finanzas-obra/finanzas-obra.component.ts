import { Component, OnInit, Input } from '@angular/core';
import { ObraService } from '../../services/obra/obra.service';
import {ActivatedRoute} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";

@Component({
    selector: 'app-finanzas-obra',
    templateUrl: './finanzas-obra.component.html',
    imports: [
        NgIf,
        NgForOf
    ],
    styleUrls: ['./finanzas-obra.component.scss']
})
export class FinanzasObraComponent implements OnInit {
  // @ts-ignore
  idObra: number;
  pagos: any[] = [];
  cobros: any[] = [];

  constructor(
    private obraService: ObraService,
    private route: ActivatedRoute,
    ) {}

  ngOnInit(): void {
    this.idObra = +this.route.snapshot.params['id'];
    if (this.idObra) {
      this.cargarPagosYCobros();
    }
  }

  cargarPagosYCobros(): void {
    this.obraService.obtenerPagosCobrosPorObra(this.idObra).subscribe({
      next: (data) => {
        this.pagos = data.pagos;
        this.cobros = data.cobros;
      },
      error: (err) => console.error('Error al cargar pagos y cobros:', err)
    });
  }
}

