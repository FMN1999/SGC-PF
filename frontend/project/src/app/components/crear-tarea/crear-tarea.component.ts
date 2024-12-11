import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { TareaService } from '../../services/tarea/tarea.service';
import { PresupuestoService } from '../../services/presupuesto/presupuesto.service';
import { ObraService } from '../../services/obra/obra.service';
import { EmpresaService } from '../../services/empresa/empresa.service';
import {ActivatedRoute, Router} from "@angular/router";
import {NgForOf} from "@angular/common";
import { HeaderComponent } from '../header/header.component';


@Component({
  standalone: true,
  selector: 'app-crear-tarea',
  templateUrl: './crear-tarea.component.html',
  imports: [
    ReactiveFormsModule,
    NgForOf,
    HeaderComponent
  ],
  styleUrls: ['./crear-tarea.component.scss']
})
export class CrearTareaComponent implements OnInit {
  tareaForm: FormGroup;
  presupuestosServicio: any[] = [];
  areas: any[] = [];
  vehiculos: any[] = [];
  idPresupuesto: number | undefined;
  idObra: number | undefined;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private tareaService: TareaService,
    private presupuestoService: PresupuestoService,
    private obraService: ObraService,
    private empresaService: EmpresaService,
    private router: Router
  ) {
    this.tareaForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      id_presupuesto_servicio: [null],
      id_area: [null],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      precio_total: [null, Validators.required],
      id_vehiculo: [null]
    });
  }

  ngOnInit(): void {
    this.idPresupuesto = +this.route.snapshot.paramMap.get('idPresupuesto')!;
    this.idObra = +this.route.snapshot.paramMap.get('idObra')!;
    this.cargarOpciones();
  }

  cargarOpciones(): void {
    if (this.idPresupuesto) {
      this.presupuestoService.getServiciosPorPresupuesto(this.idPresupuesto).subscribe(data => {
        this.presupuestosServicio = data;
      });
    }
    if (this.idObra) {
      this.obraService.obtenerAreasPorObra(this.idObra).subscribe(data => {
        this.areas = data;
      });
    }
    const idEmpresa = sessionStorage.getItem('id_empresa');
    if (idEmpresa) {
      this.empresaService.obtenerVehiculosPorEmpresa(parseInt(idEmpresa)).subscribe(data => {
        this.vehiculos = data;
      });
    }
  }

  onSubmit(): void {
    if (this.tareaForm.valid) {
      this.tareaService.crearTarea(this.tareaForm.value).subscribe({
        next: (response) => {
          console.log('Tarea creada con éxito:', response);
        },
        error: (error) => {
          console.error('Error al crear la tarea:', error);
        }
      });
      this.router.navigate(['/tareas'])
    } else {
      console.log('Formulario inválido');
    }
  }
}

