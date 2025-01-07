import { Component, OnInit} from '@angular/core';
import { EmpresaService } from '../../services/empresa/empresa.service';
import { IngresoService } from '../../services/ingresos/ingresos.service';
import { TareaService } from '../../services/tarea/tarea.service';
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import { HeaderComponent } from '../header/header.component'
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-almacenes-empresa',
  templateUrl: './almacenes.component.html',
  imports: [
    NgForOf,
    NgIf,
    HeaderComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  standalone: true,
  styleUrls: ['./almacenes.component.scss']
})

export class AlmacenesComponent implements OnInit {
  // @ts-ignore
  idEmpresa: number;
  almacenes: any[] = [];
  id_tarea: any = null;
  tareas: any;
  tareaSeleccionada: any;

  constructor(
    private empresaService: EmpresaService,
    private ingresoService: IngresoService,
    private tareaService: TareaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // @ts-ignore
    this.idEmpresa = +this.route.snapshot.paramMap.get('id');
    if (this.idEmpresa) {
      this.cargarAlmacenes();
    }
    this.ingresoService.traerTareas(this.idEmpresa).subscribe({
      next: (data)=>{
        this.tareas =data;
      },
      error: (err) => console.error('Error al cargar las tareas:', err)
    })
  }

  cargarAlmacenes(): void {
    this.empresaService.obtenerAlmacenesConDetalles(this.idEmpresa).subscribe({
      next: (data) => {
        this.almacenes = data.almacenes;
      },
      error: (err) => console.error('Error al cargar los almacenes:', err)
    });
  }

  ingresar(id_ingreso: number): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, realizar ingreso',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ingresoService.realizarIngreso(id_ingreso).subscribe({
          next: (data) => Swal.fire('¡Éxito!', 'El ingreso fue realizado con éxito.', 'success'),
          error: (err) => Swal.fire('Error', 'Hubo un problema al realizar el ingreso.', 'error'),
        });
        window.location.reload();
      }
    });
  }

  cargarMaterialTarea(idMaterial: number, idTarea: number, idIngreso: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Estás por llevar este material a la obra seleccionada.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const datos = {
          id_tarea: idTarea,
          id_material: idMaterial,
          cant_utilizada: 0,
          cant_no_utilizada: 0,
        };

        this.tareaService.agregarMaterial(datos).subscribe({
          next: (response: any) => {
            console.log('Material agregado', response);
            Swal.fire('¡Éxito!', 'El material fue llevado a la obra.', 'success');
          },
          error: (err) => {
            console.error('Error al agregar material:', err);
            Swal.fire('Error', 'Ocurrió un problema al llevar el material a la obra.', 'error');
          },
        });

        this.ingresoService.actualizaIngreso(idIngreso).subscribe({
          next: (response: any) => {
            console.log('Ingreso actualizado', response);
          },
          error: (err) => console.error('Error al actualizar ingreso:', err),
        });
      }
    });
  }

  abrirFormularioCrearAlmacen(): void {
    // Navegar al componente de creación de almacén
    this.router.navigate(['/crear-almacen']);
  }

}
