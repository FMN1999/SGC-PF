import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProveedorService } from '../../services/proveedor/proveedor.service';
import { UsuarioService } from '../../services/usuarios/usuario.service';
import { AuthService } from '../../services/auth/auth.service';
import { DataShareService } from '../../services/data-share/data-share.service';
import { EmpresaService } from '../../services/empresa/empresa.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
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
  materialForm: FormGroup;
  vehiculoForm: FormGroup;
  herramientaForm: FormGroup;
  // @ts-ignore
  idEmpresa: number;
  // @ts-ignore
  proveedores: any[];
  almacenes: any;
  id_proveedor: any;
  mensajeError: string = '';
  mensajeSuccess: string = '';
  isLoggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private usuariosService: UsuarioService,
    private proveedorService: ProveedorService,
    private empresaService: EmpresaService,
    private router: Router,
    private authService: AuthService,
    private dataShare: DataShareService
  ) {
      this.id_proveedor = this.route.snapshot.params['id'];
      this.materialForm = this.fb.group({
        tipo_material: ['', Validators.required],
        unidad_medida: ['', Validators.required],
        descripcion: ['', Validators.required],
        precio: [0],
        moneda: [''],
        marca: [''],
        fecha_desde_precio: [''],
        impuestos_total: [0],
        moneda_impuestos: [''],
        descripcion_impuestos: [''],
        otros_gastos: [0],
        moneda_otros_gastos: [''],
        descripcion_otros_gastos: [''],
        tipoAsociacion: [''],
        id_proveedor: this.id_proveedor, // Conserva el id_proveedor
      });

    this.vehiculoForm = this.fb.group({
      patente: [''],
      tipo: [''],
      modelo: [''],
      precio_x_hora: [0, Validators.min(0)],
      id_almacen: ['']
    });

    this.herramientaForm = this.fb.group({
      ubicacion: [''],
      id_almacen: ['']
    });
  }

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

    if (!this.dataShare.permiso5) {
      this.router.navigate(['/no-permissions']);
    }
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
    if (this.materialForm.invalid) {
      this.mensajeError = 'Por favor, complete todos los campos obligatorios.';
      setTimeout(() => (this.mensajeError = ''), 5000);
      return;
    }

    const materialData = { ...this.materialForm.value };
    if (materialData.tipoAsociacion === 'vehiculo') {
      materialData.vehiculo = this.vehiculoForm.value;
    } else if (materialData.tipoAsociacion === 'herramienta') {
      materialData.herramienta = this.herramientaForm.value;
    }

    this.proveedorService.crearMaterial(materialData).subscribe({
      next: () => {
        this.mensajeSuccess = 'Material creado con éxito.';
        this.materialForm.reset({
          id_proveedor: this.id_proveedor // Conserva el id_proveedor al resetear
        });
        this.vehiculoForm.reset();
        this.herramientaForm.reset();
        setTimeout(() => (this.mensajeSuccess = ''), 5000);
      },
      error: () => {
        this.mensajeError = 'Error al crear el material. Intente nuevamente.';
        setTimeout(() => (this.mensajeError = ''), 5000);
      }
    });
  }
}
