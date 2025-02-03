import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuarios/usuario.service';
import { AuthService } from '../../services/auth/auth.service';
import { DataShareService } from '../../services/data-share/data-share.service';
import {formatDate, NgForOf, NgIf} from "@angular/common";
import { HeaderComponent } from '../header/header.component';
import {FormsModule} from "@angular/forms";
import {RouterLink, Router} from "@angular/router";
import { Title } from '@angular/platform-browser';
import Swal from "sweetalert2";

import { transliterate } from 'transliteration'; // Para eliminar los acentos

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
  isLoggedIn : boolean = false;
  tipo: string='';

  constructor(private usuarioService: UsuarioService, private authService: AuthService, private titleService: Title,
              protected dataShare: DataShareService, private router: Router) {}

  ngOnInit(): void {
    this.titleService.setTitle('Usuarios');
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (!this.isLoggedIn) {
        this.router.navigate(['/no-permissions']);
      }
      this.initLogueado();
    });
  }

  initLogueado(): void {
    // @ts-ignore
    const id_user = +sessionStorage.getItem('id_usuario');
    this.authService.cargarPermisos(id_user).subscribe({});

    // @ts-ignore
    this.tipo = sessionStorage.getItem('tipo');
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
    const term = transliterate(this.searchTerm).toLowerCase().trim();
    this.clientesFiltrados = this.clientes.filter((cliente) => {
      const nombre = transliterate(`${cliente.nombre} ${cliente.apellido}`).toLowerCase();
      return nombre.includes(term);
    });
    this.colaboradoresFiltrados = this.colaboradores.filter((colaborador) => {
      const nombre = transliterate(`${colaborador.nombre} ${colaborador.apellido}`).toLowerCase();
      return nombre.toLowerCase().includes(term);
    });
    this.proveedoresFiltrados = this.proveedores.filter(proveedor =>
      transliterate(proveedor.denominacion).toLowerCase().includes(term)
    );
  }

  darDeBajaCliente(id: number, nombre: string, apellido: string): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: `Está a punto de dar de baja al cliente: ${nombre} ${apellido}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const fechaBaja = formatDate(new Date(), 'yyyy-MM-dd', 'en');
        this.usuarioService.darDeBajaCliente(id, fechaBaja).subscribe({
          next: () => {
            // Actualiza la lista de clientes y muestra un mensaje de éxito
            this.clientes = this.clientes.filter(cliente => cliente.id !== id);
            this.filtrarEntidades();
            Swal.fire('¡Éxito!', `El cliente ${nombre} ${apellido} ha sido dado de baja con éxito.`, 'success');
          },
          error: (err) => {
            // Muestra un mensaje de error si la operación falla
            console.error('Error al dar de baja al cliente:', err);
            Swal.fire('Error', `Hubo un problema al dar de baja al cliente ${nombre} ${apellido}.`, 'error');
          }
        });
      }
    });
  }


  darDeBajaColaborador(id: number, nombre: string, apellido: string): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: `Está a punto de dar de baja al colaborador: ${nombre} ${apellido}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const fechaBaja = formatDate(new Date(), 'yyyy-MM-dd', 'en');
        this.usuarioService.darDeBajaColaborador(id, fechaBaja).subscribe({
          next: () => {
            // Actualiza la lista de colaboradores y muestra un mensaje de éxito
            this.colaboradores = this.colaboradores.filter(colaborador => colaborador.id !== id);
            this.filtrarEntidades();
            Swal.fire('¡Éxito!', `El colaborador ${nombre} ${apellido} ha sido dado de baja con éxito.`, 'success');
          },
          error: (err) => {
            // Muestra un mensaje de error si la operación falla
            console.error('Error al dar de baja al colaborador:', err);
            Swal.fire('Error', `Hubo un problema al dar de baja al colaborador ${nombre} ${apellido}.`, 'error');
          }
        });
      }
    });
  }

}


