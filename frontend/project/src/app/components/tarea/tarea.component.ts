import { Component, OnInit } from '@angular/core';
import { TareaService } from '../../services/tarea/tarea.service'; // Ajusta la ruta del servicio
import { EmpresaService } from '../../services/empresa/empresa.service';
import { UsuarioService} from '../../services/usuarios/usuario.service'
import { AuthService} from '../../services/auth/auth.service';
import { DataShareService} from '../../services/data-share/data-share.service';
import {FormsModule} from "@angular/forms";
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router"; // Ajusta la ruta del servicio
import {HeaderComponent} from '../header/header.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.component.html',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    DatePipe,
    CurrencyPipe,
    HeaderComponent
  ],
  standalone: true,
  styleUrls: ['./tarea.component.scss']
})
export class TareaComponent implements OnInit {
  tareaId: number = 0;
  fechaInicio: Date | undefined;
  fechaFin: Date | undefined;
  usoDesde: Date | undefined;
  usoHasta: Date | undefined;
  precioTotal: number | undefined;
  descripcion: string = '';
  titulo: string | undefined;
  modoEdicion: boolean = false;

  colaboradoresTarea: any[] = [];
  herramientasTarea: any[] = [];
  materialesTarea: any[] = [];
  colaboradores: any[] = [];
  herramientas: any[] = [];
  materiales: any[] = [];
  vehiculos: any[] = [];

  colaboradorSeleccionado: number | undefined;
  herramientaSeleccionada: number | undefined;
  materialSeleccionado: number | undefined;
  cantidadUtilizada: number | undefined;
  cantidadNoUtilizada: number | undefined;
  vehiculoSeleccionado: number | undefined;
  empresaId: string = '';
  tarea: any;
  id_vehiculo: any;
  vehiculo:any;
  cant_dias: any;
  isLoggedIn: boolean = false;
  editandoCantDias: { [colaboradorId: number]: boolean } = {}; // Almacena el estado de edición de cada colaborador
  cantDiasTemp: { [colaboradorId: number]: number } = {}; // Almacena el valor temporal de cant_dias para cada colaborador


  constructor(
    private tareaService: TareaService,
    private empresaService: EmpresaService,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    protected dataShare: DataShareService,
    private router: Router,
    private titleService: Title,
    private route: ActivatedRoute  // Para obtener el ID desde la URL
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Gestión de Tarea');
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (!this.isLoggedIn) {
        this.router.navigate(['/no-permissions']);
      }
      this.initLogueado();
    });
  }

  initLogueado(): void {
    // @ts-ignore
    const id_user = +sessionStorage.getItem('id_usuario');
    this.authService.cargarPermisos(id_user).subscribe({});

    this.tareaId = +this.route.snapshot.paramMap.get('id')!;
    this.empresaId = sessionStorage.getItem('id_empresa') || '';

    this.tareaService.getTarea(this.tareaId).subscribe((tarea) => {

      const id_emp = tarea.id_empresa;
      if (Number(this.empresaId) !== id_emp){
        this.router.navigate(['/no-permissions']);
      }
      // @ts-ignore
      const id_user = +sessionStorage.getItem('id_usuario');
      const tarea_user = tarea.id_cliente;
      const es_cliente = sessionStorage.getItem('tipo');

      if (es_cliente === 'CL' && id_user!== tarea_user){
        this.router.navigate(['/no-permissions']);
      }
      this.fechaInicio = tarea.fecha_inicio;
      this.fechaFin = tarea.fecha_fin;
      this.precioTotal = tarea.precio_total;
      this.descripcion = tarea.descripcion;
      this.titulo = tarea.titulo;
      this.id_vehiculo=tarea.id_vehiculo;
      this.vehiculo = tarea.vehiculo;
      this.vehiculoSeleccionado = tarea.id_vehiculo;
    });
    this.cargarDatosRelacionados();
    this.usuarioService.obtenerUsuariosPorEmpresa(Number(this.empresaId)).subscribe(u => this.colaboradores = u.colaboradores);
    this.empresaService.obtenerHerramientasPorEmpresa(Number(this.empresaId)).subscribe(herramientas => this.herramientas = herramientas);
    this.empresaService.listarMaterialesPorEmpresa(Number(this.empresaId)).subscribe(materiales => this.materiales = materiales);
    this.empresaService.obtenerVehiculosPorEmpresa(Number(this.empresaId)).subscribe(vehiculos => this.vehiculos = vehiculos);

  }

  cargarDatosRelacionados() {
    this.tareaService.obtenerColaboradoresTarea(Number(this.tareaId)).subscribe(data => this.colaboradoresTarea = data);
    this.tareaService.obtenerHerramientasTarea(Number(this.tareaId)).subscribe(data => this.herramientasTarea = data);
    this.tareaService.obtenerMaterialesTarea(Number(this.tareaId)).subscribe(data => this.materialesTarea = data);
  }

  habilitarEdicion() {
    this.modoEdicion = true;
  }

  cancelarEdicion() {
    this.modoEdicion = false;
  }

  // Método para agregar colaborador a la tarea
  agregarColaborador() {
    if (this.colaboradorSeleccionado) {
      const colaboradorData = {
        id_tarea: this.tareaId,
        id_colaborador: this.colaboradorSeleccionado,
        estado: 'Activo',
        cant_dias:this.cant_dias
      };
      this.tareaService.agregarColaborador(colaboradorData).subscribe((response: any) => {
        console.log('Colaborador agregado', response);
      });
    }
    window.location.reload();
  }

  // Método para agregar herramienta a la tarea
  agregarHerramienta() {
    if (this.herramientaSeleccionada) {
      const herramientaData = {
        id_tarea: this.tareaId,
        id_herramienta: this.herramientaSeleccionada,
        uso_desde: this.usoDesde,
        uso_hasta: this.usoHasta
      };
      this.tareaService.agregarHerramienta(herramientaData).subscribe((response: any) => {
        console.log('Herramienta agregada', response);
      });
    }
    window.location.reload();
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
    window.location.reload();
  }

  // Método para actualizar la tarea
  actualizarTarea() {
    const tareaData = {
      id_vehiculo: this.vehiculoSeleccionado,
      vehiculo: this.vehiculo,
      fecha_inicio: this.fechaInicio,
      fecha_fin: this.fechaFin,
      precio_total: this.precioTotal,
      descripcion: this.descripcion,
      titulo: this.titulo
    };
    this.tareaService.actualizarTarea(this.tareaId, tareaData).subscribe((response: any) => {

      this.modoEdicion = false;
    });
    window.location.reload();
  }

  eliminarColaborador(colaboradorId: number): void {
    this.tareaService.eliminarColaboradorTarea(colaboradorId).subscribe(() => {
      this.colaboradoresTarea = this.colaboradoresTarea.filter(c => c.id !== colaboradorId);
    });
  }

  eliminarHerramienta(herramientaId: number): void {
    this.tareaService.eliminarHerramientaTarea(herramientaId).subscribe(() => {
      this.herramientasTarea = this.herramientasTarea.filter(h => h.id !== herramientaId);
    });
  }

  eliminarMaterial(materialId: number): void {
    this.tareaService.eliminarMaterialTarea(materialId).subscribe(() => {
      this.materialesTarea = this.materialesTarea.filter(m => m.id !== materialId);
    });
  }

  habilitarEdicionCantDias(colaboradorId: number, cantDiasActual: number): void {
    this.editandoCantDias[colaboradorId] = true;
    this.cantDiasTemp[colaboradorId] = cantDiasActual;
  }

  // Método para guardar la nueva cantidad de días
  guardarCantDias(colaboradorId: number): void {
    const cantDias = this.cantDiasTemp[colaboradorId];
    this.tareaService.actualizarCantDias(colaboradorId, cantDias, this.tareaId).subscribe(() => {
      // Actualizamos la lista de colaboradores con el nuevo valor de cant_dias
      const colaborador = this.colaboradoresTarea.find(c => c.id === colaboradorId);
      if (colaborador) colaborador.cant_dias = cantDias;
      this.editandoCantDias[colaboradorId] = false; // Desactivar edición
    });
  }

  cancelarEdicionCantDias(colaboradorId: number): void {
    this.editandoCantDias[colaboradorId] = false;
    delete this.cantDiasTemp[colaboradorId]; // Elimina el cambio temporal
  }
}

