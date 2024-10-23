import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../services/empresa/empresa.service'; // Asegúrate de tener un servicio de HTTP configurado
import {Router, RouterLink} from '@angular/router';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent implements OnInit {
  servicios: any[] = [];
  idEmpresa: string | null = sessionStorage.getItem('id_empresa');

  constructor(private empresaService: EmpresaService, private router: Router) {}

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


