import { Component, OnInit} from '@angular/core';
import { EmpresaService } from '../../services/empresa/empresa.service';
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import { HeaderComponent } from '../header/header.component'

@Component({
  selector: 'app-almacenes-empresa',
  templateUrl: './almacenes.component.html',
  imports: [
    NgForOf,
    NgIf,
    HeaderComponent
  ],
  standalone: true,
  styleUrls: ['./almacenes.component.scss']
})

export class AlmacenesComponent implements OnInit {
  // @ts-ignore
  idEmpresa: number;
  almacenes: any[] = [];

  constructor(private empresaService: EmpresaService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // @ts-ignore
    this.idEmpresa = +this.route.snapshot.paramMap.get('id');
    if (this.idEmpresa) {
      this.cargarAlmacenes();
    }
  }

  cargarAlmacenes(): void {
    this.empresaService.obtenerAlmacenesConDetalles(this.idEmpresa).subscribe({
      next: (data) => {
        this.almacenes = data.almacenes;
      },
      error: (err) => console.error('Error al cargar los almacenes:', err)
    });
  }
}
