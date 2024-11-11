import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CompraService } from '../../services/compra/compra.service';
import { IngresoService } from '../../services/ingresos/ingresos.service';
import { EmpresaService } from '../../services/empresa/empresa.service';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  standalone: true,
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./ingreso.component.scss']
})
export class IngresoComponent implements OnInit {
  ingresoForm: FormGroup;
  compraId: number | null = null;
  materialesDisponibles: any[] = [];
  almacenes: any[] = [];
  empresaId: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private compraService: CompraService,
    private ingresoService: IngresoService,
    private empresaService: EmpresaService
  ) {
    this.ingresoForm = this.fb.group({
      ingresos: this.fb.array([]) // FormArray para múltiples ingresos
    });
  }

  ngOnInit(): void {
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

  // Método para enviar el formulario
  onSubmit(): void {
    // Validamos que el formulario sea válido antes de enviarlo
    if (this.ingresoForm.invalid) {
      console.log('Formulario inválido');
      return;
    }

    const ingresosData = this.ingresoForm.value.ingresos;  // Extraemos los ingresos

    // Aseguramos que la estructura sea la esperada (en caso de que sea necesario agregar validaciones adicionales)
    console.log('Datos de ingresos:', ingresosData);

    // Llamamos al servicio para crear los ingresos
    this.ingresoService.crearIngresos(ingresosData).subscribe({
      next: (response: any) => {
        console.log('Ingresos registrados:', response);
      },
      error: (error: any) => {
        console.error('Error al registrar ingresos:', error);
      }
    });
  }
}
