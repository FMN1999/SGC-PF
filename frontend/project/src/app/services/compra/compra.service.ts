import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private apiUrl = 'http://localhost:8000/api/'; // URL del endpoint en el backend

  constructor(private http: HttpClient) {}
  crearCompra(compraData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}solicitud-compra/`, compraData);
  }

  obtenerSolicitudesPendientes(): Observable<any> {
    const id_empresa = sessionStorage.getItem('id_empresa'); // Obtener id_empresa del sessionStorage
    // @ts-ignore
    const params = new HttpParams().set('id_empresa', parseInt(id_empresa) || '');

    return this.http.get<any>(`${this.apiUrl}compras/pendientes/`, { params });
  }

  cambiarEstadoCompra(compraId: number, nuevoEstado: string, id_usuario: number): Observable<any> {
      const body = { nuevo_estado: nuevoEstado, id_usuario: id_usuario };  // Enviar como JSON
      return this.http.put(`${this.apiUrl}compra/${compraId}/cambiar_estado/`, body);
  }

  obtenerCompra(compraId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}compra/${compraId}/`);
  }

  verificarIngreso(compraId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}verificar-ingresos/${compraId}/`);
  }
}
