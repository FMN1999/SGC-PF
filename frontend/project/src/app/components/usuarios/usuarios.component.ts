import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuarios/usuario.service';
import {formatDate, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    RouterLink
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

  darDeBajaCliente(id: number): void {
    const fechaBaja = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.usuarioService.darDeBajaCliente(id, fechaBaja).subscribe((response: any) => {
      console.log('Cliente dado de baja:', response);
      window.location.reload();
    });
  }

  darDeBajaColaborador(id: number): void {
    const fechaBaja = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.usuarioService.darDeBajaColaborador(id, fechaBaja).subscribe((response: any) => {
      console.log('Colaborador dado de baja:', response);
      window.location.reload();
    });
  }
}

