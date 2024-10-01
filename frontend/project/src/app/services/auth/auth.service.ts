import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Asegúrate de importar HttpClient
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api'; // Ajusta esta URL a la de tu API

  constructor(private http: HttpClient) {}  // Asegúrate de inyectar HttpClient

  login(usuario: string, contrasenia: string): Observable<any> {
    const url = `${this.apiUrl}/login/`;
    return this.http.post(url, { usuario, contrasenia });
  }

  register(user: any): Observable<any> {
    const url = `${this.apiUrl}/register`;
    return this.http.post(url, user);
  }

  recoverPassword(email: string): Observable<any> {
    const url = `${this.apiUrl}/recover-password`;
    return this.http.post(url, { email });
  }
}
