import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompraService } from '../../services/compra/compra.service';
import { AuthService } from '../../services/auth/auth.service';
import { DataShareService } from '../../services/data-share/data-share.service';
import { IngresoService } from '../../services/ingresos/ingresos.service';
import { EmpresaService } from '../../services/empresa/empresa.service';
import {NgForOf, NgIf} from "@angular/common";
import{HeaderComponent} from '../header/header.component';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    HeaderComponent
  ],
  standalone: true,
  styleUrls: ['./ingreso.component.scss']
})
export class IngresoComponent implements OnInit {
  ingresoForm: FormGroup;
  compraId: number | null = null;
  materialesDisponibles: any[] = [];
  almacenes: any[] = [];
  empresaId: string = '';
  // @ts-ignore
  mensajeError: string;
  // @ts-ignore
  mensajeExito: string;
  isLoggedIn: boolean= false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private compraService: CompraService,
    private ingresoService: IngresoService,
    private empresaService: EmpresaService,
    private authService: AuthService,
    private dataShare: DataShareService,
    private router: Router
  ) {
    this.ingresoForm = this.fb.group({
      ingresos: this.fb.array([]) // FormArray para múltiples ingresos
    });
  }

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    if (!this.isLoggedIn) {
      this.router.navigate(['/no-permissions']);
    }

    if (!this.dataShare.permiso15) {
      this.router.navigate(['/no-permissions']);
    }

    this.compraId = Number(this.route.snapshot.paramMap.get('id'));
    // @ts-ignore
    this.empresaId = sessionStorage.getItem('id_empresa')
    if (this.compraId) {
      this.cargarDatosDeCompra(this.compraId);
    }
    if (this.empresaId){
      this.empresaService.obtenerAlmacenesPorEmpresa(Number(this.empresaId)).subscribe((almacenes)=>{
        this.almacenes=almacenes;
      })
    }
    this.ingresoForm = this.fb.group({
      ingresos: this.fb.array([]),
      materialesDisponibles: this.materialesDisponibles// FormArray para múltiples ingresos
    });
  }

  particionar(id_material: number, material: string, unidadMedida: string): void {
    this.nuevoIngreso(id_material, material, 0, unidadMedida);
  }

  // Método para eliminar un ingreso del FormArray

  eliminarIngreso(index: number): void {
    this.ingresos.removeAt(index);
  }

  get ingresos(): FormArray {
    return this.ingresoForm.get('ingresos') as FormArray;
  }

  cargarDatosDeCompra(compraId: number): void {
    this.compraService.obtenerCompra(compraId).subscribe((compra) => {

      // Guarda los materiales en la variable `materialesDisponibles`
      this.materialesDisponibles = compra.lineas_compra.map((linea: any) => ({
        id_material: linea.id_material,
        material: linea.material,
        cantidad: linea.cantidad,
        unidad_medida: linea.unidad_medida,
        id_compra: this.compraId
      }));
      compra.lineas_compra.forEach((linea: any) => {
        this.nuevoIngreso(linea.id_material, linea.material, linea.cantidad, linea.unidad_medida);
      });
    });
  }

  nuevoIngreso(id_material:number, material: string, cantidad: number, unidadMedida: string): void {
    const ingresosFormArray = this.ingresoForm.get('ingresos') as FormArray;
    const ingresoFormGroup = this.fb.group({
      id_material:[id_material],
      material: [material],
      cantidad: [cantidad],
      unidadMedida: [unidadMedida],
      fecha: [null],
      id_almacen:[null],
      fechaReal: [null],
      realizado: [false],
      almacen: [null],
      id_compra: this.compraId,
      en_obra: [false]
    });
    ingresosFormArray.push(ingresoFormGroup);
  }

  onSubmit(): void {
    // Reiniciar los mensajes al iniciar la validación
    this.mensajeError = '';
    this.mensajeExito = '';

    const ingresosData = this.ingresoForm.value.ingresos;

    // Validar que cada ingreso tenga al menos un almacén o esté marcado como "en obra"
    const esValido = ingresosData.every(
      (ingreso: any) => (ingreso.id_almacen && !ingreso.en_obra) || (!ingreso.id_almacen && ingreso.en_obra)
    );

    if (!esValido) {
      this.mensajeError = 'Elija entre indicar un Almacén o llevarlo a la obra.';
    } else {
      // Enviar los datos al servicio
      this.ingresoService.crearIngresos(ingresosData).subscribe({
        next: (response: any) => {
          this.mensajeExito = 'Los ingresos se han registrado correctamente.';
        },
        error: (error: any) => {
          console.error('Error al registrar ingresos:', error);
          this.mensajeError = 'Hubo un error al registrar los ingresos. Intente nuevamente.';
        }
      });
    }
  }

}
