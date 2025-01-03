import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../services/empresa/empresa.service';
import { Router } from '@angular/router';
import {FormsModule} from "@angular/forms";
import{ HeaderComponent } from '../header/header.component'
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.component.html',
  standalone: true,
  imports: [
    FormsModule,
    HeaderComponent,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./materiales.component.scss']
})
export class MaterialesComponent implements OnInit {
  materiales: any[] = [];
  materialesFiltrados: any[] = [];
  filtroBusqueda: string = '';
  filtroTipo: string = '';

  constructor(private empresaService: EmpresaService, private router: Router) {}

  ngOnInit(): void {
    const idEmpresa = sessionStorage.getItem('id_empresa');
    if (idEmpresa) {
      this.empresaService.listarMaterialesPorEmpresa(parseInt(idEmpresa)).subscribe({
        next: (data) => {
          this.materiales = data;
          this.materialesFiltrados = [...this.materiales]; // Inicializamos con todos los materiales
        },
        error: () => {
          console.error('Error al obtener los materiales.');
        }
      });
    }
  }

  aplicarFiltros(): void {
    // Convertimos los valores a minúsculas para una búsqueda insensible a mayúsculas
    const busqueda = this.filtroBusqueda.toLowerCase();
    const tipoFiltro = this.filtroTipo;

    // Filtrar los materiales
    this.materialesFiltrados = this.materiales.filter((material) => {
      const coincideTexto = material.descripcion.toLowerCase().includes(busqueda);
      const coincideTipo =
        tipoFiltro === '' || (tipoFiltro === 'herramienta' && material.tipo === 'herramienta') ||
        (tipoFiltro === 'vehiculo' && material.tipo === 'vehículo');
      return coincideTexto && coincideTipo;
    });
  }

  verDetalleMaterial(idMaterial: number): void {
    this.router.navigate(['/material', idMaterial]);
  }
}

