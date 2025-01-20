import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../services/empresa/empresa.service';
import {ActivatedRoute, Router} from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import {AuthService} from "../../services/auth/auth.service";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    HeaderComponent
  ],
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent implements OnInit {
  servicios: any[] = [];
  serviciosFiltrados: any[] = [];
  filtroBusqueda: string = '';
  isLoggedIn: boolean=false;

  constructor(private empresaService: EmpresaService, private router: Router, private authService: AuthService,
              private route: ActivatedRoute, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Servicios');
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    if (!this.isLoggedIn) {
      this.router.navigate(['/no-permissions']);
    }

    const es_cliente = sessionStorage.getItem('tipo');
    if(es_cliente==='CL'){
      this.router.navigate(['/no-permissions']);
    }

    // @ts-ignore
    const id_user = +sessionStorage.getItem('id_usuario');
    this.authService.cargarPermisos(id_user);

    // @ts-ignore
    const idEmpresa = +sessionStorage.getItem('id_empresa');
    const empr_ruta = +this.route.snapshot.params['id'];
    if (idEmpresa ===empr_ruta) {
      this.empresaService.obtenerServiciosPorEmpresa(idEmpresa).subscribe({
        next: (data) => {
          this.servicios = data;
          this.serviciosFiltrados = [...this.servicios];
        },
        error: () => {
          console.error('Error al obtener los servicios.');
        }
      });
    }
    else {
      this.router.navigate(['/no-permissions']);
    }
  }

  aplicarFiltros(): void {
    const busqueda = this.filtroBusqueda.toLowerCase();
    this.serviciosFiltrados = this.servicios.filter((servicio) =>
      servicio.descripcion.toLowerCase().includes(busqueda)
    );
  }

  verDetalleServicio(idServicio: number): void {
    this.router.navigate(['/servicio', idServicio]);
  }
}


