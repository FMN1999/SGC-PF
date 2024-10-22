import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { NgIf, NgClass, NgOptimizedImage } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, RouterOutlet, NgIf, CarouselModule, NgClass, NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  isLoggedIn: boolean = false;
  isDesktop: boolean = true;
  sidebarVisible: boolean = true;
  usuarioActualId: string | null = sessionStorage.getItem('id_user');  // Obtener el ID del usuario

  constructor(private authService: AuthService, private router: Router) {
    this.checkScreenSize();

    // Suscribirse al estado de autenticación
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isDesktop = window.innerWidth > 768;
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  getMainContentClass() {
    return this.sidebarVisible ? 'with-sidebar' : 'without-sidebar';
  }

  // Método para navegar al perfil del usuario actual
  irAlPerfil() {
    if (this.usuarioActualId) {
      this.router.navigate([`/perfil/${this.usuarioActualId}`]);  // Redirigir al perfil con el ID del usuario actual
    }
  }
}


