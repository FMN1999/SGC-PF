import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService} from '../../services/auth/auth.service';
import { EmpresaService } from '../../services/empresa/empresa.service';
import { DataShareService } from '../../services/data-share/data-share.service';
import {HeaderComponent} from '../header/header.component';
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-obras-empresa',
  templateUrl: './obras.component.html',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    NgForOf,
    HeaderComponent,
    CurrencyPipe
  ],
  styleUrls: ['./obras.component.scss']
})
export class ObrasComponent implements OnInit {
  idEmpresa: number | null = null;
  obras: any[] = [];
  obrasFiltradas: any[] = [];
  cargando = true;
  error = false;

  // Variables para los filtros
  filtroBusqueda: string = '';
  filtroEstado: string = '';

  constructor(
    private empresaService: EmpresaService,
    private route: ActivatedRoute,
    private router: Router,
    protected dataShare: DataShareService,
    private authService: AuthService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Obras');
    this.route.params.subscribe(params => {
      this.idEmpresa = +params['id'];

      // @ts-ignore
      const id_user = +sessionStorage.getItem('id_usuario');
      // @ts-ignore
      const tipo_usuario = sessionStorage.getItem('tipo');
      this.authService.cargarPermisos(id_user);

      // @ts-ignore
      const empresa_id = +sessionStorage.getItem('id_empresa');
      if (this.idEmpresa === empresa_id) {
        this.cargarObras(tipo_usuario, id_user); // Pasamos tipo_usuario e id_user
      } else {
        this.router.navigate(['/no-permissions']);
      }
    });
  }

  cargarObras(tipo_usuario: string | null, id_user: number): void {
    this.cargando = true;
    this.empresaService.obtenerObrasPorEmpresa(this.idEmpresa!).subscribe({
      next: (response) => {
        this.obras = response.obras;

        // Filtrar obras si el usuario es de tipo cliente
        if (tipo_usuario === 'CL') {
          this.obras = this.obras.filter(obra => obra.id_usuario === id_user);
        }

        this.obrasFiltradas = this.obras; // Inicializamos con todas las obras
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar obras:', err);
        this.error = true;
        this.cargando = false;
      }
    });
  }

  aplicarFiltros(): void {
    this.obrasFiltradas = this.obras.filter(obra => {
      const coincideBusqueda =
        obra.direccion.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        `${obra.cliente_nombre} ${obra.cliente_apellido}`
          .toLowerCase()
          .includes(this.filtroBusqueda.toLowerCase());

      const coincideEstado =
        this.filtroEstado === '' || obra.estado === this.filtroEstado;

      return coincideBusqueda && coincideEstado;
    });
  }

  irACrearObra(): void {
    this.router.navigate(['/crear-obra']);
  }

  irAObra(id: number): void {
    this.router.navigate([`/obra/${id}`]);
  }
}

