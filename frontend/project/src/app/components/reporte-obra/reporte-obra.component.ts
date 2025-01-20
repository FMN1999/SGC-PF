import { Component, OnInit } from '@angular/core';
import { ReporteService } from '../../services/reporte/reporte.service';
import { AuthService } from '../../services/auth/auth.service';
import { DataShareService } from '../../services/data-share/data-share.service';
import {CurrencyPipe, NgForOf, NgIf, PercentPipe} from "@angular/common";
import {BaseChartDirective} from "ng2-charts";
import {ChartData} from "chart.js";
// @ts-ignore
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
import {ActivatedRoute, Router} from "@angular/router";
// @ts-ignore
import { Title as TitleService} from '@angular/platform-browser';

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
  isLoggedIn: boolean = false;

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


  constructor(private reporteService: ReporteService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private dataShare: DataShareService,
              private router: Router,
              // @ts-ignore
              private titleService: TitleService) {
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
    this.titleService.setTitle('Reporte de Obra');
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    if (!this.isLoggedIn) {
      this.router.navigate(['/no-permissions']);
    }

    // @ts-ignore
    const id_user = +sessionStorage.getItem('id_usuario');
    this.authService.cargarPermisos(id_user);

    if (!this.dataShare.permiso10) {
      this.router.navigate(['/no-permissions']);
    }
    // @ts-ignore
    this.id_obra = +this.route.snapshot.paramMap.get('id');
    this.obtenerReporte();
  }

  obtenerReporte() {
    this.reporteService.getReporteObra(this.id_obra)
      .subscribe(data => {
        this.reporte = data;
        // @ts-ignore
        const id_empresa = +sessionStorage.getItem('id_empresa');
        if(id_empresa !== this.reporte.id_empresa){
          this.router.navigate(['/no-permissions']);
        }
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

