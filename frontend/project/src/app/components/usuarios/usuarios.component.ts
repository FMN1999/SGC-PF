import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuarios/usuario.service';
import {formatDate, NgForOf, NgIf} from "@angular/common";
import { HeaderComponent } from '../header/header.component';
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [HeaderComponent, FormsModule, NgIf, NgForOf, RouterLink],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  clientes: any[] = [];
  colaboradores: any[] = [];
  proveedores: any[] = [];
  clientesFiltrados: any[] = [];
  colaboradoresFiltrados: any[] = [];
  proveedoresFiltrados: any[] = [];
  searchTerm: string = '';
  mostrarEntidades: boolean = true;
  idEmpresa: number = 0;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    // @ts-ignore
    this.idEmpresa = +sessionStorage.getItem('id_empresa');
    this.usuarioService.obtenerUsuariosPorEmpresa(this.idEmpresa).subscribe({
      next: (data: any) => {
        this.clientes = this.clientesFiltrados = data.clientes;
        this.colaboradores = this.colaboradoresFiltrados = data.colaboradores;
        this.proveedores = this.proveedoresFiltrados = data.proveedores;
      },
      error: () => {
        console.error('No se pudo obtener la información de los usuarios.');
      }
    });
  }

  filtrarEntidades(): void {
    const term = this.searchTerm.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(cliente =>
      (`${cliente.nombre} ${cliente.apellido}`).toLowerCase().includes(term)
    );
    this.colaboradoresFiltrados = this.colaboradores.filter(colaborador =>
      (`${colaborador.nombre} ${colaborador.apellido}`).toLowerCase().includes(term)
    );
    this.proveedoresFiltrados = this.proveedores.filter(proveedor =>
      proveedor.denominacion.toLowerCase().includes(term)
    );
  }

  darDeBajaCliente(id: number): void {
    const fechaBaja = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.usuarioService.darDeBajaCliente(id, fechaBaja).subscribe(() => {
      this.clientes = this.clientes.filter(cliente => cliente.id !== id);
      this.filtrarEntidades();
    });
  }

  darDeBajaColaborador(id: number): void {
    const fechaBaja = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.usuarioService.darDeBajaColaborador(id, fechaBaja).subscribe(() => {
      this.colaboradores = this.colaboradores.filter(colaborador => colaborador.id !== id);
      this.filtrarEntidades();
    });
  }
}


