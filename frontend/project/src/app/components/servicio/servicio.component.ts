import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProveedorService } from '../../services/proveedor/proveedor.service';
import { AuthService } from '../../services/auth/auth.service';
import { DataShareService } from '../../services/data-share/data-share.service';
import { NgIf } from "@angular/common";
import { FormsModule } from '@angular/forms'; // Importar FormsModule para usar ngModel
import {HeaderComponent} from '../header/header.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  imports: [
    NgIf,
    FormsModule,
    HeaderComponent
  ],
  standalone: true,
  styleUrls: ['./servicio.component.scss']
})
export class ServicioComponent implements OnInit {
  servicio: any;
  isEditing = false;
  isLoggedIn: boolean =false;

  constructor(
    private route: ActivatedRoute,
    private proveedorService: ProveedorService,
    private router: Router,
    private authService: AuthService,
    protected dataShare: DataShareService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Datos de Servicio');
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (!this.isLoggedIn) {
        this.router.navigate(['/no-permissions']);
      }
      this.initLogueado();
    });
  }

  initLogueado(): void {
    const es_cliente = sessionStorage.getItem('tipo');
    if(es_cliente==='CL'){
      this.router.navigate(['/no-permissions']);
    }
    const id_user = +sessionStorage.getItem('id_usuario')!;
    this.authService.cargarPermisos(id_user).subscribe({});

    const servicioId = this.route.snapshot.params['id'];
    this.proveedorService.getServicioById(servicioId).subscribe({
      next: (data) => {
        this.servicio = data;
        const empr_serv = this.servicio.id_empresa;
        // @ts-ignore
        const id_emp = +sessionStorage.getItem('id_empresa');
        if (id_emp !== empr_serv){
          this.router.navigate(['/no-permissions']);
        }

      },
      error: (err) => console.error(err)
    });
  }

  navigateBack(): void {
    const proveedorId = this.servicio.id_proveedor;  // Asumiendo que el servicio tiene una referencia al proveedor
    this.router.navigate([`/proveedor/${proveedorId}`]).then(r => {});
  }

  enableEditing(): void {
    this.isEditing = true;
  }

  cancelEditing(): void {
    this.isEditing = false;
  }

  updateServicio(): void {
    this.proveedorService.updateServicio(this.servicio.id, this.servicio).subscribe({
      next: () => {
        this.isEditing = false;
        console.log('Servicio actualizado correctamente');
      },
      error: (err) => console.error('Error al actualizar el servicio:', err)
    });
  }
}


