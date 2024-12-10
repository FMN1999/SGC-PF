import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { CompraService } from '../../services/compra/compra.service';
import { PagoService } from '../../services/pago/pago.service'
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import { HeaderComponent } from '../header/header.component';

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

  constructor(
    private route: ActivatedRoute,
    private compraService: CompraService,
    private pagoService: PagoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // @ts-ignore
    this.id_usuario = sessionStorage.getItem('id_usuario');
    const compraId = Number(this.route.snapshot.paramMap.get('id'));
    this.obtenerCompra(compraId);
    this.verificarIngresos(compraId);
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

  registrarPagoCompra(compraId: number, proveedorId: number): void {
    this.pagoService.setDatosPago({
      tipo_pago: 'compra',
      id_proveedor: proveedorId,
      id_compra: compraId
    });
    this.router.navigate(['/registrar-pago']);
  }

  verificarIngresos(id_compra:number): void {
    this.compraService.verificarIngreso(id_compra).subscribe((data: any) => {
      this.generarIngresoHabilitado = !data.todos_ingresos_realizados;
    });
  }
}
