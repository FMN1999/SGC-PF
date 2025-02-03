import { Component, HostListener, Renderer2 } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import {NgIf, NgClass, NgOptimizedImage, NgForOf, DatePipe} from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import {DataShareService} from "../../services/data-share/data-share.service";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  imports: [RouterModule, RouterOutlet, NgIf, CarouselModule, NgClass, NgOptimizedImage, NgForOf, DatePipe],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  // @ts-ignore
  idEmpresa = +sessionStorage.getItem('id_empresa')
  isLoggedIn: boolean = false;
  isDesktop: boolean = true;
  sidebarVisible: boolean = false;
  esColaborador: string = '';
  usuarioActualId: string | null = sessionStorage.getItem('id_usuario');  // Obtener el ID del usuario
  protected userMenuVisible: boolean = false;
  stats: any;
  tareasProximas: any[] = []; // Almacena las tareas próximas

  constructor(private authService: AuthService, private router: Router, protected dataShare: DataShareService,
              private renderer: Renderer2, private titleService: Title) {
    this.titleService.setTitle('Home');
    this.checkScreenSize();

    // Suscribirse al estado de autenticación
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;

      // @ts-ignore
      const id_user = +sessionStorage.getItem('id_usuario');
      // @ts-ignore
      this.esColaborador = sessionStorage.getItem('tipo');
      this.authService.cargarPermisos(id_user).subscribe({});
      this.authService.cargarAdicionales().subscribe({
        next: (data) => {
          this.stats = data; // Guardamos las estadísticas generales
          this.tareasProximas = data.tareas_proximas; // Guardamos las tareas próximas
        },
        error: (error) => {
          console.error('Error al cargar estadísticas:', error);
        }
      });
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


