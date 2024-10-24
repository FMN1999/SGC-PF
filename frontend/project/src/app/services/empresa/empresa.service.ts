import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private apiUrl = 'http://localhost:8000/api';  // Ajusta la URL según tu backend

  constructor(private http: HttpClient) {}

  // Método para obtener la lista de empresas
  obtenerEmpresas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/empresas/`)
  }

  listarMaterialesPorEmpresa(idEmpresa: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/materiales/empresa/${idEmpresa}/`);
  }

  obtenerServiciosPorEmpresa(idEmpresa: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/empresa/${idEmpresa}/servicios/`);
  }

  obtenerClientes(id_empresa: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/clientes/${id_empresa}/`);
  }
}

