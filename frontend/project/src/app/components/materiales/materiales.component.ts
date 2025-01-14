import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../services/empresa/empresa.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule} from "@angular/forms";
import{ HeaderComponent } from '../header/header.component'
import {NgForOf, NgIf} from "@angular/common";
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.component.html',
  standalone: true,
  imports: [
    FormsModule,
    HeaderComponent,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./materiales.component.scss']
})
export class MaterialesComponent implements OnInit {
  materiales: any[] = [];
  materialesFiltrados: any[] = [];
  filtroBusqueda: string = '';
  filtroTipo: string = '';
  isLoggedIn:boolean=false;
  // @ts-ignore
  esColaborador:string;

  constructor(private empresaService: EmpresaService, private router: Router, private authService: AuthService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    if (!this.isLoggedIn) {
      this.router.navigate(['/no-permissions']);
    }
    // @ts-ignore
    const id_user = +sessionStorage.getItem('id_usuario');
    this.authService.cargarPermisos(id_user);

    // @ts-ignore
    const idEmpresa = +sessionStorage.getItem('id_empresa');
    const empr_ruta = +this.route.snapshot.params['id'];
    // @ts-ignore
    this.esColaborador = sessionStorage.getItem('tipo');

    if (this.esColaborador==='CO' && empr_ruta ===idEmpresa){

      this.empresaService.listarMaterialesPorEmpresa(empr_ruta).subscribe({
        next: (data) => {
          this.materiales = data;
          this.materialesFiltrados = [...this.materiales]; // Inicializamos con todos los materiales
        },
        error: () => {
          console.error('Error al obtener los materiales.');
        }
      });
    }
    else{
      this.router.navigate(['/no-permissions']);
    }


  }

  aplicarFiltros(): void {
    // Convertimos los valores a minúsculas para una búsqueda insensible a mayúsculas
    const busqueda = this.filtroBusqueda.toLowerCase();
    const tipoFiltro = this.filtroTipo;

    // Filtrar los materiales
    this.materialesFiltrados = this.materiales.filter((material) => {
      const coincideTexto = material.descripcion.toLowerCase().includes(busqueda);
      const coincideTipo =
        tipoFiltro === '' || (tipoFiltro === 'herramienta' && material.tipo === 'herramienta') ||
        (tipoFiltro === 'vehiculo' && material.tipo === 'vehículo');
      return coincideTexto && coincideTipo;
    });
  }

  verDetalleMaterial(idMaterial: number): void {
    this.router.navigate(['/material', idMaterial]);
  }
}

