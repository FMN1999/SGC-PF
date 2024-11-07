import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PresupuestoService } from '../../services/presupuesto/presupuesto.service';
import { SubcontratacionService } from '../../services/subcontratacion/subcontratacion.service';
import {NgForOf, NgIf} from "@angular/common";
import {EmpresaService} from "../../services/empresa/empresa.service";


@Component({
  standalone: true,
  selector: 'presupuesto-servicio',
  templateUrl: './presupuesto-servicio.component.html',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./presupuesto-servicio.component.scss']
})
export class PresupuestoServicioComponent implements OnInit {
  // @ts-ignore
  subcontratacionForm: FormGroup;
  idPresupuesto: number | undefined;
  servicios_data: any;
  idObra: number | undefined;
  idUsuario = sessionStorage.getItem('id_usuario');

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private presupuestoService: PresupuestoService,
    private empresaService: EmpresaService,
    private subcontratacionService: SubcontratacionService,
    private router: Router
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
      this.presupuestoService.getServiciosPorPresupuesto(this.idPresupuesto)
        .subscribe((servicios) => {
          servicios.forEach((servicio) => {
            this.agregarLineaSubcontratacion(servicio);
          });
        });
    }

    const idEmpresa = sessionStorage.getItem('id_empresa');
    if (idEmpresa) {
      this.empresaService.obtenerServiciosPorEmpresa(parseInt(idEmpresa)).subscribe({
        next: (data) => {
          this.servicios_data = data;
          console.log(this.servicios_data);
        }
      });
    }
  }

  agregarLineaSubcontratacion(servicio?: any) {
    const nuevaLinea = this.fb.group({
      id_presupuesto_servicio:[servicio?.id_presupuesto_servicio],
      horas: [servicio?.horas || ''],
      precio_x_hora: [servicio?.precio_x_hora || ''],
      moneda: [servicio?.moneda || ''],
      id_servicio: [servicio?.id_servicio || ''],
      desc_servicio: [servicio?.desc_servicio || ''],
      nro_contrato: [''],
      fecha_contrato: [''],
      fecha_contrato_hasta: [''],
      monto_contratacion: ['']
    });
    this.lineasSubcontratacion.push(nuevaLinea);
  }

  eliminarLineaSubcontratacion(index: number) {
    this.lineasSubcontratacion.removeAt(index);
  }

  onSubmit() {
    const formValues = this.subcontratacionForm.value;
    const lineasSubcontratacion = formValues.lineasSubcontratacion;
    this.crearSubcontratacion(lineasSubcontratacion, formValues);
    console.log('Creado')
    ///this.router.navigate(['/subcontrataciones']).then(() => {});
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
      next: (response: any) => {
        console.log('Subcontratación creada con éxito:', response);
      },
      error: (error: any) => {
        console.error('Error al crear la subcontratación:', error);
      }
    });
  }
}

