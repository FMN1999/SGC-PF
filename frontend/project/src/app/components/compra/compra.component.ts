import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { CompraService } from '../../services/compra/compra.service';
import { PagoService } from '../../services/pago/pago.service'
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import { HeaderComponent } from '../header/header.component';
import {DataShareService} from "../../services/data-share/data-share.service";
import {AuthService} from "../../services/auth/auth.service";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  imports: [
    NgIf,
    NgForOf,
    DatePipe,
    HeaderComponent,
    CurrencyPipe
  ],
  standalone: true,
  styleUrls: ['./compra.component.scss']
})
export class CompraComponent implements OnInit {
  compra: any;
  estadoActual: string = '';
  id_usuario:string='';
  generarIngresoHabilitado: boolean = false;
  isLoggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private compraService: CompraService,
    private pagoService: PagoService,
    private router: Router,
    protected dataShare: DataShareService,
    private authService: AuthService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Gestión de compra'); // Ajusta el nombre dinámicamente
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (!this.isLoggedIn) {
        this.router.navigate(['/no-permissions']);
      }
    });
    this.initLogueado();
  }

  initLogueado(): void {
    // @ts-ignore
    const id_user = +sessionStorage.getItem('id_usuario');

    // @ts-ignore
    this.id_usuario = sessionStorage.getItem('id_usuario');
    const compraId = Number(this.route.snapshot.paramMap.get('id'));
    this.obtenerCompra(compraId);

    const idEmpresa = this.compra.id_empresa;
    // @ts-ignore
    const empresa_id = +sessionStorage.getItem('id_empresa');
    this.authService.cargarPermisos(id_user).subscribe(() => {
      if (idEmpresa === empresa_id && (this.dataShare.permiso12 || this.dataShare.permiso15|| this.dataShare.permiso13 || this.dataShare.permiso3 || this.dataShare.permiso2)) {
        this.verificarIngresos(compraId);
      }
      else {
        this.router.navigate(['/no-permissions']);
      }
    });
  }

  obtenerCompra(compraId: number): void {
    this.compraService.obtenerCompra(compraId).subscribe((data) => {
      this.compra = data;
      this.estadoActual = data.estado;
    });
  }

  obtenerBotones(): string[] {
    const secuenciaEstados = {
      'Pendiente': ['Rechazar', 'Confirmar'],
      'Confirmado': ['Cancelar', 'Pedir'],
      'Pedido': ['A recibir'],
      'A recibir': ['Recibido'],
      'Recibido': ['Cerrar']
    };
    // @ts-ignore
    return secuenciaEstados[this.estadoActual] || [];
  }

  cambiarEstado(nuevoEstado: string): void {
    const compraId = this.compra.id;
    this.compraService.cambiarEstadoCompra(compraId, nuevoEstado, Number(this.id_usuario)).subscribe(
      (response) => {
        this.estadoActual = nuevoEstado;
        this.obtenerCompra(compraId); // Recarga los datos para reflejar el nuevo estado
      },
      (error) => {
        console.error('Error al cambiar el estado:', error);
      }
    );
  }

  abrirFormularioIngreso() {
    // Navegar a un componente de ingreso o abrir un formulario/modal de ingreso
    this.router.navigate(['/ingreso', this.compra.id]);  // Ejemplo de navegación a un componente de ingreso
  }

  registrarPagoCompra(compraId: number, proveedorId: number, monto_total: number): void {
    this.pagoService.setDatosPago({
      tipo_pago: 'compra',
      id_proveedor: proveedorId,
      id_compra: compraId,
      monto: monto_total,
    });
    this.router.navigate(['/registrar-pago']);
  }

  verificarIngresos(id_compra:number): void {
    this.compraService.verificarIngreso(id_compra).subscribe((data: any) => {
      this.generarIngresoHabilitado = !data.todos_ingresos_realizados;
    });
  }

  protected readonly Number = Number;
}
