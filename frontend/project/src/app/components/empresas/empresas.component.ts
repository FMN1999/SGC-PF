import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../services/empresa/empresa.service';
import { AuthService } from '../../services/auth/auth.service';
import { DataShareService } from '../../services/data-share/data-share.service';
import { NgForOf, NgIf } from "@angular/common";
import { Router } from "@angular/router";
import { HeaderComponent } from '../header/header.component'
import {NgxPaginationModule} from "ngx-pagination";
import {FormsModule} from "@angular/forms";
import { Title } from '@angular/platform-browser';

import { transliterate } from 'transliteration'; // Para eliminar los acentos

@Component({
  selector: 'app-listado-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    HeaderComponent,
    NgxPaginationModule,
    FormsModule
  ]
})
export class EmpresasComponent implements OnInit {
  empresas: any[] = [];
  filteredEmpresas: any[] = [];
  searchTerm: string = '';
  selectedFilter: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  loading: boolean = false;
  error: string | null = null;
  isLoggedIn: boolean = false;

  constructor(private empresaService: EmpresaService, private router: Router, private authService: AuthService,
              private dataShare: DataShareService, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Empresas');
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    if (!this.isLoggedIn) {
      this.router.navigate(['/no-permissions']);
    }
    // @ts-ignore
    const id_user = +sessionStorage.getItem('id_usuario');
    this.authService.cargarPermisos(id_user);

    if (!this.dataShare.permiso16) {
      this.router.navigate(['/no-permissions']);
    }

    this.obtenerEmpresas();
  }

  obtenerEmpresas(): void {
    this.loading = true;
    this.error = null;

    this.empresaService.obtenerEmpresas().subscribe({
      next: (data) => {
        this.empresas = data;
        this.filteredEmpresas = [...this.empresas]; // Inicializar la lista filtrada
      },
      error: (error) => {
        console.error('Error al obtener las empresas:', error);
        this.error = 'No se pudieron cargar las empresas.';
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    const busqueda = transliterate(this.searchTerm).toLowerCase().trim();
    this.filteredEmpresas = this.empresas.filter((empresa) => {
      const matchesSearch =
        transliterate(empresa.denominacion).toLowerCase().includes(busqueda) ||
        empresa.cuit.includes(this.searchTerm);

      const matchesFilter =
        !this.selectedFilter || empresa.estado === this.selectedFilter;

      return matchesSearch && matchesFilter;
    });

    this.currentPage = 1; // Resetear a la primera página después de aplicar filtros
  }

  irACrearEmpresa(): void {
    this.router.navigate(['/crear-empresa']);
  }

  cambiarPagina(event: number): void {
    this.currentPage = event;
  }
}
