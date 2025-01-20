import { Component, OnInit } from '@angular/core';
import { ObraService } from '../../services/obra/obra.service';
import { AuthService } from '../../services/auth/auth.service';
import { DataShareService } from '../../services/data-share/data-share.service';
import {ActivatedRoute, Router} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {HeaderComponent} from '../header/header.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-finanzas-obra',
  templateUrl: './finanzas-obra.component.html',
  imports: [
    NgIf,
    NgForOf,
    HeaderComponent
  ],
  standalone: true,
  styleUrls: ['./finanzas-obra.component.scss']
})
export class FinanzasObraComponent implements OnInit {
  // @ts-ignore
  idObra: number;
  pagos: any[] = [];
  cobros: any[] = [];
  isLoggedIn: boolean = false;
  id_cliente: number | undefined;
  id_empresa: number | undefined;

  constructor(
    private obraService: ObraService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private dataShare: DataShareService,
    private router: Router,
    private titleService: Title
    ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Pagos y Cobros de Obra');
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    if (!this.isLoggedIn) {
      this.router.navigate(['/no-permissions']);
    }
    // @ts-ignore
    const id_user = +sessionStorage.getItem('id_usuario');
    // @ts-ignore
    const id_emp = +sessionStorage.getItem('id_empresa');
    this.authService.cargarPermisos(id_user);

    this.idObra = +this.route.snapshot.params['id'];
    if (this.idObra) {
      this.cargarPagosYCobros();
    }

    if (!this.dataShare.permiso10 || this.id_cliente !== id_user ||this.id_empresa!==id_emp) {
      this.router.navigate(['/no-permissions']);
    }
  }

  cargarPagosYCobros(): void {
    this.obraService.obtenerPagosCobrosPorObra(this.idObra).subscribe({
      next: (data) => {
        this.pagos = data.pagos;
        this.cobros = data.cobros;
        this.id_cliente = data.id_cliente;
        this.id_empresa=data.id_empresa;
      },
      error: (err) => console.error('Error al cargar pagos y cobros:', err)
    });
  }
}

