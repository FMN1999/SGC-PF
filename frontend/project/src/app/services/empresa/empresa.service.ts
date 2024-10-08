import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private apiUrl = 'http://localhost:8000/api/empresas/';  // Ajusta la URL según tu backend

  constructor(private http: HttpClient) {}

  // Método para obtener la lista de empresas
  obtenerEmpresas(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}

