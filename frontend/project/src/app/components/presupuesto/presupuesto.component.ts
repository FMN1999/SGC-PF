import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule} from '@angular/forms';
import { PresupuestoService } from '../../services/presupuesto/presupuesto.service';
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from '@angular/router';
import {HeaderComponent} from '../header/header.component';

@Component({
  selector: 'app-presupuesto',
  templateUrl: './presupuesto.component.html',
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    HeaderComponent
  ],
  standalone: true,
  styleUrls: ['./presupuesto.component.scss']
})
export class PresupuestoComponent implements OnInit {
  // @ts-ignore
  presupuestoForm: FormGroup;
  presupuesto: any; // Presupuesto cargado desde el backend
  private idPresupuesto: number = 0;
  protected materiales_data: any[] = [];
  protected servicios_data: any[] = [];
  protected trabajadores_data: any[] = [];
  protected idEditar: boolean = false;
  tareas_data: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private presupuestoService: PresupuestoService,
    private router: Router,

  ) {}

  ngOnInit(): void {
    this.idPresupuesto = +this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.cargarDatosPresupuesto();
  }
  initForm() {
    this.presupuestoForm = this.fb.group({
      total: ['', Validators.required],
      moneda: ['', Validators.required],
      observaciones: [''],
      porc_inflacion: [0, Validators.min(0)],
      materiales: this.fb.array([]),
      servicios: this.fb.array([]),
      trabajadores: this.fb.array([])
    });
  }

  editar(){
    this.idEditar=!this.idEditar
  }

  cargarDatosPresupuesto() {
    // Aquí cargarías los datos del presupuesto desde el backend
    this.presupuestoService.getPresupuestoDetalles(this.idPresupuesto).subscribe(data => {
      this.presupuesto = data;

      // @ts-ignore
      this.presupuestoForm.patchValue({
        total: this.presupuesto.total,
        moneda: this.presupuesto.moneda,
        observaciones: this.presupuesto.observaciones,
        porc_inflacion: this.presupuesto.porc_inflacion
      });
      this.materiales_data = this.presupuesto.materiales
      this.servicios_data = this.presupuesto.servicios
      this.trabajadores_data = this.presupuesto.trabajadores
      this.tareas_data = this.presupuesto.tareas

      // Rellenar materiales, servicios y trabajadores
      this.presupuesto.materiales.forEach((material: null | undefined) => this.addMaterial(material));
      this.presupuesto.servicios.forEach((servicio: null | undefined) => this.addServicio(servicio));
      this.presupuesto.trabajadores.forEach((trabajador: null | undefined) => this.addTrabajador(trabajador));
    });
  }


  get materiales(): FormArray {
    // @ts-ignore
    return this.presupuestoForm.get('materiales') as FormArray;
  }

  get servicios(): FormArray {
    return this.presupuestoForm.get('servicios') as FormArray;
  }

  get trabajadores(): FormArray {
    return this.presupuestoForm.get('trabajadores') as FormArray;
  }

  addMaterial(material = null) {
    // @ts-ignore
    const materialGroup = this.fb.group({
      // @ts-ignore
      id: [material ? material.id : null],
      // @ts-ignore
      desc_material: [material ? material.desc_material : '', Validators.required],
      // @ts-ignore
      cantidad: [material ? material.cantidad : 1, Validators.required],
      // @ts-ignore
      unidad_medida: [material ? material.unidad_medida : '', Validators.required],
      // @ts-ignore
      precio_x_unidad_medida: [material ? material.precio_x_unidad_medida : 0, Validators.required]
    });
    this.materiales.push(materialGroup);
  }

  addServicio(servicio = null) {
    // @ts-ignore
    const servicioGroup = this.fb.group({
      // @ts-ignore
      id: [servicio ? servicio.id : null],
      // @ts-ignore
      desc_servicio: [servicio ? servicio.desc_servicio : '', Validators.required],
      // @ts-ignore
      horas: [servicio ? servicio.horas : 1, Validators.required],
      // @ts-ignore
      precio_x_hora: [servicio ? servicio.precio_x_hora : 0, Validators.required]
    });
    this.servicios.push(servicioGroup);
  }

  addTrabajador(trabajador = null) {
    const trabajadorGroup = this.fb.group({
      // @ts-ignore
      id: [trabajador ? trabajador.id : null],
      // @ts-ignore
      puesto: [trabajador ? trabajador.puesto : '', Validators.required],
      // @ts-ignore
      horas: [trabajador ? trabajador.horas : 1, Validators.required],
      // @ts-ignore
      precio_x_hora: [trabajador ? trabajador.precio_x_hora : 0, Validators.required]
    });
    this.trabajadores.push(trabajadorGroup);
  }

  agregarMaterial(): void {
    const materialForm = this.fb.group({
      desc_material: ['', Validators.required],
      cantidad: [0, Validators.required],
      unidad_medida: ['', Validators.required],
      precio_x_unidad_medida: [0, Validators.required]
    });
    this.materiales.push(materialForm);
  }

  agregarServicio(): void {
    const servicioForm = this.fb.group({
      desc_servicio: ['', Validators.required],
      horas: [0, Validators.required],
      precio_x_hora: [0, Validators.required]
    });
    this.servicios.push(servicioForm);
  }

  agregarTrabajador(): void {
    const trabajadorForm = this.fb.group({
      puesto: ['', Validators.required],
      horas: [0, Validators.required],
      precio_x_hora: [0, Validators.required]
    });
    this.trabajadores.push(trabajadorForm);
  }

  eliminarMaterial(index: number, id: number | null): void {
    if (id) {
      this.presupuestoService.eliminarMaterial(id).subscribe(() => {
        this.materiales.removeAt(index);
      });
    } else {
      this.materiales.removeAt(index);
    }
  }

  eliminarServicio(index: number, id: number | null): void {
    if (id) {
      this.presupuestoService.eliminarServicio(id).subscribe(() => {
        this.servicios.removeAt(index);
      });
    } else {
      this.servicios.removeAt(index);
    }
  }

  eliminarTrabajador(index: number, id: number | null): void {
    if (id) {
      this.presupuestoService.eliminarTrabajador(id).subscribe(() => {
        this.trabajadores.removeAt(index);
      });
    } else {
      this.trabajadores.removeAt(index);
    }
  }

  onSubmit() {
    if (this.presupuestoForm.invalid) return;

    const updatedPresupuesto = this.presupuestoForm.value;
    this.presupuestoService.actualizarPresupuesto(this.presupuesto.id, updatedPresupuesto)
      .subscribe((response: any) => {
        console.log('Presupuesto actualizado:', response);
        // Realiza cualquier acción adicional tras la actualización
      });
  }
  solicitarMateriales() {
    this.router.navigate(['/solicitud-compra', { idPresupuesto: this.presupuesto.id, idObra: this.presupuesto.id_obra }]);
  }

  solicitarServicios() {
    this.router.navigate(['/solicitud-servicio', { idPresupuesto: this.presupuesto.id, idObra: this.presupuesto.id_obra }]);
  }

  crearTarea() {
    this.router.navigate(['/crear-tarea', { idPresupuesto: this.presupuesto.id, idObra: this.presupuesto.id_obra }]);
  }

  aprobarPresupuesto() {
    const payload = { estado: 'Aprobado', aprobado: true };
    this.presupuestoService.actualizarPresupuesto(this.idPresupuesto, payload)
      .subscribe(() => {
        this.presupuesto.estado = 'Aprobado';
        this.presupuesto.aprobado = true;
        window.location.reload();
      });
  }

  rechazarPresupuesto() {
    const payload = { estado: 'Rechazado', aprobado: false };
    this.presupuestoService.actualizaPresupuesto(this.idPresupuesto, payload)
      .subscribe(() => {
        this.presupuesto.estado = 'Rechazado';
        this.presupuesto.aprobado = false;
        window.location.reload();
      });
  }

}
