import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http'; // Asegúrate de importar HttpClient
import {BehaviorSubject, Observable} from 'rxjs';
import {tap} from 'rxjs/operators'; // Importar tap desde rxjs/operators
import {environment} from '../../../environments/environment';
import { DataShareService } from '../data-share/data-share.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient,  private dataShareService: DataShareService) {}  // Asegúrate de inyectar HttpClient

  // Verificar si hay un token en localStorage
  private hasToken(): boolean {
    return !!sessionStorage.getItem('token');
  }

  // Observable para saber si el usuario está logueado
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  // Función de login que actualiza el estado
  login(usuario: string, contrasenia: string) {
    return this.http.post(`${this.apiUrl}/login/`, { usuario, contrasenia }).pipe(
      tap((response: any) => {
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('id_usuario',response.user_id);
        sessionStorage.setItem('rol', response.rol);
        sessionStorage.setItem('id_empresa', response.id_emp)
        this.loggedIn.next(true); // Notifica que el usuario se ha logueado
        this.cargarPermisos(response.user_id); // Cargar permisos después del login
      })
    );
  }

  cargarPermisos(idUsuario: number): void {
    this.http.get(`${this.apiUrl}/permisos/${idUsuario}/`).subscribe((response: any) => {
      const permisos = response.permisos || [];
      console.log(permisos);
      this.actualizarPermisos(permisos);
    });
  }

  actualizarPermisos(permisos: number[]): void {
    // Cambia las variables del DataShareService según los permisos
    for (let i = 1; i <= 16; i++) {
      (this.dataShareService as any)[`permiso${i}`] = permisos.includes(i);
    }
  }

  // Función de logout
  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('rol');
    sessionStorage.removeItem('id_empresa');
    sessionStorage.removeItem('id_usuario');
    this.loggedIn.next(false); // Notifica que el usuario se ha deslogueado
  }

  register(user: any): Observable<any> {
    const url = `${this.apiUrl}/register/`;
    return this.http.post(url, user);
  }

  crearColaborador(request: any): Observable<any> {
    const url = `${this.apiUrl}/crear-usuario-colaborador/`;
    return this.http.post(url, request);
  }
}
