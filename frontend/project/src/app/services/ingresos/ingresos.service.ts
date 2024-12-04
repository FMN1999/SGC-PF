import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoService {
  private apiUrl = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) {}

  crearIngresos(ingresoData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}ingreso/`, ingresoData);
  }

  obtenerIngresosPorAlmacen(id_almacen: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/ingresos/${id_almacen}/`);
  }

  realizarIngreso(idIngreso: number): Observable<any> {
    let body = {"id_ingreso": idIngreso}
    return this.http.put(`${this.apiUrl}registrar-ingreso/${idIngreso}/`,body);
  }

  traerTareas(idEmpresa:number):Observable<any>{
    return this.http.get(`${this.apiUrl}tareas-empresa/${idEmpresa}/`);
  }

  actualizaIngreso(idIngreso:number):Observable<any>{
    return this.http.patch(`${this.apiUrl}ingreso-en-obra/${idIngreso}/`, {"id_ingreso":idIngreso});
  }
}

