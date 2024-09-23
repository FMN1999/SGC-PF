import { Component, HostListener } from '@angular/core';
import { NgIf } from '@angular/common';  // Importa solo NgIf
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, RouterOutlet, NgIf, SidebarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  isLoggedIn: boolean = true; // Suponemos que el usuario está logueado
  isDesktop: boolean = true;  // Verifica si la pantalla es de escritorio

  constructor() {
    this.checkScreenSize(); // Revisa el tamaño de la pantalla cuando el componente se carga
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
    // Lógica para mostrar/ocultar el sidebar en móviles
  }

  logout() {
    localStorage.removeItem('token');
    // Redirigir a home
  }
}

