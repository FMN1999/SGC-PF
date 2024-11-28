// crear-material.component.ts
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProveedorService } from '../../services/proveedor/proveedor.service';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-crear-material',
    templateUrl: './crear-material.component.html',
    imports: [
        FormsModule,
        NgIf
    ],
    styleUrls: ['./crear-material.component.scss']
})
export class CrearMaterialComponent {
  id_proveedor: number;
  tipoAsociacion: string = '';  // Para seleccionar entre material, vehículo o herramienta

  materialData = {
    tipo_material: '',
    unidad_medida: '',
    descripcion: '',
    marca: '',
    precio: 0,
    moneda: '',
    impuestos_total: 0,
    moneda_impuestos: '',
    descripcion_impuestos: '',
    otros_gastos: 0,
    moneda_otros_gastos: '',
    descripcion_otros_gastos: '',
    fecha_desde_precio: '',
    id_proveedor: null
  };

  vehiculoData = {
    patente: '',
    tipo: '',
    marca_vehiculo: '',
    modelo: '',
    precio_x_hora: 0,
    id_almacen: null
  };

  herramientaData = {
    ubicacion: '',
    marca_herramienta: '',
    id_almacen: null
  };

  constructor(
    private route: ActivatedRoute,
    private proveedorService: ProveedorService,
    private router: Router
  ) {
    this.id_proveedor = this.route.snapshot.params['id'];
    // @ts-ignore
    this.materialData.id_proveedor = this.id_proveedor;
  }

  crearMaterial() {
    const data = {
      ...this.materialData,
      tipo_asociacion: this.tipoAsociacion,
      ...this.tipoAsociacion === 'vehiculo' ? this.vehiculoData : {},
      ...this.tipoAsociacion === 'herramienta' ? this.herramientaData : {}
    };
    this.proveedorService.crearMaterial(data).subscribe({
      next: (response) => {
        alert('Material creado con éxito');
        this.router.navigate([`/proveedor/${this.id_proveedor}`]).then(r => {});
      },
      error: () => {
        alert('Error al crear el material');
      }
    });
  }
}
