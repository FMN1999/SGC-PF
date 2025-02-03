import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProveedorService } from '../../services/proveedor/proveedor.service';
import { AuthService } from '../../services/auth/auth.service';
import { DataShareService } from '../../services/data-share/data-share.service';
import { NgForOf, NgIf } from "@angular/common";
import { FormsModule } from '@angular/forms'; // Importar FormsModule para ngModel
import {HeaderComponent} from '../header/header.component';
import { Title } from '@angular/platform-browser';

import { transliterate } from 'transliteration'; // Para eliminar los acentos

@Component({
  selector: 'app-perfil-proveedor',
  templateUrl: './perfil-proveedor.component.html',
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    FormsModule, // Agregar FormsModule para el uso de ngModel,
    HeaderComponent
  ],
  standalone: true,
  styleUrls: ['./perfil-proveedor.component.scss']
})
export class PerfilProveedorComponent implements OnInit {
  proveedor: any;
  materiales: any[] = [];
  servicios: any[] = [];
  ofertas: any[] = [];
  mensajeError: string = '';
  isEditing = false; // Bandera para controlar el modo de edición
  searchMateriales = '';
  searchServicios = '';
  searchOfertas = '';
  showMateriales = true;
  showServicios = true;
  showOfertas = true;
  isLoggedIn:boolean=false;

  constructor(
    private proveedorService: ProveedorService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    protected dataShare: DataShareService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Perfil de Proveedor');
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (!this.isLoggedIn) {
        this.router.navigate(['/no-permissions']);
      }
      this.initLogueado();
    });
  }

  initLogueado(): void {
    const es_cliente = sessionStorage.getItem('tipo');
    if (es_cliente==='CL'){
      this.router.navigate(['/no-permissions']);
    }

    // @ts-ignore
    const id_user = +sessionStorage.getItem('id_usuario');
    this.authService.cargarPermisos(id_user);

    const id = this.route.snapshot.params['id'];
    this.proveedorService.obtenerProveedor(id).subscribe({
      next: (data) => {
        this.proveedor = data.proveedor;
        // @ts-ignore
        const id_emp = +sessionStorage.getItem('id_empresa');
        if (this.proveedor.id_empresa !==id_emp){
          this.router.navigate(['/no-permissions']);
        }
        this.materiales = data.materiales;
        this.servicios = data.servicios;
        this.ofertas = data.ofertas;
      },
      error: (error) => {
        this.mensajeError = 'No se pudo obtener la información del proveedor.';
      }
    });
  }

  enableEditing(): void {
    this.isEditing = true; // Habilitar el modo de edición
  }

  cancelEditing(): void {
    this.isEditing = false; // Cancelar el modo de edición sin guardar
  }

  updateProveedor(): void {
    const id = this.route.snapshot.params['id'];
    // Llamar al servicio para actualizar los datos del proveedor
    this.proveedorService.actualizarProveedor(id, this.proveedor).subscribe({
      next: () => {
        this.isEditing = false; // Deshabilitar el modo de edición tras la actualización
        console.log('Proveedor actualizado correctamente');
      },
      error: (err) => {
        console.error('Error al actualizar el proveedor:', err);
      }
    });
  }

  navigateToCreateMaterial(): void {
    const id = this.route.snapshot.params['id'];
    this.router.navigate([`/crear-material/${id}`]);
  }

  navigateToCreateServicio(): void {
    const id = this.route.snapshot.params['id'];
    this.router.navigate([`/crear-servicio/${id}`]);
  }

  navigateToCreateOferta(): void {
    const id = this.route.snapshot.params['id'];
    this.router.navigate([`/crear-oferta/${id}`]);
  }

  eliminarMaterial(materialId: number): void {
    this.proveedorService.eliminarMaterial(materialId).subscribe({
      next: () => {
        this.materiales = this.materiales.filter(material => material.id !== materialId);
      },
      error: () => {
        console.error('Error al eliminar el material');
      }
    });
  }

  eliminarServicio(servicioId: number): void {
    this.proveedorService.eliminarServicio(servicioId).subscribe({
      next: () => {
        this.servicios = this.servicios.filter(servicio => servicio.id !== servicioId);
      },
      error: () => {
        console.error('Error al eliminar el servicio');
      }
    });
  }

  eliminarOferta(ofertaId: number): void {
    this.proveedorService.eliminarOferta(ofertaId).subscribe({
      next: () => {
        this.ofertas = this.ofertas.filter(oferta => oferta.id !== ofertaId);
      },
      error: () => {
        console.error('Error al eliminar la oferta');
      }
    });
  }
    // Métodos de búsqueda
  filteredMateriales() {
    const busqueda = transliterate(this.searchMateriales).toLowerCase().trim();
    return this.materiales.filter(m => transliterate(m.nombre).toLowerCase().includes(busqueda));
  }

  filteredServicios() {
    const busqueda = transliterate(this.searchServicios).toLowerCase().trim();
    return this.servicios.filter(s =>
      transliterate(s.descripcion).toLowerCase().includes(this.searchServicios.toLowerCase())
    );
  }

  filteredOfertas() {
    const busqueda = transliterate(this.searchOfertas).toLowerCase().trim();
    return this.ofertas.filter(o =>
      transliterate(o.descripcion).toLowerCase().includes(this.searchOfertas.toLowerCase())
    );
  }

  // Alternar visibilidad de secciones
  toggleSection(section: string) {
    if (section === 'materiales') this.showMateriales = !this.showMateriales;
    if (section === 'servicios') this.showServicios = !this.showServicios;
    if (section === 'ofertas') this.showOfertas = !this.showOfertas;
  }

  navigateToMaterial(id: number): void {
    this.router.navigate(['/material', id]);
  }

  navigateToServicio(id: number): void {
    this.router.navigate(['/servicio', id]);
  }

  navigateToOferta(id: number): void {
    this.router.navigate(['/oferta', id]);
  }
}



