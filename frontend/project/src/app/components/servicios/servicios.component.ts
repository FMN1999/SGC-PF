import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../services/empresa/empresa.service'; // Asegúrate de tener un servicio de HTTP configurado
import {RouterLink} from '@angular/router';
import {NgForOf, NgIf} from "@angular/common";
import {HeaderComponent} from '../header/header.component';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  imports: [
    RouterLink,
    NgForOf,
    NgIf,
    HeaderComponent
  ],
  standalone: true,
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent implements OnInit {
  servicios: any[] = [];
  idEmpresa: string | null = sessionStorage.getItem('id_empresa');

  constructor(private empresaService: EmpresaService) {}

  ngOnInit(): void {
    if (this.idEmpresa) {
      this.empresaService.obtenerServiciosPorEmpresa(parseInt(this.idEmpresa))
        .subscribe((data: any) => {
          this.servicios = data;
        }, (error: any) => {
          console.error('Error al obtener la lista de servicios', error);
        });
    } else {
      console.error('No se encontró el id_empresa en sessionStorage');
    }
  }
}


