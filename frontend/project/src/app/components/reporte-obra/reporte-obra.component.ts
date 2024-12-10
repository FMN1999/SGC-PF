import { Component, OnInit } from '@angular/core';
import { ReporteService } from '../../services/reporte/reporte.service';
import {CurrencyPipe, NgForOf, NgIf, PercentPipe} from "@angular/common";
import {BaseChartDirective} from "ng2-charts";
import {ChartData} from "chart.js";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import {HeaderComponent} from '../header/header.component';

@Component({
  selector: 'app-reporte-obra',
  templateUrl: './reporte-obra.component.html',
  imports: [
    NgIf,
    CurrencyPipe,
    PercentPipe,
    NgForOf,
    BaseChartDirective,
    HeaderComponent
  ],
  standalone: true,
  styleUrls: ['./reporte-obra.component.scss']
})
export class ReporteObraComponent implements OnInit {
  reporte: any;
  loading: boolean = true;

  public barChartData: ChartData<'bar'> = {
    labels: ['Total Compras', 'Presupuesto Restante'],
    datasets: [
      {
        // @ts-ignore
        data: [this.reporte?.total_compras, this.reporte?.presupuesto_total - this.reporte?.total_compras],
        label: 'Gastos vs Presupuesto',
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      }
    ]
  };

  constructor(private reporteService: ReporteService) {
    Chart.register(
      BarController,
      BarElement,
      CategoryScale,
      LinearScale,
      Title,
      Tooltip,
      Legend
    );
  }

  ngOnInit(): void {
    this.obtenerReporte();
  }

  obtenerReporte() {
    this.reporteService.getReporteObra(1) // ID de la obra, puede ser dinámico
      .subscribe(data => {
        this.reporte = data;
        this.loading = false;
      }, error => {
        console.error("Error al cargar el reporte", error);
        this.loading = false;
      });
  }
}

