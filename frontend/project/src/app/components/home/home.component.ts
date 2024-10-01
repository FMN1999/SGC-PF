import { Component, HostListener } from '@angular/core';
import {NgIf, NgClass, NgOptimizedImage} from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CarouselModule } from 'ngx-bootstrap/carousel';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, RouterOutlet, NgIf, CarouselModule, NgClass, NgOptimizedImage ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  isLoggedIn: boolean = false; // Suponemos que el usuario está logueado
  isDesktop: boolean = true;
  sidebarVisible: boolean = true; // Controla la visibilidad del sidebar

  constructor() {
    this.checkScreenSize(); // Revisa el tamaño de la pantalla cuando el componente se carga
    const token = localStorage.getItem('token');
    this.isLoggedIn = !token; // Actualiza el estado según la existencia de un token
  }

  // Detectar el cambio de tamaño de pantalla
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  // Función que cambia el valor de isDesktop según el tamaño de pantalla
  checkScreenSize() {
    this.isDesktop = window.innerWidth > 768; // Pantallas mayores a 768px se consideran escritorio
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible; // Alternar visibilidad del sidebar
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn = false; // Actualizamos el estado
    // Redirigir o realizar cualquier otra acción post logout
  }

  getMainContentClass() {
    return this.sidebarVisible ? 'with-sidebar' : 'without-sidebar';
  }
}
