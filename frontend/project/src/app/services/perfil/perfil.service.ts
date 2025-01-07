import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = `${environment.apiUrl}/perfil`;

  constructor(private http: HttpClient) {}

  obtenerPerfil(userId: number) {
    return this.http.get(`${this.apiUrl}/${userId}/`);
  }

  // Método para actualizar el perfil
  actualizarPerfil(userId: number, perfilData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/`, perfilData);  // Llamada PUT para actualizar el perfil
  }

  obrasPorUsuario(userId: number): Observable<any>{
    return this.http.get(`${this.apiUrl}/${userId}/obras/`)
  }

  tareasPorUsuario(userId: number): Observable<any>{
    return this.http.get(`${this.apiUrl}/${userId}/tareas/`)
  }

}

