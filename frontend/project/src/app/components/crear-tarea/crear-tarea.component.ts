import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { TareaService } from '../../services/tarea/tarea.service';
import { AuthService } from '../../services/auth/auth.service';
import { DataShareService } from '../../services/data-share/data-share.service';
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
  isLoggedIn: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private tareaService: TareaService,
    private presupuestoService: PresupuestoService,
    private obraService: ObraService,
    private empresaService: EmpresaService,
    private router: Router,
    private authService: AuthService,
    private dataShare: DataShareService
  ) {
    this.tareaForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      id_presupuesto_servicio: [null, Validators.required],
      id_area: [null],
      fecha_inicio: [''],
      fecha_fin: [''],
      precio_total: [null],
      id_vehiculo: [null]
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

    if (!this.dataShare.permiso1) {
      this.router.navigate(['/no-permissions']);
    }

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
          this.router.navigate(['/tareas'])
        },
        error: (error) => {
          console.error('Error al crear la tarea:', error);
        }
      });
    } else {
      console.log('Formulario inválido');
    }
  }
}

