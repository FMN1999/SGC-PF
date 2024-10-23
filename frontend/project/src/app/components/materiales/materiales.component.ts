import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../services/empresa/empresa.service';
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink
  ],
  styleUrls: ['./materiales.component.scss']
})
export class MaterialesComponent implements OnInit {
  materiales: any[] = [];
  mensajeError: string = '';

  constructor(private empresaService: EmpresaService) {}

  ngOnInit(): void {
    const idEmpresa = sessionStorage.getItem('id_empresa');
    if (idEmpresa) {
      this.empresaService.listarMaterialesPorEmpresa(parseInt(idEmpresa)).subscribe({
        next: (data) => {
          this.materiales = data;
        },
        error: (error) => {
          this.mensajeError = 'Error al obtener los materiales.';
        }
      });
    }
  }
}

