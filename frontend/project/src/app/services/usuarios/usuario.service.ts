import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  obtenerUsuariosPorEmpresa(idEmpresa: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/empresa/${idEmpresa}/`);
  }

  darDeBajaCliente(id: number, fechaBaja: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/clientes/${id}/baja/`, { fecha_baja: fechaBaja });
  }

  darDeBajaColaborador(id: number, fechaBaja: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/colaboradores/${id}/baja/`, { fecha_baja: fechaBaja });
  }
}
