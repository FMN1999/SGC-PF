import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Asegúrate de importar HttpClient
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';   // Importar tap desde rxjs/operators

import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}  // Asegúrate de inyectar HttpClient

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
      })
    );
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

  recoverPassword(email: string): Observable<any> {
    const url = `${this.apiUrl}/recover-password`;
    return this.http.post(url, { email });
  }

  crearColaborador(request: any): Observable<any> {
    const url = `${this.apiUrl}/crear-usuario-colaborador/`;
    return this.http.post(url, request);
  }
}
