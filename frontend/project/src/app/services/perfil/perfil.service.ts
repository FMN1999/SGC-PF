import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = 'http://localhost:8000/api/perfil';

  constructor(private http: HttpClient) {}

  obtenerPerfil(userId: number) {
    return this.http.get(`${this.apiUrl}/${userId}/`);
  }

  // Método para actualizar el perfil
  actualizarPerfil(userId: number, perfilData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/`, perfilData);  // Llamada PUT para actualizar el perfil
  }
}

