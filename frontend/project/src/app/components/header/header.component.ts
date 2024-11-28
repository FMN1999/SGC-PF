import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service'
import {NgIf} from "@angular/common";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faUser } from '@fortawesome/free-solid-svg-icons'; // Importa los íconos necesarios


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    FaIconComponent
  ]
})
export class HeaderComponent {
  userMenuVisible = false; // Controla la visibilidad del menú desplegable

  constructor(private router: Router, private authService: AuthService) { library.add(faHome, faUser); }

  toggleUserMenu(): void {
    this.userMenuVisible = !this.userMenuVisible; // Alternar la visibilidad del menú
  }

  irAlHome(): void {
    this.router.navigate(['/home']); // Redirige al Home
  }

  irAlPerfil(): void {
    // @ts-ignore
    const id_user = +sessionStorage.getItem('id_usuario');
    this.router.navigate(['/perfil', id_user]); // Redirige a la página de perfil
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/home']); // Redirige a la página de login
  }
}
