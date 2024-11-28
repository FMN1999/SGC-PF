import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../services/empresa/empresa.service';
import {NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";

@Component({
    selector: 'app-listado-empresas',
    templateUrl: './empresas.component.html',
    styleUrls: ['./empresas.component.scss'],
    imports: [
        NgIf,
        NgForOf
    ]
})
export class EmpresasComponent implements OnInit {
  empresas: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private empresaService: EmpresaService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerEmpresas();
  }

  obtenerEmpresas(): void {
    this.empresaService.obtenerEmpresas().subscribe({
      next: (data) => {
        this.empresas = data;
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

  irACrearEmpresa(): void {
    this.router.navigate(['/crear-empresa']);
  }
}
