import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProveedorService } from '../../services/proveedor/proveedor.service';
import {DatePipe, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-oferta',
  standalone: true,
  templateUrl: './oferta.component.html',
  imports: [
    NgIf,
    DatePipe,
    NgForOf
  ],
  styleUrls: ['./oferta.component.scss']
})
export class OfertaComponent implements OnInit {
  oferta: any;
  materiales: any[] = [];
  servicios: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private proveedorService: ProveedorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const ofertaId = this.route.snapshot.params['id'];
    this.proveedorService.getOfertaById(ofertaId).subscribe({
      next: (data) => {
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

