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

  obtenerVehiculosPorEmpresa(id_empresa: number):Observable<any> {
    return this.http.get(`${this.apiUrl}/vehiculos/${id_empresa}/`);
  }

  obtenerHerramientasPorEmpresa(id_empresa: number):Observable<any> {
    return this.http.get(`${this.apiUrl}/herramientas/${id_empresa}/`);
  }

  obtenerAlmacenesPorEmpresa(id_empresa: number):Observable<any> {
    return this.http.get(`${this.apiUrl}/almacenes/${id_empresa}/`);
  }

  obtenerObrasPorEmpresa(id_empresa: number):Observable<any> {
    return this.http.get(`${this.apiUrl}/obras-empresa/${id_empresa}/`);
  }

  obtenerAlmacenesConDetalles(id_empresa: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/almacenes-detalles/${id_empresa}/`);
  }

  obtenerBalanceFinanciero(empresaId: number, anio: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/balance-financiero/${empresaId}/anio/${anio}`);
  }
}

