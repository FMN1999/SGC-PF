import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProveedorService } from '../../services/proveedor/proveedor.service';  // Asegúrate de que la ruta del servicio sea correcta
import {FormsModule, NgForm} from '@angular/forms';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-crear-servicio',
  templateUrl: './crear-servicio.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrls: ['./crear-servicio.component.scss']
})
export class CrearServicioComponent implements OnInit {

  id_proveedor: number | undefined;  // Para almacenar el ID del proveedor
  mensajeExito: string = '';  // Mensaje de éxito
  mensajeError: string = '';  // Mensaje de error

  // Definimos la estructura del servicio que se va a crear
  servicioData = {
    descripcion: '',
    precio_x_unidad: 0,
    unidad_medida: '',
    monto_x_frecuencia: 0,
    frecuencia_pago: ''
  };

  constructor(
    private proveedorService: ProveedorService,  // Inyectamos el servicio
    private route: ActivatedRoute,  // Para obtener el ID del proveedor de la URL
    private router: Router  // Para redirigir después de crear el servicio
  ) { }

  ngOnInit(): void {
    // Obtenemos el ID del proveedor desde la ruta
    this.id_proveedor = +this.route.snapshot.params['id'];  // Asegurarse de que el ID es un número
  }

  // Método para crear el servicio
  crearServicio() {
    // Agregamos el id_proveedor al objeto que se va a enviar
    const data = { ...this.servicioData, id_proveedor: this.id_proveedor };

    // Llamamos al servicio que interactúa con el backend
    this.proveedorService.crearServicio(data).subscribe({
      next: (response) => {
        // Si se crea correctamente, mostramos un mensaje y redirigimos
        this.mensajeExito = 'Servicio creado con éxito';
        this.router.navigate([`/proveedor/${this.id_proveedor}`]).then(r => {});  // Redirige al perfil del proveedor
      },
      error: (error) => {
        // Si hay un error, mostramos un mensaje de error
        this.mensajeError = 'Error al crear el servicio';
      }
    });
  }

}
