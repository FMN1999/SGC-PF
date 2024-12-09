import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProveedorService } from '../../services/proveedor/proveedor.service';
import { UsuarioService } from '../../services/usuarios/usuario.service';
import { EmpresaService } from '../../services/empresa/empresa.service';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-crear-material',
  standalone: true,
  templateUrl: './crear-material.component.html',
  imports: [
    FormsModule,
    NgIf,
    HeaderComponent,
    NgForOf,
    ReactiveFormsModule,
  ],
  styleUrls: ['./crear-material.component.scss']
})

export class CrearMaterialComponent implements OnInit{
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
    id_proveedor: null,
  };

  vehiculoData = {
    patente: '',
    tipo: '',
    moneda: '',
    modelo: '',
    precio_x_hora: 0,
    id_almacen: null
  };

  herramientaData = {
    ubicacion: '',
    id_almacen: null
  };
  // @ts-ignore
  idEmpresa: number;
  // @ts-ignore
  proveedores: any[];
  almacenes: any;
  id_proveedor: any;
  mensajeError: string = '';
  mensajeSuccess: string = '';

  constructor(
    private route: ActivatedRoute,
    private usuariosService: UsuarioService,
    private proveedorService: ProveedorService,
    private empresaService: EmpresaService,
    private router: Router
  ) {
    this.id_proveedor = this.route.snapshot.params['id'];
    // @ts-ignore
    this.materialData.id_proveedor = this.id_proveedor;
  }

  ngOnInit(): void {
    // @ts-ignore
    this.idEmpresa = +sessionStorage.getItem('id_empresa');
    this.usuariosService.obtenerUsuariosPorEmpresa(this.idEmpresa).subscribe({
        next: (data: any) => {
          this.proveedores = data.proveedores;
        },
        error: (error: any) => {
          console.error('Error al obtener los datos del balance:', error);
        },
      }
    );
    this.empresaService.obtenerAlmacenesConDetalles(this.idEmpresa).subscribe({
      next: (data) => {
        this.almacenes = data.almacenes;
      },
      error: (err) => console.error('Error al cargar los almacenes:', err)
    });
  }
  crearMaterial() {
    if (!this.materialData.tipo_material || !this.materialData.unidad_medida || !this.materialData.descripcion) {
      this.mensajeError = 'Por favor, complete los campos obligatorios: Tipo de Material, Unidad de Medida y Descripción.';
      setTimeout(() => this.mensajeError = '', 5000); // Oculta el mensaje después de 5 segundos
      return;
    }

    const data = {
      ...this.materialData,
      tipo_asociacion: this.tipoAsociacion,
      ...(this.tipoAsociacion === 'vehiculo' ? this.vehiculoData : {}),
      ...(this.tipoAsociacion === 'herramienta' ? this.herramientaData : {})
    };

    this.proveedorService.crearMaterial(data).subscribe({
      next: (response) => {
        this.mensajeSuccess = 'Material creado con éxito.';
        this.limpiarFormulario();
        setTimeout(() => this.mensajeSuccess = '', 5000); // Oculta el mensaje después de 5 segundos
      },
      error: () => {
        this.mensajeError = 'Error al crear el material. Intente nuevamente.';
        setTimeout(() => this.mensajeError = '', 5000); // Oculta el mensaje después de 5 segundos
      }
    });
  }

 limpiarFormulario() {
  this.materialData = {
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
    id_proveedor: this.id_proveedor, // Conserva el id_proveedor asignado previamente
  };

  this.tipoAsociacion = '';

  this.vehiculoData = {
    patente: '',
    tipo: '',
    moneda: '',
    modelo: '',
    precio_x_hora: 0,
    id_almacen: null
  };

  this.herramientaData = {
    ubicacion: '',
    id_almacen: null
  };
}

}
