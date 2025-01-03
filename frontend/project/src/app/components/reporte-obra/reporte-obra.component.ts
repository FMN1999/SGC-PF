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
import {ActivatedRoute} from "@angular/router";

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
  id_obra: number = 0;

  // @ts-ignore
  // @ts-ignore
  public barChartData: ChartData<'bar'> = {
    labels: ['Total Compras', 'Total Contratación','Presupuesto Restante'],
    datasets: [
      {
        // @ts-ignore
        data: [this.reporte?.total_compras, this.reporte?.total_contratacion,
          // @ts-ignore
          this.reporte?.presupuesto_total - (this.reporte?.total_compras-this.reporte?.total_contratacion)],
        label: 'Gastos vs Presupuesto',
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', ],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', ],
        borderWidth: 1,
      }
    ]
  };

  constructor(private reporteService: ReporteService, private route: ActivatedRoute,) {
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
    // @ts-ignore
    this.id_obra = +this.route.snapshot.paramMap.get('id');
    this.obtenerReporte();
  }

  obtenerReporte() {
    this.reporteService.getReporteObra(this.id_obra)
      .subscribe(data => {
        this.reporte = data;
        this.loading = false;

        // Actualizar los datos del gráfico
        this.actualizarBarChartData();
      }, error => {
        console.error("Error al cargar el reporte", error);
        this.loading = false;
      });
  }

  actualizarBarChartData() {
    if (this.reporte) {
      this.barChartData = {
        labels: ['Total Compras', 'Total Contratación', 'Presupuesto Restante'],
        datasets: [
          {
            data: [
              this.reporte.total_compras,
              this.reporte.total_contratacion,
              this.reporte.presupuesto_total -
                (this.reporte.total_compras + this.reporte.total_contratacion)
            ],
            label: 'Gastos vs Presupuesto',
            backgroundColor: [
              'rgba(75, 192, 192, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
          }
        ]
      };
    }
  }
}

