import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ProveedorService } from '../../services/proveedor/proveedor.service';
import { EmpresaService } from '../../services/empresa/empresa.service';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {HeaderComponent} from '../header/header.component';
import {BehaviorSubject} from "rxjs";
import { AuthService } from '../../services/auth/auth.service';
import { DataShareService } from '../../services/data-share/data-share.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush, // Aquí
  imports: [
    NgIf,
    ReactiveFormsModule,
    DatePipe,
    HeaderComponent,
    NgForOf,
    AsyncPipe
  ],
  standalone: true,
  styleUrls: ['./material.component.scss']
})
export class MaterialComponent implements OnInit {
  material$ = new BehaviorSubject<any>(null);
  almacenes$ = new BehaviorSubject<any[]>([]);
  material: any;
  editMode: boolean = false;  // Variable para alternar entre modo edición y vista
  materialForm: FormGroup;
  empresaId: number | undefined;
  almacenes: any;
  mensajeExito: string ='';
  mensajeError: string = '';
  // @ts-ignore
  materialId: number;
  isLoggedIn: boolean=false;
  // @ts-ignore
  empresa_mat : number;
  // @ts-ignore
  esColaborador:string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private proveedorService: ProveedorService,
    private empresaService: EmpresaService,
    private authService: AuthService,
    protected dataShare: DataShareService,
    private router: Router,
    private titleService: Title
  ) {
    // Definir el formulario reactivo
    this.materialForm = this.fb.group({
      nombre: ['', Validators.required], // Nombre del material
      descripcion: ['', Validators.required],
      marca: ['', Validators.required],
      precio: [''],
      moneda: [''],
      fecha_caducidad: [''],
      unidad_medida: [''],
      impuestos_total: [''],
      moneda_impuestos: [''],
      descripcion_impuestos: [''],
      otros_gastos: [''],
      moneda_otros_gastos: [''],
      descripcion_otros_gastos: [''],
      patente: [''],
      tipo: [''],
      precio_x_hora: [''],
      modelo: [''],
      almacen: [''],
      ubicacion: ['']
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Datos de Material');
    this.authService.isLoggedIn().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });

    if (!this.isLoggedIn) {
      this.router.navigate(['/no-permissions']);
    }

    const id_user = +sessionStorage.getItem('id_usuario')!;
    this.authService.cargarPermisos(id_user).subscribe({});

    this.empresaId = +sessionStorage.getItem('id_empresa')!;
    this.materialId = +this.route.snapshot.params['id'];
    // @ts-ignore
    this.esColaborador = sessionStorage.getItem('tipo');

    // Cargar el material y esperar los datos antes de continuar
    this.proveedorService.getMaterialById(this.materialId).subscribe({
      next: (data) => {
        this.empresa_mat = data.id_empresa;
        this.material$.next(data);
        this.updateFormControls(data);

        // Ahora que `empresa_mat` está disponible, puedes realizar la comparación
        if (this.esColaborador==='CO' && this.empresaId === this.empresa_mat) {
          this.empresaService.obtenerAlmacenesPorEmpresa(this.empresa_mat).subscribe((almacenes) => {
            this.almacenes = almacenes;
          });
        } else {
          this.router.navigate(['/no-permissions']);
        }
      },
      error: (err) => console.error(err),
    });
  }


  // Método para alternar entre modo de vista y edición
  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  updateFormControls(material: any): void {
    this.materialForm.patchValue(material);

    if (material.herramienta) {

      this.materialForm.addControl('ubicacion', this.fb.control(material.herramienta?.ubicacion || ''));
      this.materialForm.addControl('almacen_h', this.fb.control(material.herramienta?.id_almacen || ''));

    } else if (material.vehiculo) {
      this.materialForm.addControl('patente', this.fb.control(material.vehiculo?.patente || ''));
      this.materialForm.addControl('tipo', this.fb.control(material.vehiculo?.tipo || ''));
      this.materialForm.addControl('modelo', this.fb.control(material.vehiculo?.modelo || ''));
      this.materialForm.addControl('precio_x_hora', this.fb.control(material.vehiculo?.precio_x_hora || ''));
      this.materialForm.addControl('almacen_v', this.fb.control(material.vehiculo?.id_almacen || ''));
    }

    this.materialForm.patchValue(material);

    // Si es un vehículo, también llena los valores de los controles dinámicos
    if (material.vehiculo) {
      this.materialForm.get('patente')?.setValue(material.vehiculo?.patente || '');
      this.materialForm.get('tipo')?.setValue(material.vehiculo?.tipo || '');
      this.materialForm.get('modelo')?.setValue(material.vehiculo?.modelo || '');
      this.materialForm.get('precio_x_hora')?.setValue(material.vehiculo?.precio_x_hora || '');
      this.materialForm.get('almacen_v')?.setValue(material.vehiculo?.id_almacen || '');
    }

    if (material.herramienta) {
      this.materialForm.get('ubicacion')?.setValue(material.vehiculo?.ubicacion || '');
      this.materialForm.get('almacen_h')?.setValue(material.vehiculo?.id_almacen || '');
    }
  }

  // Método para enviar los cambios al backend
  onSubmit(): void {
    this.mensajeError = '';
    this.mensajeExito = '';
    if (this.materialForm.valid) {
      const updatedMaterial = this.materialForm.value;

      this.proveedorService.updateMaterial(this.materialId, updatedMaterial).subscribe({
        next: () => {
          this.material = { ...this.material, ...updatedMaterial };
          this.toggleEditMode();
          this.proveedorService.getMaterialById(this.materialId).subscribe({
            next: (data) => {
              this.material$.next(data);
              this.updateFormControls(data);
            },
            error: (err) => console.error(err)
          });
          this.mensajeExito = 'Los cambios se han registrado correctamente.';
        },
        error: (err) => {
          console.error('Error al actualizar el material', err);
          this.mensajeError = 'Hubo un error al registrar los cambios.';
        }
      });
    }
  }

}


