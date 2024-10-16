import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProveedorService } from '../../services/proveedor/proveedor.service';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-crear-material',
  templateUrl: './crear-material.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrls: ['./crear-material.component.scss']
})
export class CrearMaterialComponent {
  id_proveedor: number;
  materialData = {
    fecha_caducidad: '',
    tipo_material: '',
    unidad_medida: '',
    descripcion: '',
    marca: '',
    precio: 0,
    moneda: '',
    fecha_desde_precio: ''
  };
  mensajeExito = '';
  mensajeError = '';

  constructor(
    private route: ActivatedRoute,
    private proveedorService: ProveedorService,
    private router: Router
  ) {
    this.id_proveedor = this.route.snapshot.params['id'];
  }

  crearMaterial() {
    const data = { ...this.materialData, id_proveedor: this.id_proveedor };
    console.log(data)
    this.proveedorService.crearMaterial(data).subscribe({
      next: (response) => {
        this.mensajeExito = 'Material creado con éxito';
        this.router.navigate([`/proveedor/${this.id_proveedor}`]).then(r => {});  // Redirige al perfil del proveedor después de crear el material
      },
      error: (error) => {
        this.mensajeError = 'Error al crear el material';
      }
    });
  }
}

