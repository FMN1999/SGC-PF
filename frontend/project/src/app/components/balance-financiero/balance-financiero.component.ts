import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { ChartComponent, ApexChart, ApexAxisChartSeries, ApexXAxis, ApexTitleSubtitle, ApexDataLabels, ApexTooltip, ApexResponsive } from "ng-apexcharts";
import {CurrencyPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import { EmpresaService } from '../../services/empresa/empresa.service';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../../services/auth/auth.service';
import { DataShareService } from '../../services/data-share/data-share.service';

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  dataLabels?: ApexDataLabels;
  tooltip?: ApexTooltip;
  responsive?: ApexResponsive[];
}

@Component({
  selector: 'app-balance-financiero',
  templateUrl: './balance-financiero.component.html',
  imports: [
    ChartComponent,
    CurrencyPipe,
    NgIf,
    HeaderComponent,
    NgClass,
    NgForOf
  ],
  standalone: true,
  styleUrls: ['./balance-financiero.component.scss']
})
export class BalanceFinancieroComponent implements OnInit {
  empresaId!: number;
  balanceData: any = {};
  loading: boolean = true;

  // Opciones para los gráficos
    ingresosEgresosChartOptions: Partial<ChartOptions> = {
    series: [],
    chart: { type: 'bar', height: 350 },
    xaxis: { categories: [] },
    title: { text: '' },
  };

  balanceMensualChartOptions: Partial<ChartOptions> = {
    series: [],
    chart: { type: 'line', height: 350 },
    xaxis: { categories: [] },
    title: { text: '' },
  };

  meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  isLoggedIn: boolean = false;

  constructor(private route: ActivatedRoute, private empresaService: EmpresaService, private authService: AuthService,
              private router: Router, private dataShare: DataShareService) {}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
    if (!this.isLoggedIn) {
      this.router.navigate(['/no-permissions']);
    }
    this.empresaId = +this.route.snapshot.params['id'];

    // @ts-ignore
    const empresa_id = +sessionStorage.getItem('id_empresa');
    if (this.empresaId !== empresa_id || !this.dataShare.permiso10) {
      this.router.navigate(['/no-permissions']);
    }

    this.obtenerBalance();
  }

  obtenerBalance(): void {
    this.empresaService.obtenerBalanceFinanciero(this.empresaId, 2024).subscribe({
      next: (data) => {
        this.balanceData = data;
        this.crearGraficos();
      },
      error: (error) => {
        console.error('Error al obtener los datos del balance:', error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  crearGraficos(): void {

    // Gráfico de Ingresos vs Egresos
    this.ingresosEgresosChartOptions = {
      series: [
        {
          name: 'Ingresos',
          data: Object.values(this.balanceData.ingresos_mensuales) as number[],

        },
        {
          name: 'Egresos',
          data: Object.values(this.balanceData.egresos_mensuales) as number[],

        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        stacked: true, // Apilar barras
        toolbar: { show: true },
      },
      xaxis: {
        categories: this.meses,
        title: { text: 'Meses' },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `$${val.toFixed(2)}`, // Formatear valores
      },
      tooltip: {
        y: {
          formatter: (val: number) => `$${val.toFixed(2)}`,
        },
      },
      title: {
        text: 'Ingresos y Egresos Mensuales',
        align: 'center',
      },
    };

    // Gráfico de Balance Mensual
    this.balanceMensualChartOptions = {
      series: [
        {
          name: 'Balance',
          data: Object.values(this.balanceData.balance_mensual) as number[],

        }
      ],
      chart: {
        type: 'line',
        height: 350,
      },
      xaxis: {
        categories: this.meses,
        title: { text: 'Meses' },
      },
      dataLabels: { enabled: true },
      tooltip: {
        y: {
          formatter: (val: number) => `$${val.toFixed(2)}`,
        },
      },
      title: {
        text: 'Balance Mensual',
        align: 'center',
      },
    };
  }
}

