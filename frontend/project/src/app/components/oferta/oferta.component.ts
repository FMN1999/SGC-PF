import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { ProveedorService } from '../../services/proveedor/proveedor.service';
import { AuthService } from '../../services/auth/auth.service';
import { DataShareService } from '../../services/data-share/data-share.service';
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {HeaderComponent} from '../header/header.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-oferta',
  templateUrl: './oferta.component.html',
  imports: [
    NgIf,
    DatePipe,
    NgForOf,
    HeaderComponent,
    CurrencyPipe,
    RouterLink
  ],
  standalone: true,
  styleUrls: ['./oferta.component.scss']
})
export class OfertaComponent implements OnInit {
  oferta: any;
  materiales: any[] = [];
  servicios: any[] = [];
  isLoggedIn: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private proveedorService: ProveedorService,
    private router: Router,
    private authService: AuthService,
    private dataShare: DataShareService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Oferta');
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    if (!this.isLoggedIn) {
      this.router.navigate(['/no-permissions']);
    }

    // @ts-ignore
    const id_user = +sessionStorage.getItem('id_usuario');
    // @ts-ignore
    const tipo_usuario = sessionStorage.getItem('tipo');
    this.authService.cargarPermisos(id_user);

    if (tipo_usuario ==='CL'){
      this.router.navigate(['/no-permissions']);
    }

    // @ts-ignore
    const id_empresa = +sessionStorage.getItem('id_empresa');

    const ofertaId = this.route.snapshot.params['id'];
    this.proveedorService.getOfertaById(ofertaId).subscribe({
      next: (data) => {
        const id_emp = data.oferta.id_empresa;
        if (id_empresa !== id_emp){
          this.router.navigate(['/no-permissions']);
        }
        this.oferta = data.oferta;
        this.materiales = data.materiales;
        this.servicios = data.servicios;
      },
      error: (err) => console.error(err)
    });
  }

  navigateBack(): void {
    const proveedorId = this.oferta.id_proveedor;  // Asumiendo que la oferta tiene una referencia al proveedor
    this.router.navigate([`/proveedor/${proveedorId}`]).then(r => {});
  }
}

