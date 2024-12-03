import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmpresaService } from '../../services/empresa/empresa.service';
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import{HeaderComponent} from '../header/header.component';

@Component({
  selector: 'app-obras-empresa',
  templateUrl: './obras.component.html',
  imports: [
    CurrencyPipe,
    NgForOf,
    NgIf,
    HeaderComponent
  ],
  standalone: true,
  styleUrls: ['./obras.component.scss']
})
export class ObrasComponent implements OnInit {
  idEmpresa: number | null = null;
  obras: any[] = [];
  cargando = true;
  error = false;

  constructor(private empresaService: EmpresaService, private route: ActivatedRoute) {}

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
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar obras:', err);
        this.error = true;
        this.cargando = false;
      }
    });
  }
}
