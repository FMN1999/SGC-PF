import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PresupuestoService } from '../../services/presupuesto/presupuesto.service';
import { SubcontratacionService } from '../../services/subcontratacion/subcontratacion.service';
import {NgForOf, NgIf} from "@angular/common";
import {EmpresaService} from "../../services/empresa/empresa.service";
import {HeaderComponent} from '../header/header.component';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'presupuesto-servicio',
  templateUrl: './presupuesto-servicio.component.html',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    HeaderComponent
  ],
  standalone: true,
  styleUrls: ['./presupuesto-servicio.component.scss']
})
export class PresupuestoServicioComponent implements OnInit {
  // @ts-ignore
  subcontratacionForm: FormGroup;
  idPresupuesto: number | undefined;
  servicios_data: any;
  idObra: number | undefined;
  idUsuario = sessionStorage.getItem('id_usuario');
  mensajeSuccess: string='';
  mensajeError: string='';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private presupuestoService: PresupuestoService,
    private empresaService: EmpresaService,
    private subcontratacionService: SubcontratacionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.idPresupuesto = +this.route.snapshot.paramMap.get('idPresupuesto')!;
    this.idObra = +this.route.snapshot.paramMap.get('idObra')!;
    this.subcontratacionForm = this.fb.group({
      id_obra: [this.idObra],
      id_usuario: [this.idUsuario],
      estado: [{ value: 'Pendiente', disabled: true }],
      lineasSubcontratacion: this.fb.array([])
    });
    this.cargarDatosIniciales();
  }

  get lineasSubcontratacion(): FormArray {
    return this.subcontratacionForm.get('lineasSubcontratacion') as FormArray;
  }

  cargarDatosIniciales() {
    if (this.idPresupuesto) {
      this.presupuestoService.getServiciosPorPresupuesto(this.idPresupuesto).subscribe((servicios) => {
        setTimeout(() => {
          servicios.forEach((servicio) => {
            this.agregarLineaSubcontratacion(servicio);
          });
        });
      });
    }

    const idEmpresa = sessionStorage.getItem('id_empresa');
    if (idEmpresa) {
      this.empresaService.obtenerServiciosPorEmpresa(parseInt(idEmpresa)).subscribe({
        next: (data) => {
          setTimeout(() => {
            this.servicios_data = data;
            console.log(this.servicios_data);
          });
        }
      });
    }
  }


  agregarLineaSubcontratacion(servicio?: any) {
    const nuevaLinea = this.fb.group({
      id_presupuesto_servicio: [servicio?.id_presupuesto_servicio],
      horas: [servicio?.horas || '', [Validators.min(0)]],
      precio_x_hora: [servicio?.precio_x_hora || '', [Validators.min(0)]],
      moneda: [servicio?.moneda || ''],
      id_servicio: [servicio?.id_servicio || ''],
      desc_servicio: [servicio?.desc_servicio || ''],
      nro_contrato: [''],
      fecha_contrato: [''],
      fecha_contrato_hasta: [''],
      monto_contratacion: [{ value: 0, disabled: true }]
    });

    // Escuchar cambios en 'horas' y 'precio_x_hora' para actualizar 'monto_contratacion'
    nuevaLinea.get('horas')?.valueChanges.subscribe(() => this.calcularMontoLinea(nuevaLinea));
    nuevaLinea.get('precio_x_hora')?.valueChanges.subscribe(() => this.calcularMontoLinea(nuevaLinea));

    this.lineasSubcontratacion.push(nuevaLinea);
  }

  calcularMontoLinea(linea: FormGroup) {
    const horas = linea.get('horas')?.value || 0;
    const precioXHora = linea.get('precio_x_hora')?.value || 0;
    const monto = horas * precioXHora;
    linea.get('monto_contratacion')?.setValue(monto, { emitEvent: false });
  }


  onSubmit() {
    if (this.subcontratacionForm.invalid) {
      this.mensajeError = 'Por favor, complete todos los campos requeridos.';
      this.mensajeSuccess = '';
      return;
    }

    const formValues = this.subcontratacionForm.value;
    const lineasSubcontratacion = formValues.lineasSubcontratacion;

    this.crearSubcontratacion(lineasSubcontratacion, formValues);
  }

  crearSubcontratacion(lineas: any[], formValues: any) {
    const nuevaSubcontratacion = {
      id_obra: this.idObra,
      id_usuario: this.idUsuario,
      estado: 'Pendiente',
      lineas_subcontratacion: lineas.map(linea => ({
        id_presupuesto_servicio: linea.id_presupuesto_servicio,
        horas: linea.horas,
        id_servicio: linea.id_servicio,
        precio_x_hora: linea.precio_x_hora,
        moneda: linea.moneda,
        desc_servicio: linea.desc_servicio,
        nro_contrato: linea.nro_contrato,
        fecha_contrato: linea.fecha_contrato,
        fecha_contrato_hasta: linea.fecha_contrato_hasta,
        monto_contratacion: linea.monto_contratacion
      }))
    };

    this.subcontratacionService.crearSubcontratacion(nuevaSubcontratacion).subscribe({
      next: () => {
        this.mensajeSuccess = '¡Contratación efectuada con éxito!';
        this.mensajeError = '';
        this.subcontratacionForm.reset(); // Opcional: reinicia el formulario.
        console.log('Subcontratación creada con éxito');
      },
      error: (error: any) => {
        this.mensajeError = 'Hubo un error al procesar la contratación. Intente nuevamente.';
        this.mensajeSuccess = '';
        console.error('Error al crear la subcontratación:', error);
      }
    });
  }

  eliminarLineaSubcontratacion(index: number) {
    this.lineasSubcontratacion.removeAt(index);
    this.cdr.detectChanges(); // Asegura que Angular detecte los cambios
  }
}

