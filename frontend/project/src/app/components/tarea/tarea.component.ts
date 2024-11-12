import { Component, OnInit } from '@angular/core';
import { TareaService } from '../../services/tarea/tarea.service'; // Ajusta la ruta del servicio
import { EmpresaService } from '../../services/empresa/empresa.service';
import { UsuarioService} from '../../services/usuarios/usuario.service'
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {ActivatedRoute} from "@angular/router"; // Ajusta la ruta del servicio

@Component({
  standalone: true,
  selector: 'app-tarea',
  templateUrl: './tarea.component.html',
  imports: [
    FormsModule,
    NgForOf
  ],
  styleUrls: ['./tarea.component.scss']
})
export class TareaComponent implements OnInit {
  // @ts-ignore
  tareaId: number;
  fechaInicio: Date | undefined;
  fechaFin: Date | undefined;
  precioTotal: number | undefined;
  // @ts-ignore
  descripcion: string;
  titulo: string | undefined;

  // Para agregar colaboradores, herramientas y materiales
  colaboradores: any[] = [];
  herramientas: any[] = [];
  materiales: any[] = [];
  vehiculos: any[] = [];

  colaboradorSeleccionado: number | undefined;
  herramientaSeleccionada: number | undefined;
  materialSeleccionado: number | undefined;
  cantidadUtilizada: number | undefined;
  cantidadNoUtilizada: number | undefined;
  empresaId:string = ''
  tarea: any;
  vehiculoSeleccionado: number | undefined;

  constructor(
    private tareaService: TareaService,
    private empresaService: EmpresaService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute  // Para obtener el ID desde la URL
  ) { }

  ngOnInit(): void {
    this.tareaId = +this.route.snapshot.paramMap.get('id')!;
    // @ts-ignore
    this.empresaId = sessionStorage.getItem('id_empresa');
    this.usuarioService.obtenerUsuariosPorEmpresa(Number(this.empresaId)).subscribe(u => this.colaboradores = u.colaboradores);
    this.empresaService.obtenerHerramientasPorEmpresa(Number(this.empresaId)).subscribe(herramientas => this.herramientas = herramientas);
    this.empresaService.listarMaterialesPorEmpresa(Number(this.empresaId)).subscribe(materiales => this.materiales = materiales);
    this.empresaService.obtenerVehiculosPorEmpresa(Number(this.empresaId)).subscribe(vehiculos => this.vehiculos = vehiculos);

    // Aquí podrías cargar los datos de una tarea específica si es que estás editando una
    // Asumimos que la tarea ya existe y la estamos editando
    this.tareaService.getTarea(this.tareaId).subscribe((tarea) => {
      this.fechaInicio = tarea.fecha_inicio;
      this.fechaFin = tarea.fecha_fin;
      this.precioTotal = tarea.precio_total;
      this.descripcion = tarea.descripcion;
      this.titulo = tarea.titulo;
    });
  }

  // Método para agregar colaborador a la tarea
  agregarColaborador() {
    if (this.colaboradorSeleccionado) {
      const colaboradorData = {
        id_tarea: this.tareaId,
        id_colaborador: this.colaboradorSeleccionado,
        estado: 'Activo',
      };
      this.tareaService.agregarColaborador(colaboradorData).subscribe((response: any) => {
        console.log('Colaborador agregado', response);
      });
    }
  }

  // Método para agregar herramienta a la tarea
  agregarHerramienta() {
    if (this.herramientaSeleccionada) {
      const herramientaData = {
        id_tarea: this.tareaId,
        id_herramienta: this.herramientaSeleccionada,
        id_vehiculo: this.vehiculoSeleccionado,
        uso_desde: this.fechaInicio,
        uso_hasta: this.fechaFin
      };
      this.tareaService.agregarHerramienta(herramientaData).subscribe((response: any) => {
        console.log('Herramienta agregada', response);
      });
    }
  }

  // Método para agregar material a la tarea
  agregarMaterial() {
    if (this.materialSeleccionado && this.cantidadUtilizada != null) {
      const materialData = {
        id_tarea: this.tareaId,
        id_material: this.materialSeleccionado,
        cant_utilizada: this.cantidadUtilizada,
        cant_no_utilizada: this.cantidadNoUtilizada
      };
      this.tareaService.agregarMaterial(materialData).subscribe((response: any) => {
        console.log('Material agregado', response);
      });
    }
  }

  // Método para actualizar la tarea
  actualizarTarea() {
    const tareaData = {
      id_area: this.tarea.id_area, // Asume que el área ya está seleccionada
      fecha_inicio: this.fechaInicio,
      fecha_fin: this.fechaFin,
      precio_total: this.precioTotal,
      id_presupuesto_servicio: this.tarea.id_presupuesto_servicio, // Asume que el presupuesto ya está seleccionado
      id_vehiculo: this.tarea.id_vehiculo, // Asume que el vehículo ya está seleccionado
      descripcion: this.descripcion,
      titulo: this.titulo
    };
    this.tareaService.actualizarTarea(this.tareaId, tareaData).subscribe((response: any) => {
      console.log('Tarea actualizada', response);
    });
  }
}
