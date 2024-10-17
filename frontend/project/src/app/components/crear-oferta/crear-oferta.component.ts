import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../../services/proveedor/proveedor.service';
import { ActivatedRoute, Router } from '@angular/router';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-crear-oferta',
  templateUrl: './crear-oferta.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./crear-oferta.component.scss']
})
export class CrearOfertaComponent implements OnInit {
  materiales: any[] = [];
  servicios: any[] = [];
  ofertaData = {
    descripcion: '',
    monto_total: 0,
    moneda: '',
    fecha_desde: '',
    fecha_hasta: '',
    materiales: [],
    servicios: []
  };
  id_proveedor: number | undefined;
  mensajeExito: string = '';
  mensajeError: string = '';

  constructor(
    private proveedorService: ProveedorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id_proveedor = this.route.snapshot.params['id'];

    // Obtener materiales del proveedor
    this.proveedorService.obtenerMaterialesPorProveedor(this.id_proveedor).subscribe({
      next: (data: any) => {
        this.materiales = data.materiales.map((material: any) => ({
          ...material,
          cantidad_of: 0,
          unidad_of: '',
          monto: 0,
          moneda: '',
          porc_desc: 0,
          selected: false
        }));
      },
      error: () => {
        this.mensajeError = 'Error al obtener los materiales.';
      }
    });

    // Obtener servicios del proveedor
    this.proveedorService.obtenerServiciosPorProveedor(this.id_proveedor).subscribe({
      next: (data: any) => {
        this.servicios = data.servicios.map((servicio: any) => ({
          ...servicio,
          cantidad_of: 0,
          unidad_tiempo: '',
          monto: 0,
          moneda: '',
          porc_desc: 0,
          selected: false
        }));
      },
      error: () => {
        this.mensajeError = 'Error al obtener los servicios.';
      }
    });
  }

  agregarOferta() {
    const materialesSeleccionados = this.materiales
      .filter(material => material.selected)
      .map(material => ({
        id_material: material.id,
        cantidad_of: material.cantidad_of,
        unidad_of: material.unidad_of,
        monto: material.monto,
        moneda: material.moneda,
        porc_desc: material.porc_desc
      }));

    const serviciosSeleccionados = this.servicios
      .filter(servicio => servicio.selected)
      .map(servicio => ({
        id_servicio: servicio.id,
        cantidad_of: servicio.cantidad_of,
        unidad_tiempo: servicio.unidad_tiempo,
        monto: servicio.monto,
        moneda: servicio.moneda,
        porc_desc: servicio.porc_desc
      }));

    const ofertaCompleta = {
      ...this.ofertaData,
      id_proveedor: this.id_proveedor,
      materiales: materialesSeleccionados,
      servicios: serviciosSeleccionados
    };

    this.proveedorService.crearOferta(ofertaCompleta).subscribe({
      next: (response) => {
        this.mensajeExito = 'Oferta creada con éxito';
        this.router.navigate([`/proveedor/${this.id_proveedor}`]).then(r => {});
      },
      error: () => {
        this.mensajeError = 'Error al crear la oferta.';
      }
    });
  }
}
