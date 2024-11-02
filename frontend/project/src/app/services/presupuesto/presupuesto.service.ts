import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresupuestoService {
  private apiUrl = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) {}

  crearPresupuesto(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}crear-presupuesto/`, data);
  }
  getPresupuestoDetalles(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}presupuesto/${id}/`);
  }

  actualizarPresupuesto(idPresupuesto: number, presupuestoData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}presupuestos/${idPresupuesto}/actualizar/`, presupuestoData);
  }

  eliminarMaterial(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}presupuesto-material/${id}/eliminar/`);
  }

  eliminarServicio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}presupuesto-servicio/${id}/eliminar/`);
  }

  eliminarTrabajador(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}presupuesto-trabajador/${id}/eliminar/`);
  }

  getMaterialesPorPresupuesto(idPresupuesto: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}presupuesto/${idPresupuesto}/materiales`);
  }

}
