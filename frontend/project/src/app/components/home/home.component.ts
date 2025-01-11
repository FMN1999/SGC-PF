import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { NgIf, NgClass, NgOptimizedImage } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import {DataShareService} from "../../services/data-share/data-share.service";

@Component({
  selector: 'app-home',
  imports: [RouterModule, RouterOutlet, NgIf, CarouselModule, NgClass, NgOptimizedImage],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  // @ts-ignore
  idEmpresa = +sessionStorage.getItem('id_empresa')
  isLoggedIn: boolean = false;
  isDesktop: boolean = true;
  sidebarVisible: boolean = true;
  usuarioActualId: string | null = sessionStorage.getItem('id_usuario');  // Obtener el ID del usuario
  es_colaborador;
  protected userMenuVisible: boolean = false;

  constructor(private authService: AuthService, private router: Router, protected dataShare: DataShareService) {
    this.checkScreenSize();

    // Suscribirse al estado de autenticación
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    this.es_colaborador = sessionStorage.getItem('rol');
    // @ts-ignore
    const id_user = +sessionStorage.getItem('id_usuario');
    this.authService.cargarPermisos(id_user);
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

  navigateTo(route: string, param?: any): void {
    const fullPath = param ? `${route}/${param}` : route;
    this.router.navigate([fullPath]);
  }

  toggleUserMenu(): void {
    this.userMenuVisible = !this.userMenuVisible;
  }

  cerrarSesion(): void {
    // Lógica de cierre de sesión
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}


