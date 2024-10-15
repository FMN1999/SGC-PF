import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProveedorService } from '../../services/proveedor/proveedor.service';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-perfil-proveedor',
  templateUrl: './perfil-proveedor.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  styleUrls: ['./perfil-proveedor.component.scss']
})
export class PerfilProveedorComponent implements OnInit {
  proveedor: any;
  materiales: any[] = [];
  servicios: any[] = [];
  ofertas: any[] = [];
  mensajeError: string = '';

  constructor(
    private proveedorService: ProveedorService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.proveedorService.obtenerProveedor(id).subscribe({
      next: (data) => {
        this.proveedor = data.proveedor;
        this.materiales = data.materiales;
        this.servicios = data.servicios;
        this.ofertas = data.ofertas;
      },
      error: (error) => {
        this.mensajeError = 'No se pudo obtener la información del proveedor.';
      }
    });
  }
}


