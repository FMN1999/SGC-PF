import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuarios/usuario.service';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  clientes: any[] = [];
  colaboradores: any[] = [];
  proveedores: any[] = [];
  // @ts-ignore
  idEmpresa: number = parseInt(sessionStorage.getItem('id_empresa'));
  mensajeError: string = '';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    if (this.idEmpresa) {
      this.usuarioService.obtenerUsuariosPorEmpresa(this.idEmpresa).subscribe({
        next: (data: any) => {
          this.clientes = data.clientes;
          this.colaboradores = data.colaboradores;
          this.proveedores = data.proveedores;
        },
        error: (error) => {
          this.mensajeError = 'No se pudo obtener la información de los usuarios.';
        }
      });
    }
  }
}

