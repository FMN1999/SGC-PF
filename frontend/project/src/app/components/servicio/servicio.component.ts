import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProveedorService } from '../../services/proveedor/proveedor.service';
import { NgIf } from "@angular/common";
import { FormsModule } from '@angular/forms'; // Importar FormsModule para usar ngModel

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  standalone: true,
  imports: [
    NgIf,
    FormsModule
  ],
  styleUrls: ['./servicio.component.scss']
})
export class ServicioComponent implements OnInit {
  servicio: any;
  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private proveedorService: ProveedorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const servicioId = this.route.snapshot.params['id'];
    this.proveedorService.getServicioById(servicioId).subscribe({
      next: (data) => this.servicio = data,
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


