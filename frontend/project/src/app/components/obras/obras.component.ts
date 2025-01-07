import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresaService } from '../../services/empresa/empresa.service';
import {HeaderComponent} from '../header/header.component';
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-obras-empresa',
  templateUrl: './obras.component.html',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    NgForOf,
    HeaderComponent,
    CurrencyPipe
  ],
  styleUrls: ['./obras.component.scss']
})
export class ObrasComponent implements OnInit {
  idEmpresa: number | null = null;
  obras: any[] = [];
  obrasFiltradas: any[] = [];
  cargando = true;
  error = false;

  // Variables para los filtros
  filtroBusqueda: string = '';
  filtroEstado: string = '';

  constructor(
    private empresaService: EmpresaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idEmpresa = +params['id'];
      if (this.idEmpresa) {
        this.cargarObras();
      }
    });
  }

  cargarObras(): void {
    this.cargando = true;
    this.empresaService.obtenerObrasPorEmpresa(this.idEmpresa!).subscribe({
      next: (response) => {
        this.obras = response.obras;
        this.obrasFiltradas = this.obras; // Inicializamos con todas las obras
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar obras:', err);
        this.error = true;
        this.cargando = false;
      }
    });
  }

  aplicarFiltros(): void {
    this.obrasFiltradas = this.obras.filter(obra => {
      const coincideBusqueda =
        obra.direccion.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        `${obra.cliente_nombre} ${obra.cliente_apellido}`
          .toLowerCase()
          .includes(this.filtroBusqueda.toLowerCase());

      const coincideEstado =
        this.filtroEstado === '' || obra.estado === this.filtroEstado;

      return coincideBusqueda && coincideEstado;
    });
  }

  irACrearObra(): void {
    this.router.navigate(['/crear-obra']);
  }

  irAObra(id: number): void {
    this.router.navigate([`/obra/${id}`]);
  }
}

