import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule} from '@angular/forms';
import { PresupuestoService } from '../../services/presupuesto/presupuesto.service';
import { ObraService } from '../../services/obra/obra.service';
import {ActivatedRoute} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import { ChatComponent } from '../chat/chat.component'
import {DataShareService} from "../../services/data-share/data-share.service";
import { HeaderComponent } from '../header/header.component';

@Component({
  standalone:true,
  selector: 'app-crear-presupuesto',
  templateUrl: './crear-presupuesto.component.html',
  imports: [
    ReactiveFormsModule,
    NgForOf,
    ChatComponent,
    HeaderComponent,
    NgIf
  ],
  styleUrls: ['./crear-presupuesto.component.scss']
})
export class CrearPresupuestoComponent implements OnInit {
  presupuestoForm!: FormGroup;
  materiales: any[] = [];
  servicios: any[] = [];
  colaboradores: any[] = [];
  id_empresa: number=0;
  obraId!: number;
  areas: any[] = [];
  clienteId!:number;

  constructor(
    private fb: FormBuilder,
    private presupuestoService: PresupuestoService,
    private obraService: ObraService,
    private route: ActivatedRoute,
    private dataShareService: DataShareService
  ) {}

  ngOnInit() {
    // @ts-ignore
    this.id_empresa = parseInt(sessionStorage.getItem('id_empresa'))

    this.route.queryParams.subscribe(params => {
      this.obraId = +params['obra_id'];
      this.dataShareService.setObraId(this.obraId); // Establecer obraId en el servicio
    });

    this.obraService.obtenerObra(this.obraId).subscribe(obra =>{
      this.clienteId = obra.cliente.id;
      this.dataShareService.setClienteId(this.clienteId);
      console.log(this.clienteId)
    });


    this.inicializarFormulario();

    this.obraService.obtenerAreasPorObra(this.obraId).subscribe((data:any[]) =>{
      this.areas = data
    });
  }

  inicializarFormulario() {
    this.presupuestoForm = this.fb.group({
      total: [null, Validators.required],
      moneda: ['', Validators.required],
      fecha_creacion: [new Date().toISOString().split('T')[0]], // Fecha actual
      observaciones: [''],
      estado: ['Nuevo'],  // Estado inicial
      aprobado: [false],
      porc_inflacion: [null, Validators.required],
      materiales: this.fb.array([]),
      servicios: this.fb.array([]),
      trabajadores: this.fb.array([])
    });
  }

  // Agregar un material al presupuesto
  agregarMaterial() {
    const materialGroup = this.fb.group({
      desc_material: ['', Validators.required],
      cantidad: [null, Validators.required],
      precio_x_unidad_medida: [null, Validators.required],
      unidad_medida: ['', Validators.required],
      id_area: [''],
      monto_linea: [0]
    });
    this.materialesFormArray.push(materialGroup);
  }

  get materialesFormArray(): FormArray {
    return this.presupuestoForm.get('materiales') as FormArray;
  }

  // Agregar un servicio al presupuesto
  agregarServicio() {
    const servicioGroup = this.fb.group({
      desc_servicio: ['', Validators.required],
      precio_x_hora: [null, Validators.required],
      horas: [null, Validators.required],
      moneda: ['', Validators.required],
      id_area: [''],
      monto_linea: [0]
    });
    this.serviciosFormArray.push(servicioGroup);
  }

  get serviciosFormArray(): FormArray {
    return this.presupuestoForm.get('servicios') as FormArray;
  }

  // Agregar un colaborador al presupuesto
  agregarTrabajador() {
    const trabajadorGroup = this.fb.group({
      puesto: ['', Validators.required],
      horas: [null, Validators.required],
      precio_x_hora: [null, Validators.required],
      moneda: ['', Validators.required],
      id_area: [''],
      monto_linea: [0]
    });
    this.trabajadoresFormArray.push(trabajadorGroup);
  }

  get trabajadoresFormArray(): FormArray {
    return this.presupuestoForm.get('trabajadores') as FormArray;
  }

  // Guardar el presupuesto completo
  guardarPresupuesto() {
    const id_usuario = Number(sessionStorage.getItem('id_usuario'));
    const id_obra = this.obraId;

    const presupuestoData = {
      ...this.presupuestoForm.value,
      id_usuario,
      id_obra
    };

    this.presupuestoService.crearPresupuesto(presupuestoData).subscribe((response: any) => {
      console.log('Presupuesto guardado:', response);
      this.presupuestoForm.reset();
    });
  }

  removerMaterial(index: number) {
    if (index > -1) {
      this.materialesFormArray.removeAt(index);
    }
  }

  removerServicio(index: number) {
    if (index > -1) {
      this.serviciosFormArray.removeAt(index);
    }
  }

  removerTrabajador(index: number) {
    if (index > -1) {
      this.trabajadoresFormArray.removeAt(index);
    }
  }

  showChat() {
    this.dataShareService.showChat();
  }
}
