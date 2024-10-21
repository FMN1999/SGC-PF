import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProveedorService } from '../../services/proveedor/proveedor.service';
import { NgForOf, NgIf } from "@angular/common";
import { FormsModule } from '@angular/forms'; // Importar FormsModule para ngModel

@Component({
  selector: 'app-perfil-proveedor',
  templateUrl: './perfil-proveedor.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    FormsModule  // Agregar FormsModule para el uso de ngModel
  ],
  styleUrls: ['./perfil-proveedor.component.scss']
})
export class PerfilProveedorComponent implements OnInit {
  proveedor: any;
  materiales: any[] = [];
  servicios: any[] = [];
  ofertas: any[] = [];
  mensajeError: string = '';
  isEditing = false; // Bandera para controlar el modo de edición

  constructor(
    private proveedorService: ProveedorService,
    private route: ActivatedRoute,
    private router: Router
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
}



