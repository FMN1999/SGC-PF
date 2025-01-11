import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule} from '@angular/forms';
import { PresupuestoService } from '../../services/presupuesto/presupuesto.service';
import { ObraService } from '../../services/obra/obra.service';
import { AuthService } from '../../services/auth/auth.service';
import {ActivatedRoute, Router} from "@angular/router";
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
  mensajeExito: string='';
  isLoggedIn: boolean=false;

  constructor(
    private fb: FormBuilder,
    private presupuestoService: PresupuestoService,
    private obraService: ObraService,
    private route: ActivatedRoute,
    private dataShareService: DataShareService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    if (!this.isLoggedIn) {
      this.router.navigate(['/no-permissions']);
    }

    if (!this.dataShareService.permiso4) {
      this.router.navigate(['/no-permissions']);
    }
    // @ts-ignore
    this.id_empresa = parseInt(sessionStorage.getItem('id_empresa'))

    this.route.queryParams.subscribe(params => {
      this.obraId = +params['obra_id'];
      this.dataShareService.setObraId(this.obraId); // Establecer obraId en el servicio
    });

    this.obraService.obtenerObra(this.obraId).subscribe(obra =>{
      this.clienteId = obra.cliente.id;
      this.dataShareService.setClienteId(this.clienteId);

    });


    this.inicializarFormulario();
    this.agregarListeners();

    this.obraService.obtenerAreasPorObra(this.obraId).subscribe((data:any[]) =>{
      this.areas = data
    });
  }

  inicializarFormulario() {
    this.presupuestoForm = this.fb.group({
      total: [null, Validators.required],
      moneda: ['ARS', Validators.required],
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

  agregarListeners() {
    // Escuchar cambios en los materiales
    this.materialesFormArray.valueChanges.subscribe(() => this.actualizarTotal());
    this.serviciosFormArray.valueChanges.subscribe(() => this.actualizarTotal());
    this.trabajadoresFormArray.valueChanges.subscribe(() => this.actualizarTotal());

    // Escuchar cambios en el porcentaje de inflación
    this.presupuestoForm.get('porc_inflacion')!.valueChanges.subscribe(() => this.actualizarTotal());
  }

  // Agregar un material al presupuesto
  agregarMaterial() {
    const materialGroup = this.fb.group({
      desc_material: ['', Validators.required],
      cantidad: [0, Validators.required],
      precio_x_unidad_medida: [0, Validators.required],
      unidad_medida: ['', Validators.required],
      monto_linea: [0],
      id_area: [''],
    });

    // Calcular monto_linea automáticamente
    materialGroup.get('cantidad')!.valueChanges.subscribe(() => this.calcularMontoLinea(materialGroup));
    materialGroup.get('precio_x_unidad_medida')!.valueChanges.subscribe(() => this.calcularMontoLinea(materialGroup));

    this.materialesFormArray.push(materialGroup);
  }

  get materialesFormArray(): FormArray {
    return this.presupuestoForm.get('materiales') as FormArray;
  }

  // Agregar un servicio al presupuesto
  agregarServicio() {
    const servicioGroup = this.fb.group({
      desc_servicio: ['', Validators.required],
      precio_x_hora: [0, Validators.required],
      horas: [0, Validators.required],
      monto_linea: [0],
      id_area: [''],
      moneda: ['ARS', Validators.required],
    });

    // Calcular monto_linea automáticamente
    servicioGroup.get('horas')!.valueChanges.subscribe(() => this.calcularMontoLinea(servicioGroup));
    servicioGroup.get('precio_x_hora')!.valueChanges.subscribe(() => this.calcularMontoLinea(servicioGroup));

    this.serviciosFormArray.push(servicioGroup);
  }

  get serviciosFormArray(): FormArray {
    return this.presupuestoForm.get('servicios') as FormArray;
  }

  // Agregar un colaborador al presupuesto
  agregarTrabajador() {
    const trabajadorGroup = this.fb.group({
      puesto: ['', Validators.required],
      horas: [0, Validators.required],
      precio_x_hora: [0, Validators.required],
      monto_linea: [0],
      id_area: [''],
      moneda: ['ARS', Validators.required],
    });

    // Calcular monto_linea automáticamente
    trabajadorGroup.get('horas')!.valueChanges.subscribe(() => this.calcularMontoLinea(trabajadorGroup));
    trabajadorGroup.get('precio_x_hora')!.valueChanges.subscribe(() => this.calcularMontoLinea(trabajadorGroup));

    this.trabajadoresFormArray.push(trabajadorGroup);
  }

  calcularMontoLinea(group: FormGroup) {
    const cantidad = group.get('cantidad')?.value || group.get('horas')?.value || 0;
    const precio = group.get('precio_x_unidad_medida')?.value || group.get('precio_x_hora')?.value || 0;
    const monto = cantidad * precio;

    group.get('monto_linea')?.setValue(monto, { emitEvent: false });
  }


  actualizarTotal() {
    const materialesTotal = this.sumarMontos(this.materialesFormArray);
    const serviciosTotal = this.sumarMontos(this.serviciosFormArray);
    const trabajadoresTotal = this.sumarMontos(this.trabajadoresFormArray);

    let total = materialesTotal + serviciosTotal + trabajadoresTotal;
    const porcInflacion = this.presupuestoForm.get('porc_inflacion')!.value || 0;

    if (porcInflacion > 0) {
      total += total * (porcInflacion / 100);
    }

    this.presupuestoForm.get('total')!.setValue(total, { emitEvent: false });
  }

  sumarMontos(formArray: FormArray): number {
    return formArray.controls.reduce((sum, group) => {
      return sum + (group.get('monto_linea')?.value || 0);
    }, 0);
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
      this.mensajeExito = '¡El presupuesto se ha creado exitosamente!';
      this.presupuestoForm.reset();
      setTimeout(() => {
        this.mensajeExito = '';
      }, 100000);
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
